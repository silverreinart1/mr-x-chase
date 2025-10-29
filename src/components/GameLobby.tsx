import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type Game = Database['public']['Tables']['games']['Row'];
type Player = Database['public']['Tables']['players']['Row'];

interface GameLobbyProps {
  user: any;
  onGameStart: (gameId: string) => void;
}

export const GameLobby = ({ user, onGameStart }: GameLobbyProps) => {
  const [games, setGames] = useState<Game[]>([]);
  const [gameName, setGameName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGames();
    
    const channel = supabase
      .channel('games-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'games'
        },
        () => fetchGames()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchGames = async () => {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('status', 'waiting')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error("Failed to load games");
      return;
    }

    setGames(data || []);
  };

  const createGame = async () => {
    if (!gameName.trim()) {
      toast.error("Please enter a game name");
      return;
    }

    setLoading(true);
    try {
      const { data: game, error: gameError } = await supabase
        .from('games')
        .insert([{ name: gameName, mr_x_player: user.id }])
        .select()
        .single();

      if (gameError) throw gameError;

      // Join as Mr. X
      const startPosition = Math.floor(Math.random() * 45) + 1;
      const { error: playerError } = await supabase
        .from('players')
        .insert([{
          game_id: game.id,
          user_id: user.id,
          role: 'mr_x',
          current_position: startPosition,
          black_tickets: 5
        }]);

      if (playerError) throw playerError;

      toast.success("Game created!");
      setGameName("");
      onGameStart(game.id);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const joinGame = async (gameId: string) => {
    setLoading(true);
    try {
      const startPosition = Math.floor(Math.random() * 45) + 1;
      const { error } = await supabase
        .from('players')
        .insert([{
          game_id: gameId,
          user_id: user.id,
          role: 'detective',
          current_position: startPosition
        }]);

      if (error) throw error;

      toast.success("Joined game!");
      onGameStart(gameId);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-card p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-primary">Scotland Yard</h1>
          <Button onClick={handleSignOut} variant="outline">
            Sign Out
          </Button>
        </div>

        <Card className="border-border bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground">Create New Game</CardTitle>
            <CardDescription className="text-muted-foreground">
              Start a new game as Mr. X and wait for detectives to join
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Game name"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
                className="bg-background/50 border-border"
              />
              <Button
                onClick={createGame}
                disabled={loading}
                className="bg-primary hover:bg-primary/90"
              >
                Create
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground">Available Games</CardTitle>
            <CardDescription className="text-muted-foreground">
              Join a game as a detective
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {games.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No games available. Create one to start playing!
                </p>
              ) : (
                games.map((game) => (
                  <div
                    key={game.id}
                    className="flex justify-between items-center p-4 rounded-lg bg-background/50 border border-border hover:border-primary transition-colors"
                  >
                    <div>
                      <h3 className="font-semibold text-foreground">{game.name}</h3>
                      <p className="text-sm text-muted-foreground">Waiting for players...</p>
                    </div>
                    <Button
                      onClick={() => joinGame(game.id)}
                      disabled={loading}
                      className="bg-secondary hover:bg-secondary/90"
                    >
                      Join as Detective
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};