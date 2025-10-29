-- Create enum for player roles
CREATE TYPE player_role AS ENUM ('mr_x', 'detective');

-- Create enum for transport types
CREATE TYPE transport_type AS ENUM ('taxi', 'bus', 'underground', 'black');

-- Create enum for game status
CREATE TYPE game_status AS ENUM ('waiting', 'in_progress', 'finished');

-- Create games table
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  status game_status NOT NULL DEFAULT 'waiting',
  current_turn INTEGER NOT NULL DEFAULT 1,
  mr_x_player UUID REFERENCES auth.users(id),
  winner TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- Create players table
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  role player_role NOT NULL,
  current_position INTEGER NOT NULL,
  taxi_tickets INTEGER NOT NULL DEFAULT 10,
  bus_tickets INTEGER NOT NULL DEFAULT 8,
  underground_tickets INTEGER NOT NULL DEFAULT 4,
  black_tickets INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(game_id, user_id)
);

ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Create moves table to track game history
CREATE TABLE moves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  from_position INTEGER NOT NULL,
  to_position INTEGER NOT NULL,
  transport transport_type NOT NULL,
  turn_number INTEGER NOT NULL,
  revealed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE moves ENABLE ROW LEVEL SECURITY;

-- RLS Policies for games
CREATE POLICY "Users can view all games"
  ON games FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create games"
  ON games FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Game creator can update their game"
  ON games FOR UPDATE
  TO authenticated
  USING (mr_x_player = auth.uid());

-- RLS Policies for players
CREATE POLICY "Users can view players in games"
  ON players FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can join games"
  ON players FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own player"
  ON players FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for moves
CREATE POLICY "Users can view moves"
  ON moves FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create moves"
  ON moves FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM players
    WHERE players.id = moves.player_id
    AND players.user_id = auth.uid()
  ));

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE games;
ALTER PUBLICATION supabase_realtime ADD TABLE players;
ALTER PUBLICATION supabase_realtime ADD TABLE moves;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for games table
CREATE TRIGGER update_games_updated_at
  BEFORE UPDATE ON games
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();