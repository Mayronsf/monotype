// Estrutura do mata-mata
export const bracket = {
  semifinals: [
    { id: 'sf1', player1: { group: 'A', position: 1 }, player2: { group: 'B', position: 2 }, winner: null },
    { id: 'sf2', player1: { group: 'B', position: 1 }, player2: { group: 'A', position: 2 }, winner: null },
  ],
  final: {
    id: 'final',
    player1: { source: 'sf1' },
    player2: { source: 'sf2' },
    winner: null,
  },
};





