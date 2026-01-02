import { createContext, useContext, useState, useEffect } from 'react';
import { players } from '../data/players';
import { sortStandings } from '../data/standings';

const ChampionshipContext = createContext();

export const useChampionship = () => {
  const context = useContext(ChampionshipContext);
  if (!context) {
    throw new Error('useChampionship must be used within ChampionshipProvider');
  }
  return context;
};

// URL da API - ajuste conforme necessário
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const initialStandings = {
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
};

const normalizeStandings = (standings) => {
  // Lista de IDs válidos para cada grupo
  const validGroupAIds = new Set(players.groupA.map(p => p.id));
  const validGroupBIds = new Set(players.groupB.map(p => p.id));
  
  // Criar mapas de dados salvos por ID
  const savedGroupA = new Map();
  const savedGroupB = new Map();
  
  (standings.groupA || []).forEach(player => {
    if (validGroupAIds.has(player.id)) {
      savedGroupA.set(player.id, player);
    }
  });
  
  (standings.groupB || []).forEach(player => {
    if (validGroupBIds.has(player.id)) {
      savedGroupB.set(player.id, player);
    }
  });
  
  // Garantir que todos os campos necessários existam e manter a ordem correta
  const normalized = {
    groupA: players.groupA.map(basePlayer => {
      const saved = savedGroupA.get(basePlayer.id);
      return {
        ...basePlayer,
        games: saved?.games || 0,
        wins: saved?.wins || 0,
        losses: saved?.losses || 0,
        points: saved?.points || 0,
        pokemonDiff: saved?.pokemonDiff || 0,
      };
    }),
    groupB: players.groupB.map(basePlayer => {
      const saved = savedGroupB.get(basePlayer.id);
      return {
        ...basePlayer,
        games: saved?.games || 0,
        wins: saved?.wins || 0,
        losses: saved?.losses || 0,
        points: saved?.points || 0,
        pokemonDiff: saved?.pokemonDiff || 0,
      };
    }),
  };
  
  return normalized;
};

const cleanResults = (results) => {
  // Lista de IDs válidos para cada grupo
  const validGroupAIds = new Set(players.groupA.map(p => p.id));
  const validGroupBIds = new Set(players.groupB.map(p => p.id));
  
  const cleaned = {
    groupA: {},
    groupB: {},
  };
  
  // Limpar resultados do grupo A
  if (results.groupA) {
    Object.keys(results.groupA).forEach(key => {
      const result = results.groupA[key];
      if (validGroupAIds.has(result.winnerId) && validGroupAIds.has(result.loserId)) {
        cleaned.groupA[key] = result;
      }
    });
  }
  
  // Limpar resultados do grupo B
  if (results.groupB) {
    Object.keys(results.groupB).forEach(key => {
      const result = results.groupB[key];
      if (validGroupBIds.has(result.winnerId) && validGroupBIds.has(result.loserId)) {
        cleaned.groupB[key] = result;
      }
    });
  }
  
  return cleaned;
};

const cleanBracketResults = (bracketResults) => {
  const validIds = new Set([...players.groupA.map(p => p.id), ...players.groupB.map(p => p.id)]);
  const cleaned = {};
  
  Object.keys(bracketResults).forEach(key => {
    const result = bracketResults[key];
    if (validIds.has(result.winnerId) && validIds.has(result.loserId)) {
      cleaned[key] = result;
    }
  });
  
  return cleaned;
};

// Funções de API
const fetchData = async () => {
  try {
    const response = await fetch(`${API_URL}/data`);
    if (!response.ok) throw new Error('Erro ao carregar dados');
    const data = await response.json();
    return {
      standings: normalizeStandings(data.standings || initialStandings),
      results: cleanResults(data.results || { groupA: {}, groupB: {} }),
      bracketResults: cleanBracketResults(data.bracketResults || {}),
      metadata: data.metadata || { totalMatches: 0, totalBracketMatches: 0 },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      standings: initialStandings,
      results: { groupA: {}, groupB: {} },
      bracketResults: {},
      metadata: { totalMatches: 0, totalBracketMatches: 0 },
    };
  }
};

export const ChampionshipProvider = ({ children }) => {
  const [data, setData] = useState({
    standings: initialStandings,
    results: { groupA: {}, groupB: {} },
    bracketResults: {},
    metadata: { totalMatches: 0, totalBracketMatches: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar dados do servidor na inicialização
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const serverData = await fetchData();
        setData(serverData);
      } catch (err) {
        setError(err.message);
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
    
    // Atualizar dados a cada 5 segundos para sincronizar com outros usuários
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const updateResult = async (groupId, round, matchIndex, winnerId, loserId, pokemonDiff) => {
    try {
      const response = await fetch(`${API_URL}/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId, round, matchIndex, winnerId, loserId, pokemonDiff }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
        throw new Error(errorData.error || `Erro ao salvar resultado (${response.status})`);
      }
      
      const result = await response.json();
      setData({
        standings: normalizeStandings(result.data.standings),
        results: cleanResults(result.data.results),
        bracketResults: cleanBracketResults(result.data.bracketResults),
        metadata: result.data.metadata || { totalMatches: 0, totalBracketMatches: 0 },
      });
      setError(null);
    } catch (error) {
      console.error('Error updating result:', error);
      const errorMessage = error.message || 'Erro ao salvar resultado. Verifique se o servidor está rodando.';
      setError(errorMessage);
      throw error; // Re-throw para o componente poder tratar
    }
  };

  const getResult = (groupId, round, matchIndex) => {
    const groupKey = `group${groupId}`;
    const resultKey = `${groupId}-${round}-${matchIndex}`;
    return data.results[groupKey]?.[resultKey] || null;
  };

  const removeResult = async (groupId, round, matchIndex) => {
    try {
      const response = await fetch(`${API_URL}/results`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId, round, matchIndex }),
      });
      
      if (!response.ok) throw new Error('Erro ao remover resultado');
      
      const result = await response.json();
      setData({
        standings: normalizeStandings(result.data.standings),
        results: cleanResults(result.data.results),
        bracketResults: cleanBracketResults(result.data.bracketResults),
        metadata: result.data.metadata || { totalMatches: 0, totalBracketMatches: 0 },
      });
    } catch (error) {
      console.error('Error removing result:', error);
      setError(error.message);
    }
  };

  const getStandings = (groupId) => {
    const groupKey = `group${groupId}`;
    return sortStandings(data.standings[groupKey]);
  };

  const updateBracketResult = async (matchId, winnerId, loserId, pokemonDiff, player1Id, player2Id) => {
    try {
      const response = await fetch(`${API_URL}/bracket-results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId, winnerId, loserId, pokemonDiff, player1Id, player2Id }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
        throw new Error(errorData.error || `Erro ao salvar resultado do mata-mata (${response.status})`);
      }
      
      const result = await response.json();
      setData({
        standings: normalizeStandings(result.data.standings),
        results: cleanResults(result.data.results),
        bracketResults: cleanBracketResults(result.data.bracketResults),
        metadata: result.data.metadata || { totalMatches: 0, totalBracketMatches: 0 },
      });
      setError(null);
    } catch (error) {
      console.error('Error updating bracket result:', error);
      const errorMessage = error.message || 'Erro ao salvar resultado. Verifique se o servidor está rodando.';
      setError(errorMessage);
      throw error; // Re-throw para o componente poder tratar
    }
  };

  const getBracketResult = (matchId) => {
    return data.bracketResults[matchId] || null;
  };

  const removeBracketResult = async (matchId) => {
    try {
      const response = await fetch(`${API_URL}/bracket-results`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId }),
      });
      
      if (!response.ok) throw new Error('Erro ao remover resultado do mata-mata');
      
      const result = await response.json();
      setData({
        standings: normalizeStandings(result.data.standings),
        results: cleanResults(result.data.results),
        bracketResults: cleanBracketResults(result.data.bracketResults),
        metadata: result.data.metadata || { totalMatches: 0, totalBracketMatches: 0 },
      });
    } catch (error) {
      console.error('Error removing bracket result:', error);
      setError(error.message);
    }
  };

  const resetChampionship = async () => {
    try {
      const response = await fetch(`${API_URL}/reset`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Erro ao resetar campeonato');
      
      const result = await response.json();
      setData({
        standings: normalizeStandings(result.data.standings),
        results: cleanResults(result.data.results),
        bracketResults: cleanBracketResults(result.data.bracketResults),
        metadata: result.data.metadata || { totalMatches: 0, totalBracketMatches: 0 },
      });
    } catch (error) {
      console.error('Error resetting championship:', error);
      setError(error.message);
    }
  };
  
  // Função para exportar dados (backup)
  const exportData = () => {
    try {
      const exportData = {
        ...data,
        exportedAt: new Date().toISOString(),
      };
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `championship-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      console.error('Error exporting data:', error);
      return false;
    }
  };
  
  // Função para importar dados (restore)
  const importData = async (jsonData) => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.standings && parsed.results) {
        const response = await fetch(`${API_URL}/data`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            standings: normalizeStandings(parsed.standings),
            results: cleanResults(parsed.results),
            bracketResults: cleanBracketResults(parsed.bracketResults || {}),
            metadata: parsed.metadata || { totalMatches: 0, totalBracketMatches: 0 },
          }),
        });
        
        if (!response.ok) throw new Error('Erro ao importar dados');
        
        const result = await response.json();
        setData({
          standings: normalizeStandings(result.data.standings),
          results: cleanResults(result.data.results),
          bracketResults: cleanBracketResults(result.data.bracketResults),
          metadata: result.data.metadata || { totalMatches: 0, totalBracketMatches: 0 },
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  };

  return (
    <ChampionshipContext.Provider
      value={{
        standings: data.standings,
        results: data.results,
        bracketResults: data.bracketResults,
        metadata: data.metadata || { totalMatches: 0, totalBracketMatches: 0 },
        loading,
        error,
        updateResult,
        removeResult,
        getResult,
        getStandings,
        updateBracketResult,
        getBracketResult,
        removeBracketResult,
        resetChampionship,
        exportData,
        importData,
      }}
    >
      {children}
    </ChampionshipContext.Provider>
  );
};
