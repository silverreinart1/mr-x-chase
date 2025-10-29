import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GameMap } from "./GameMap";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getAllAvailableMoves } from "@/lib/gameMap";
import { Database } from "@/integrations/supabase/types";

type Game = Database['public']['Tables']['games']['Row'];
type Player = Database['public']['Tables']['players']['Row'];
type Move = Database['public']['Tables']['moves']['Row'];
type TransportType = Database['public']['Enums']['transport_type'];

interface GameBoardProps {
  gameId: string;
  userId: string;
  onLeaveGame: () => void;
}

export const GameBoard = ({ gameId, userId, onLeaveGame }: GameBoardProps) => {
  const [game, setGame] = useState<Game | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [moves, setMoves] = useState<Move[]>([]);
  const [selectedTransport, setSelectedTransport] = useState<TransportType | null>(null);
  const [availableMoves, setAvailableMoves] = useState<number[]>([]);

  useEffect(() => {
    fetchGameData();

    const gamesChannel = supabase
      .channel('game-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'games', filter: `id=eq.${gameId}` }, fetchGameData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'players', filter: `game_id=eq.${gameId}` }, fetchGameData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'moves', filter: `game_id=eq.${gameId}` }, fetchGameData)
      .subscribe();

    return () => {
      supabase.removeChannel(gamesChannel);
    };
  }, [gameId]);

  const fetchGameData = async () => {
    const [gameRes, playersRes, movesRes] = await Promise.all([
      supabase.from('games').select('*').eq('id', gameId).single(),
      supabase.from('players').select('*').eq('game_id', gameId),
      supabase.from('moves').select('*').eq('game_id', gameId).order('created_at', { ascending: true })
    ]);

    if (gameRes.data) setGame(gameRes.data);
    if (playersRes.data) {
      setPlayers(playersRes.data);
      const player = playersRes.data.find(p => p.user_id === userId);
      setCurrentPlayer(player || null);
    }
    if (movesRes.data) setMoves(movesRes.data);
  };

  const handleTransportSelect = (transport: TransportType) => {
    if (!currentPlayer) return;

    setSelectedTransport(transport);
    const allMoves = getAllAvailableMoves(currentPlayer.current_position);
    
    let available: number[] = [];
    if (transport === 'taxi') available = allMoves.taxi;
    else if (transport === 'bus') available = allMoves.bus;
    else if (transport === 'underground') available = allMoves.underground;

    setAvailableMoves(available);
  };

  const handleMove = async (toPosition: number) => {
    if (!currentPlayer || !selectedTransport || !game) return;

    const ticketField = `${selectedTransport}_tickets` as keyof Player;
    const currentTickets = currentPlayer[ticketField] as number;

    if (currentTickets <= 0) {
      toast.error(`No ${selectedTransport} tickets left!`);
      return;
    }

    try {
      // Create move
      await supabase.from('moves').insert([{
        game_id: gameId,
        player_id: currentPlayer.id,
        from_position: currentPlayer.current_position,
        to_position: toPosition,
        transport: selectedTransport,
        turn_number: game.current_turn,
        revealed: currentPlayer.role === 'mr_x' && (game.current_turn % 3 === 0 || game.current_turn === 1)
      }]);

      // Update player position and tickets
      const updates: any = {
        current_position: toPosition,
        [ticketField]: currentTickets - 1
      };

      await supabase.from('players').update(updates).eq('id', currentPlayer.id);

      // Update game turn
      await supabase.from('games').update({
        current_turn: game.current_turn + 1
      }).eq('id', gameId);

      setSelectedTransport(null);
      setAvailableMoves([]);
      toast.success("Move completed!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const startGame = async () => {
    if (players.length < 2) {
      toast.error("Need at least 2 players to start!");
      return;
    }

    await supabase.from('games').update({ status: 'in_progress' }).eq('id', gameId);
    toast.success("Game started!");
  };

  if (!game || !currentPlayer) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const playerPositions = players.reduce((acc, p) => {
    acc[p.id] = { position: p.current_position, role: p.role as 'mr_x' | 'detective' };
    return acc;
  }, {} as { [key: string]: { position: number; role: 'mr_x' | 'detective' } });

  const isMyTurn = game.status === 'in_progress';
  const isMrXRevealTurn = game.current_turn % 3 === 0 || game.current_turn === 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-card p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary">{game.name}</h1>
            <Badge className={currentPlayer.role === 'mr_x' ? 'bg-accent' : 'bg-detective'}>
              {currentPlayer.role === 'mr_x' ? 'Mr. X' : 'Detective'}
            </Badge>
          </div>
          <Button onClick={onLeaveGame} variant="outline">Leave Game</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <Card className="border-border bg-card/50 backdrop-blur">
              <CardContent className="p-4">
                <GameMap
                  playerPositions={playerPositions}
                  currentPosition={currentPlayer.current_position}
                  availableMoves={availableMoves}
                  onStationClick={handleMove}
                  showMrX={currentPlayer.role === 'mr_x' || isMrXRevealTurn}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="border-border bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-foreground">Turn {game.current_turn}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {game.status === 'waiting' ? 'Waiting for players...' : 'Game in progress'}
                </p>
                {game.status === 'waiting' && game.mr_x_player === userId && (
                  <Button onClick={startGame} className="w-full bg-primary">
                    Start Game
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="border-border bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-foreground">Your Tickets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={() => handleTransportSelect('taxi')}
                  className="w-full justify-between bg-background/50 hover:bg-taxi/20 text-foreground"
                  disabled={!isMyTurn || currentPlayer.taxi_tickets === 0}
                  variant={selectedTransport === 'taxi' ? 'default' : 'outline'}
                >
                  <span>🚕 Taxi</span>
                  <Badge variant="secondary">{currentPlayer.taxi_tickets}</Badge>
                </Button>
                <Button
                  onClick={() => handleTransportSelect('bus')}
                  className="w-full justify-between bg-background/50 hover:bg-bus/20 text-foreground"
                  disabled={!isMyTurn || currentPlayer.bus_tickets === 0}
                  variant={selectedTransport === 'bus' ? 'default' : 'outline'}
                >
                  <span>🚌 Bus</span>
                  <Badge variant="secondary">{currentPlayer.bus_tickets}</Badge>
                </Button>
                <Button
                  onClick={() => handleTransportSelect('underground')}
                  className="w-full justify-between bg-background/50 hover:bg-underground/20 text-foreground"
                  disabled={!isMyTurn || currentPlayer.underground_tickets === 0}
                  variant={selectedTransport === 'underground' ? 'default' : 'outline'}
                >
                  <span>🚇 Underground</span>
                  <Badge variant="secondary">{currentPlayer.underground_tickets}</Badge>
                </Button>
                {currentPlayer.role === 'mr_x' && (
                  <Button
                    onClick={() => handleTransportSelect('black')}
                    className="w-full justify-between bg-background/50 hover:bg-accent/20 text-foreground"
                    disabled={!isMyTurn || currentPlayer.black_tickets === 0}
                    variant={selectedTransport === 'black' ? 'default' : 'outline'}
                  >
                    <span>⚫ Black</span>
                    <Badge variant="secondary">{currentPlayer.black_tickets}</Badge>
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="border-border bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-foreground">Players</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {players.map(p => (
                  <div key={p.id} className="flex justify-between items-center">
                    <span className="text-sm text-foreground">
                      {p.role === 'mr_x' ? '🎩 Mr. X' : '🔍 Detective'}
                    </span>
                    <Badge variant={p.user_id === userId ? 'default' : 'secondary'}>
                      {p.user_id === userId ? 'You' : 'Player'}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};