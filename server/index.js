import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'data', 'championship.json');

// Middleware
app.use(cors());
app.use(express.json());

// Garantir que o diretório data existe
const ensureDataDir = async () => {
  const dataDir = path.dirname(DATA_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
};

// Jogadores do campeonato (mesmos dados do frontend)
const players = {
  groupA: [
    { id: 'ryan', name: 'Ryan', type: 'fairy', typeName: 'Fada', emoji: '🧚' },
    { id: 'frost', name: 'Frost', type: 'ice', typeName: 'Gelo', emoji: '❄️' },
    { id: 'pedro', name: 'Pedro', type: 'poison', typeName: 'Veneno', emoji: '🐍' },
    { id: 'mayron', name: 'Mayron', type: 'fighting', typeName: 'Lutador', emoji: '🥊' },
  ],
  groupB: [
    { id: 'clark', name: 'Clark', type: 'dark', typeName: 'Sombrio', emoji: '🌑' },
    { id: 'davi', name: 'Davi', type: 'electric', typeName: 'Elétrico', emoji: '⚡' },
    { id: 'daniel', name: 'Daniel', type: 'ghost', typeName: 'Fantasma', emoji: '👻' },
    { id: 'madson', name: 'Madson', type: 'steel', typeName: 'Metal', emoji: '⚔️' },
  ],
};

// Inicializar banco de dados vazio com jogadores
const createEmptyDatabase = () => ({
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  lastUpdated: new Date().toISOString(),
  standings: {
    groupA: players.groupA.map(player => ({
      ...player,
      games: 0,
      wins: 0,
      losses: 0,
      points: 0,
      pokemonDiff: 0,
    })),
    groupB: players.groupB.map(player => ({
      ...player,
      games: 0,
      wins: 0,
      losses: 0,
      points: 0,
      pokemonDiff: 0,
    })),
  },
  results: {
    groupA: {},
    groupB: {},
  },
  bracketResults: {},
  metadata: {
    totalMatches: 0,
    totalBracketMatches: 0,
  },
});

// Ler dados do arquivo
const readData = async () => {
  try {
    await ensureDataDir();
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // Arquivo não existe, criar novo
      const newData = createEmptyDatabase();
      await writeData(newData);
      return newData;
    }
    throw error;
  }
};

// Escrever dados no arquivo
const writeData = async (data) => {
  await ensureDataDir();
  data.lastUpdated = new Date().toISOString();
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
};

// Inicializar banco se necessário
const initializeDatabase = async () => {
  try {
    await readData();
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Rotas da API

// GET /api/data - Obter todos os dados
app.get('/api/data', async (req, res) => {
  try {
    const data = await readData();
    res.json(data);
  } catch (error) {
    console.error('Error reading data:', error);
    res.status(500).json({ error: 'Erro ao ler dados' });
  }
});

// GET /api/standings/:groupId - Obter classificação de um grupo
app.get('/api/standings/:groupId', async (req, res) => {
  try {
    const { groupId } = req.params;
    const data = await readData();
    const groupKey = `group${groupId.toUpperCase()}`;
    res.json(data.standings[groupKey] || []);
  } catch (error) {
    console.error('Error reading standings:', error);
    res.status(500).json({ error: 'Erro ao ler classificação' });
  }
});

// PUT /api/data - Atualizar todos os dados
app.put('/api/data', async (req, res) => {
  try {
    const newData = req.body;
    await writeData(newData);
    res.json({ success: true, data: newData });
  } catch (error) {
    console.error('Error writing data:', error);
    res.status(500).json({ error: 'Erro ao salvar dados' });
  }
});

// POST /api/results - Adicionar/atualizar resultado de partida
app.post('/api/results', async (req, res) => {
  try {
    const { groupId, round, matchIndex, winnerId, loserId, pokemonDiff } = req.body;
    const data = await readData();
    const groupKey = `group${groupId.toUpperCase()}`;
    const resultKey = `${groupId.toUpperCase()}-${round}-${matchIndex}`;
    
    // Atualizar resultado
    if (!data.results[groupKey]) {
      data.results[groupKey] = {};
    }
    
    const oldResult = data.results[groupKey][resultKey];
    
    // Reverter pontuação anterior se existir
    if (oldResult) {
      const oldWinner = data.standings[groupKey]?.find(p => p.id === oldResult.winnerId);
      const oldLoser = data.standings[groupKey]?.find(p => p.id === oldResult.loserId);
      
      if (oldWinner) {
        oldWinner.wins--;
        oldWinner.points -= 3;
        oldWinner.pokemonDiff -= oldResult.pokemonDiff;
        oldWinner.games--;
      }
      if (oldLoser) {
        oldLoser.losses--;
        oldLoser.pokemonDiff += oldResult.pokemonDiff;
        oldLoser.games--;
      }
    }
    
    // Adicionar novo resultado
    data.results[groupKey][resultKey] = {
      winnerId,
      loserId,
      pokemonDiff,
    };
    
    // Atualizar pontuação
    const winner = data.standings[groupKey]?.find(p => p.id === winnerId);
    const loser = data.standings[groupKey]?.find(p => p.id === loserId);
    
    if (winner) {
      winner.wins++;
      winner.points += 3;
      winner.pokemonDiff += pokemonDiff;
      winner.games++;
    }
    if (loser) {
      loser.losses++;
      loser.pokemonDiff -= pokemonDiff;
      loser.games++;
    }
    
    // Atualizar metadata
    data.metadata.totalMatches = Object.keys(data.results.groupA || {}).length + 
                                 Object.keys(data.results.groupB || {}).length;
    
    await writeData(data);
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error updating result:', error);
    res.status(500).json({ error: 'Erro ao atualizar resultado' });
  }
});

// DELETE /api/results - Remover resultado de partida
app.delete('/api/results', async (req, res) => {
  try {
    const { groupId, round, matchIndex } = req.body;
    const data = await readData();
    const groupKey = `group${groupId.toUpperCase()}`;
    const resultKey = `${groupId.toUpperCase()}-${round}-${matchIndex}`;
    
    const oldResult = data.results[groupKey]?.[resultKey];
    if (!oldResult) {
      return res.status(404).json({ error: 'Resultado não encontrado' });
    }
    
    // Reverter pontuação
    const oldWinner = data.standings[groupKey]?.find(p => p.id === oldResult.winnerId);
    const oldLoser = data.standings[groupKey]?.find(p => p.id === oldResult.loserId);
    
    if (oldWinner) {
      oldWinner.wins--;
      oldWinner.points -= 3;
      oldWinner.pokemonDiff -= oldResult.pokemonDiff;
      oldWinner.games--;
    }
    if (oldLoser) {
      oldLoser.losses--;
      oldLoser.pokemonDiff += oldResult.pokemonDiff;
      oldLoser.games--;
    }
    
    // Remover resultado
    delete data.results[groupKey][resultKey];
    
    // Atualizar metadata
    data.metadata.totalMatches = Object.keys(data.results.groupA || {}).length + 
                                 Object.keys(data.results.groupB || {}).length;
    
    await writeData(data);
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error deleting result:', error);
    res.status(500).json({ error: 'Erro ao remover resultado' });
  }
});

// POST /api/bracket-results - Adicionar/atualizar resultado do mata-mata
app.post('/api/bracket-results', async (req, res) => {
  try {
    const { matchId, winnerId, loserId, pokemonDiff, player1Id, player2Id } = req.body;
    const data = await readData();
    
    data.bracketResults[matchId] = {
      winnerId,
      loserId,
      player1Id,
      player2Id,
      pokemonDiff,
    };
    
    data.metadata.totalBracketMatches = Object.keys(data.bracketResults || {}).length;
    
    await writeData(data);
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error updating bracket result:', error);
    res.status(500).json({ error: 'Erro ao atualizar resultado do mata-mata' });
  }
});

// DELETE /api/bracket-results - Remover resultado do mata-mata
app.delete('/api/bracket-results', async (req, res) => {
  try {
    const { matchId } = req.body;
    const data = await readData();
    
    if (!data.bracketResults[matchId]) {
      return res.status(404).json({ error: 'Resultado não encontrado' });
    }
    
    delete data.bracketResults[matchId];
    data.metadata.totalBracketMatches = Object.keys(data.bracketResults || {}).length;
    
    await writeData(data);
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error deleting bracket result:', error);
    res.status(500).json({ error: 'Erro ao remover resultado do mata-mata' });
  }
});

// POST /api/reset - Resetar todos os dados
app.post('/api/reset', async (req, res) => {
  try {
    const newData = createEmptyDatabase();
    await writeData(newData);
    res.json({ success: true, data: newData });
  } catch (error) {
    console.error('Error resetting data:', error);
    res.status(500).json({ error: 'Erro ao resetar dados' });
  }
});

// Servir arquivos estáticos em produção
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Iniciar servidor
const startServer = async () => {
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📊 API disponível em http://localhost:${PORT}/api`);
    if (process.env.NODE_ENV === 'production') {
      console.log(`🌐 Frontend disponível em http://localhost:${PORT}`);
    }
  });
};

startServer().catch(console.error);

