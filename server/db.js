import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️  Supabase não configurado. Usando modo fallback.');
}

export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Funções de acesso ao banco de dados

// Standings
export const getStandings = async (groupId) => {
  if (!supabase) return [];
  
  const { data, error } = await supabase
    .from('standings')
    .select('*')
    .eq('group_id', groupId)
    .order('points', { ascending: false })
    .order('pokemon_diff', { ascending: false });
  
  if (error) {
    console.error('Error fetching standings:', error);
    return [];
  }
  
  return data || [];
};

export const updateStanding = async (playerId, groupId, updates) => {
  if (!supabase) return null;
  
  // Converter campos se necessário
  const dbUpdates = {};
  if (updates.pokemon_diff !== undefined) dbUpdates.pokemon_diff = updates.pokemon_diff;
  if (updates.pokemonDiff !== undefined) dbUpdates.pokemon_diff = updates.pokemonDiff;
  if (updates.games !== undefined) dbUpdates.games = updates.games;
  if (updates.wins !== undefined) dbUpdates.wins = updates.wins;
  if (updates.losses !== undefined) dbUpdates.losses = updates.losses;
  if (updates.points !== undefined) dbUpdates.points = updates.points;
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.type !== undefined) dbUpdates.type = updates.type;
  if (updates.type_name !== undefined) dbUpdates.type_name = updates.type_name;
  if (updates.typeName !== undefined) dbUpdates.type_name = updates.typeName;
  if (updates.emoji !== undefined) dbUpdates.emoji = updates.emoji;
  if (updates.player_id !== undefined) dbUpdates.player_id = updates.player_id;
  if (updates.group_id !== undefined) dbUpdates.group_id = updates.group_id;
  
  const { data, error } = await supabase
    .from('standings')
    .update(dbUpdates)
    .eq('player_id', playerId)
    .eq('group_id', groupId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating standing:', error);
    return null;
  }
  
  return data;
};

export const upsertStanding = async (standing) => {
  if (!supabase) return null;
  
  // Converter campos do frontend para formato do banco
  const dbStanding = {
    player_id: standing.player_id || standing.id,
    group_id: standing.group_id || standing.groupId,
    name: standing.name,
    type: standing.type,
    type_name: standing.type_name || standing.typeName,
    emoji: standing.emoji,
    games: standing.games || 0,
    wins: standing.wins || 0,
    losses: standing.losses || 0,
    points: standing.points || 0,
    pokemon_diff: standing.pokemon_diff || standing.pokemonDiff || 0,
  };
  
  const { data, error } = await supabase
    .from('standings')
    .upsert(dbStanding, { onConflict: 'player_id,group_id' })
    .select()
    .single();
  
  if (error) {
    console.error('Error upserting standing:', error);
    return null;
  }
  
  return data;
};

// Group Results
export const getGroupResult = async (groupId, round, matchIndex) => {
  if (!supabase) return null;
  
  const { data, error } = await supabase
    .from('group_results')
    .select('*')
    .eq('group_id', groupId)
    .eq('round', round)
    .eq('match_index', matchIndex)
    .single();
  
  if (error && error.code !== 'PGRST116') { // PGRST116 = not found
    console.error('Error fetching group result:', error);
    return null;
  }
  
  return data;
};

export const upsertGroupResult = async (result) => {
  if (!supabase) return null;
  
  const { data, error } = await supabase
    .from('group_results')
    .upsert(result, { onConflict: 'group_id,round,match_index' })
    .select()
    .single();
  
  if (error) {
    console.error('Error upserting group result:', error);
    return null;
  }
  
  return data;
};

export const deleteGroupResult = async (groupId, round, matchIndex) => {
  if (!supabase) return false;
  
  const { error } = await supabase
    .from('group_results')
    .delete()
    .eq('group_id', groupId)
    .eq('round', round)
    .eq('match_index', matchIndex);
  
  if (error) {
    console.error('Error deleting group result:', error);
    return false;
  }
  
  return true;
};

export const getAllGroupResults = async (groupId) => {
  if (!supabase) return {};
  
  const { data, error } = await supabase
    .from('group_results')
    .select('*')
    .eq('group_id', groupId);
  
  if (error) {
    console.error('Error fetching group results:', error);
    return {};
  }
  
  // Converter para formato de objeto com chave "groupId-round-matchIndex"
  const results = {};
  (data || []).forEach(result => {
    const key = `${result.group_id}-${result.round}-${result.match_index}`;
    results[key] = {
      winnerId: result.winner_id,
      loserId: result.loser_id,
      pokemonDiff: result.pokemon_diff,
    };
  });
  
  return results;
};

// Bracket Results
export const getBracketResult = async (matchId) => {
  if (!supabase) return null;
  
  const { data, error } = await supabase
    .from('bracket_results')
    .select('*')
    .eq('match_id', matchId)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching bracket result:', error);
    return null;
  }
  
  return data;
};

export const upsertBracketResult = async (result) => {
  if (!supabase) return null;
  
  const { data, error } = await supabase
    .from('bracket_results')
    .upsert(result, { onConflict: 'match_id' })
    .select()
    .single();
  
  if (error) {
    console.error('Error upserting bracket result:', error);
    return null;
  }
  
  return data;
};

export const deleteBracketResult = async (matchId) => {
  if (!supabase) return false;
  
  const { error } = await supabase
    .from('bracket_results')
    .delete()
    .eq('match_id', matchId);
  
  if (error) {
    console.error('Error deleting bracket result:', error);
    return false;
  }
  
  return true;
};

export const getAllBracketResults = async () => {
  if (!supabase) return {};
  
  const { data, error } = await supabase
    .from('bracket_results')
    .select('*');
  
  if (error) {
    console.error('Error fetching bracket results:', error);
    return {};
  }
  
  // Converter para formato de objeto
  const results = {};
  (data || []).forEach(result => {
    results[result.match_id] = {
      winnerId: result.winner_id,
      loserId: result.loser_id,
      player1Id: result.player1_id,
      player2Id: result.player2_id,
      pokemonDiff: result.pokemon_diff,
    };
  });
  
  return results;
};

// Reset all data
export const resetAllData = async () => {
  if (!supabase) return false;
  
  // Deletar todos os resultados
  await supabase.from('group_results').delete().neq('id', 0);
  await supabase.from('bracket_results').delete().neq('id', 0);
  
  // Resetar standings
  const { error } = await supabase
    .from('standings')
    .update({
      games: 0,
      wins: 0,
      losses: 0,
      points: 0,
      pokemon_diff: 0,
    })
    .neq('id', 0);
  
  if (error) {
    console.error('Error resetting data:', error);
    return false;
  }
  
  return true;
};

