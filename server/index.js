import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getStandings,
  updateStanding,
  getGroupResult,
  upsertGroupResult,
  deleteGroupResult,
  getAllGroupResults,
  getBracketResult,
  upsertBracketResult,
  deleteBracketResult,
  getAllBracketResults,
  resetAllData,
  supabase
} from './db.js';
// Jogadores do campeonato
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Converter dados do banco para formato esperado pelo frontend
const formatStandingsForFrontend = (standingsData) => {
  const formatted = {
    groupA: [],
    groupB: [],
  };
  
  standingsData.forEach(standing => {
    const player = {
      id: standing.player_id,
      name: standing.name,
      type: standing.type,
      typeName: standing.type_name,
      emoji: standing.emoji,
      games: standing.games || 0,
      wins: standing.wins || 0,
      losses: standing.losses || 0,
      points: standing.points || 0,
      pokemonDiff: standing.pokemon_diff || 0,
    };
    
    if (standing.group_id === 'A') {
      formatted.groupA.push(player);
    } else {
      formatted.groupB.push(player);
    }
  });
  
  // Garantir que todos os jogadores estejam presentes
  const allStandings = [...formatted.groupA, ...formatted.groupB];
  const existingIds = new Set(allStandings.map(p => p.id));
  
  // Adicionar jogadores que não estão no banco
  players.groupA.forEach(player => {
    if (!existingIds.has(player.id)) {
      formatted.groupA.push({
        ...player,
        games: 0,
        wins: 0,
        losses: 0,
        points: 0,
        pokemonDiff: 0,
      });
    }
  });
  
  players.groupB.forEach(player => {
    if (!existingIds.has(player.id)) {
      formatted.groupB.push({
        ...player,
        games: 0,
        wins: 0,
        losses: 0,
        points: 0,
        pokemonDiff: 0,
      });
    }
  });
  
  return formatted;
};

// GET /api/data - Obter todos os dados
app.get('/api/data', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ error: 'Banco de dados não configurado' });
    }
    
    const standingsA = await getStandings('A');
    const standingsB = await getStandings('B');
    const allStandings = [...standingsA, ...standingsB];
    
    const resultsA = await getAllGroupResults('A');
    const resultsB = await getAllGroupResults('B');
    const bracketResults = await getAllBracketResults();
    
    const formattedStandings = formatStandingsForFrontend(allStandings);
    
    res.json({
      standings: formattedStandings,
      results: {
        groupA: resultsA,
        groupB: resultsB,
      },
      bracketResults,
      metadata: {
        totalMatches: Object.keys(resultsA).length + Object.keys(resultsB).length,
        totalBracketMatches: Object.keys(bracketResults).length,
      },
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Erro ao ler dados' });
  }
});

// GET /api/standings/:groupId - Obter classificação de um grupo
app.get('/api/standings/:groupId', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ error: 'Banco de dados não configurado' });
    }
    
    const { groupId } = req.params;
    const standings = await getStandings(groupId.toUpperCase());
    
    // Converter para formato esperado
    const formatted = standings.map(s => ({
      id: s.player_id,
      name: s.name,
      type: s.type,
      typeName: s.type_name,
      emoji: s.emoji,
      games: s.games || 0,
      wins: s.wins || 0,
      losses: s.losses || 0,
      points: s.points || 0,
      pokemonDiff: s.pokemon_diff || 0,
    }));
    
    res.json(formatted);
  } catch (error) {
    console.error('Error reading standings:', error);
    res.status(500).json({ error: 'Erro ao ler classificação' });
  }
});

// POST /api/results - Adicionar/atualizar resultado de partida
app.post('/api/results', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ error: 'Banco de dados não configurado' });
    }
    
    const { groupId, round, matchIndex, winnerId, loserId, pokemonDiff } = req.body;
    const groupIdUpper = groupId.toUpperCase();
    
    // Verificar se já existe resultado
    const oldResult = await getGroupResult(groupIdUpper, round, matchIndex);
    
    // Reverter pontuação anterior se existir
    if (oldResult) {
      const oldWinner = await getStandings(groupIdUpper).then(s => 
        s.find(p => p.player_id === oldResult.winner_id)
      );
      const oldLoser = await getStandings(groupIdUpper).then(s => 
        s.find(p => p.player_id === oldResult.loser_id)
      );
      
      if (oldWinner) {
        await updateStanding(oldResult.winner_id, groupIdUpper, {
          wins: Math.max(0, oldWinner.wins - 1),
          points: Math.max(0, oldWinner.points - 3),
          pokemon_diff: oldWinner.pokemon_diff - oldResult.pokemon_diff,
          games: Math.max(0, oldWinner.games - 1),
        });
      }
      if (oldLoser) {
        await updateStanding(oldResult.loser_id, groupIdUpper, {
          losses: Math.max(0, oldLoser.losses - 1),
          pokemon_diff: oldLoser.pokemon_diff + oldResult.pokemon_diff,
          games: Math.max(0, oldLoser.games - 1),
        });
      }
    }
    
    // Salvar novo resultado
    await upsertGroupResult({
      group_id: groupIdUpper,
      round,
      match_index: matchIndex,
      winner_id: winnerId,
      loser_id: loserId,
      pokemon_diff: pokemonDiff,
    });
    
    // Atualizar pontuação dos jogadores
    const winnerStanding = await getStandings(groupIdUpper).then(s => 
      s.find(p => p.player_id === winnerId)
    );
    const loserStanding = await getStandings(groupIdUpper).then(s => 
      s.find(p => p.player_id === loserId)
    );
    
    if (winnerStanding) {
      await updateStanding(winnerId, groupIdUpper, {
        wins: (winnerStanding.wins || 0) + 1,
        points: (winnerStanding.points || 0) + 3,
        pokemon_diff: (winnerStanding.pokemon_diff || 0) + pokemonDiff,
        games: (winnerStanding.games || 0) + 1,
      });
    } else {
      // Criar standing se não existir
      const player = [...players.groupA, ...players.groupB].find(p => p.id === winnerId);
      if (player) {
        await upsertStanding({
          player_id: winnerId,
          group_id: groupIdUpper,
          name: player.name,
          type: player.type,
          type_name: player.typeName,
          emoji: player.emoji,
          wins: 1,
          points: 3,
          pokemon_diff: pokemonDiff,
          games: 1,
          losses: 0,
        });
      }
    }
    
    if (loserStanding) {
      await updateStanding(loserId, groupIdUpper, {
        losses: (loserStanding.losses || 0) + 1,
        pokemon_diff: (loserStanding.pokemon_diff || 0) - pokemonDiff,
        games: (loserStanding.games || 0) + 1,
      });
    } else {
      // Criar standing se não existir
      const player = [...players.groupA, ...players.groupB].find(p => p.id === loserId);
      if (player) {
        await upsertStanding({
          player_id: loserId,
          group_id: groupIdUpper,
          name: player.name,
          type: player.type,
          type_name: player.typeName,
          emoji: player.emoji,
          losses: 1,
          pokemon_diff: -pokemonDiff,
          games: 1,
          wins: 0,
          points: 0,
        });
      }
    }
    
    // Retornar dados atualizados
    const standingsA = await getStandings('A');
    const standingsB = await getStandings('B');
    const allStandings = [...standingsA, ...standingsB];
    const resultsA = await getAllGroupResults('A');
    const resultsB = await getAllGroupResults('B');
    const bracketResults = await getAllBracketResults();
    
    res.json({
      success: true,
      data: {
        standings: formatStandingsForFrontend(allStandings),
        results: {
          groupA: resultsA,
          groupB: resultsB,
        },
        bracketResults,
        metadata: {
          totalMatches: Object.keys(resultsA).length + Object.keys(resultsB).length,
          totalBracketMatches: Object.keys(bracketResults).length,
        },
      },
    });
  } catch (error) {
    console.error('Error updating result:', error);
    res.status(500).json({ error: 'Erro ao atualizar resultado' });
  }
});

// DELETE /api/results - Remover resultado de partida
app.delete('/api/results', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ error: 'Banco de dados não configurado' });
    }
    
    const { groupId, round, matchIndex } = req.body;
    const groupIdUpper = groupId.toUpperCase();
    
    const oldResult = await getGroupResult(groupIdUpper, round, matchIndex);
    if (!oldResult) {
      return res.status(404).json({ error: 'Resultado não encontrado' });
    }
    
    // Reverter pontuação
    const oldWinner = await getStandings(groupIdUpper).then(s => 
      s.find(p => p.player_id === oldResult.winner_id)
    );
    const oldLoser = await getStandings(groupIdUpper).then(s => 
      s.find(p => p.player_id === oldResult.loser_id)
    );
    
    if (oldWinner) {
      await updateStanding(oldResult.winner_id, groupIdUpper, {
        wins: Math.max(0, oldWinner.wins - 1),
        points: Math.max(0, oldWinner.points - 3),
        pokemon_diff: oldWinner.pokemon_diff - oldResult.pokemon_diff,
        games: Math.max(0, oldWinner.games - 1),
      });
    }
    if (oldLoser) {
      await updateStanding(oldResult.loser_id, groupIdUpper, {
        losses: Math.max(0, oldLoser.losses - 1),
        pokemon_diff: oldLoser.pokemon_diff + oldResult.pokemon_diff,
        games: Math.max(0, oldLoser.games - 1),
      });
    }
    
    // Remover resultado
    await deleteGroupResult(groupIdUpper, round, matchIndex);
    
    // Retornar dados atualizados
    const standingsA = await getStandings('A');
    const standingsB = await getStandings('B');
    const allStandings = [...standingsA, ...standingsB];
    const resultsA = await getAllGroupResults('A');
    const resultsB = await getAllGroupResults('B');
    const bracketResults = await getAllBracketResults();
    
    res.json({
      success: true,
      data: {
        standings: formatStandingsForFrontend(allStandings),
        results: {
          groupA: resultsA,
          groupB: resultsB,
        },
        bracketResults,
        metadata: {
          totalMatches: Object.keys(resultsA).length + Object.keys(resultsB).length,
          totalBracketMatches: Object.keys(bracketResults).length,
        },
      },
    });
  } catch (error) {
    console.error('Error deleting result:', error);
    res.status(500).json({ error: 'Erro ao remover resultado' });
  }
});

// POST /api/bracket-results - Adicionar/atualizar resultado do mata-mata
app.post('/api/bracket-results', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ error: 'Banco de dados não configurado' });
    }
    
    const { matchId, winnerId, loserId, pokemonDiff, player1Id, player2Id } = req.body;
    
    await upsertBracketResult({
      match_id: matchId,
      winner_id: winnerId,
      loser_id: loserId,
      player1_id: player1Id,
      player2_id: player2Id,
      pokemon_diff: pokemonDiff,
    });
    
    // Retornar dados atualizados
    const standingsA = await getStandings('A');
    const standingsB = await getStandings('B');
    const allStandings = [...standingsA, ...standingsB];
    const resultsA = await getAllGroupResults('A');
    const resultsB = await getAllGroupResults('B');
    const bracketResults = await getAllBracketResults();
    
    res.json({
      success: true,
      data: {
        standings: formatStandingsForFrontend(allStandings),
        results: {
          groupA: resultsA,
          groupB: resultsB,
        },
        bracketResults,
        metadata: {
          totalMatches: Object.keys(resultsA).length + Object.keys(resultsB).length,
          totalBracketMatches: Object.keys(bracketResults).length,
        },
      },
    });
  } catch (error) {
    console.error('Error updating bracket result:', error);
    res.status(500).json({ error: 'Erro ao atualizar resultado do mata-mata' });
  }
});

// DELETE /api/bracket-results - Remover resultado do mata-mata
app.delete('/api/bracket-results', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ error: 'Banco de dados não configurado' });
    }
    
    const { matchId } = req.body;
    
    const oldResult = await getBracketResult(matchId);
    if (!oldResult) {
      return res.status(404).json({ error: 'Resultado não encontrado' });
    }
    
    await deleteBracketResult(matchId);
    
    // Retornar dados atualizados
    const standingsA = await getStandings('A');
    const standingsB = await getStandings('B');
    const allStandings = [...standingsA, ...standingsB];
    const resultsA = await getAllGroupResults('A');
    const resultsB = await getAllGroupResults('B');
    const bracketResults = await getAllBracketResults();
    
    res.json({
      success: true,
      data: {
        standings: formatStandingsForFrontend(allStandings),
        results: {
          groupA: resultsA,
          groupB: resultsB,
        },
        bracketResults,
        metadata: {
          totalMatches: Object.keys(resultsA).length + Object.keys(resultsB).length,
          totalBracketMatches: Object.keys(bracketResults).length,
        },
      },
    });
  } catch (error) {
    console.error('Error deleting bracket result:', error);
    res.status(500).json({ error: 'Erro ao remover resultado do mata-mata' });
  }
});

// POST /api/reset - Resetar todos os dados
app.post('/api/reset', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ error: 'Banco de dados não configurado' });
    }
    
    await resetAllData();
    
    // Retornar dados resetados
    const standingsA = await getStandings('A');
    const standingsB = await getStandings('B');
    const allStandings = [...standingsA, ...standingsB];
    const resultsA = await getAllGroupResults('A');
    const resultsB = await getAllGroupResults('B');
    const bracketResults = await getAllBracketResults();
    
    res.json({
      success: true,
      data: {
        standings: formatStandingsForFrontend(allStandings),
        results: {
          groupA: resultsA,
          groupB: resultsB,
        },
        bracketResults,
        metadata: {
          totalMatches: 0,
          totalBracketMatches: 0,
        },
      },
    });
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
  if (supabase) {
    console.log('✅ Conectado ao Supabase');
  } else {
    console.warn('⚠️  Supabase não configurado. Configure SUPABASE_URL e SUPABASE_ANON_KEY');
  }
  
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📊 API disponível em http://localhost:${PORT}/api`);
    if (process.env.NODE_ENV === 'production') {
      console.log(`🌐 Frontend disponível em http://localhost:${PORT}`);
    }
  });
};

startServer().catch(console.error);
