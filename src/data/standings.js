import { players } from './players';

// Estrutura para classificação (pode ser editada futuramente)
export const standings = {
  groupA: players.groupA.map(player => ({
    ...player,
    games: 0,
    wins: 0,
    losses: 0,
    points: 0,
    pokemonDiff: 0, // Saldo de Pokémon (pokémon restantes - pokémon derrotados)
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

// Função para ordenar classificação
export const sortStandings = (standingsList) => {
  return [...standingsList].sort((a, b) => {
    // Primeiro: pontos
    if (b.points !== a.points) return b.points - a.points;
    // Segundo: saldo de Pokémon
    if (b.pokemonDiff !== a.pokemonDiff) return b.pokemonDiff - a.pokemonDiff;
    // Terceiro: número de vitórias
    return b.wins - a.wins;
  });
};





