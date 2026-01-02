-- Schema do banco de dados para o Campeonato Pokémon Monotype
-- Execute este SQL no SQL Editor do Supabase

-- Tabela de jogadores (standings)
CREATE TABLE IF NOT EXISTS standings (
  id SERIAL PRIMARY KEY,
  player_id VARCHAR(50) NOT NULL,
  group_id VARCHAR(1) NOT NULL CHECK (group_id IN ('A', 'B')),
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  type_name VARCHAR(50) NOT NULL,
  emoji VARCHAR(10),
  games INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  pokemon_diff INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(player_id, group_id)
);

-- Tabela de resultados das partidas da fase de grupos
CREATE TABLE IF NOT EXISTS group_results (
  id SERIAL PRIMARY KEY,
  group_id VARCHAR(1) NOT NULL CHECK (group_id IN ('A', 'B')),
  round INTEGER NOT NULL,
  match_index INTEGER NOT NULL,
  winner_id VARCHAR(50) NOT NULL,
  loser_id VARCHAR(50) NOT NULL,
  pokemon_diff INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(group_id, round, match_index)
);

-- Tabela de resultados do mata-mata
CREATE TABLE IF NOT EXISTS bracket_results (
  id SERIAL PRIMARY KEY,
  match_id VARCHAR(50) NOT NULL UNIQUE,
  winner_id VARCHAR(50) NOT NULL,
  loser_id VARCHAR(50) NOT NULL,
  player1_id VARCHAR(50) NOT NULL,
  player2_id VARCHAR(50) NOT NULL,
  pokemon_diff INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_standings_group ON standings(group_id);
CREATE INDEX IF NOT EXISTS idx_standings_player ON standings(player_id);
CREATE INDEX IF NOT EXISTS idx_group_results_group ON group_results(group_id);
CREATE INDEX IF NOT EXISTS idx_group_results_match ON group_results(group_id, round, match_index);
CREATE INDEX IF NOT EXISTS idx_bracket_results_match ON bracket_results(match_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_standings_updated_at BEFORE UPDATE ON standings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_group_results_updated_at BEFORE UPDATE ON group_results
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bracket_results_updated_at BEFORE UPDATE ON bracket_results
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir jogadores iniciais
INSERT INTO standings (player_id, group_id, name, type, type_name, emoji, games, wins, losses, points, pokemon_diff)
VALUES
  -- Grupo A
  ('ryan', 'A', 'Ryan', 'fairy', 'Fada', '🧚', 0, 0, 0, 0, 0),
  ('frost', 'A', 'Frost', 'ice', 'Gelo', '❄️', 0, 0, 0, 0, 0),
  ('pedro', 'A', 'Pedro', 'poison', 'Veneno', '🐍', 0, 0, 0, 0, 0),
  ('mayron', 'A', 'Mayron', 'fighting', 'Lutador', '🥊', 0, 0, 0, 0, 0),
  -- Grupo B
  ('clark', 'B', 'Clark', 'dark', 'Sombrio', '🌑', 0, 0, 0, 0, 0),
  ('davi', 'B', 'Davi', 'electric', 'Elétrico', '⚡', 0, 0, 0, 0, 0),
  ('daniel', 'B', 'Daniel', 'ghost', 'Fantasma', '👻', 0, 0, 0, 0, 0),
  ('madson', 'B', 'Madson', 'steel', 'Metal', '⚔️', 0, 0, 0, 0, 0)
ON CONFLICT (player_id, group_id) DO NOTHING;

-- Habilitar Row Level Security (RLS)
ALTER TABLE standings ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE bracket_results ENABLE ROW LEVEL SECURITY;

-- Políticas públicas (todos podem ler e escrever)
-- Para um campeonato compartilhado, isso permite que todos vejam e editem

CREATE POLICY "Public read standings" ON standings FOR SELECT USING (true);
CREATE POLICY "Public insert standings" ON standings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update standings" ON standings FOR UPDATE USING (true);
CREATE POLICY "Public delete standings" ON standings FOR DELETE USING (true);

CREATE POLICY "Public read group_results" ON group_results FOR SELECT USING (true);
CREATE POLICY "Public insert group_results" ON group_results FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update group_results" ON group_results FOR UPDATE USING (true);
CREATE POLICY "Public delete group_results" ON group_results FOR DELETE USING (true);

CREATE POLICY "Public read bracket_results" ON bracket_results FOR SELECT USING (true);
CREATE POLICY "Public insert bracket_results" ON bracket_results FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update bracket_results" ON bracket_results FOR UPDATE USING (true);
CREATE POLICY "Public delete bracket_results" ON bracket_results FOR DELETE USING (true);

