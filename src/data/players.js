export const players = {
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

// Mapeamento de emojis para tipos
export const typeEmojis = {
  fairy: '🧚',
  ice: '❄️',
  poison: '🐍',
  fighting: '🥊',
  dark: '🌑',
  electric: '⚡',
  ghost: '👻',
  steel: '⚔️',
};

// Gera confrontos para round-robin
// Para número par de jogadores: n-1 rodadas, sem folgas
// Para número ímpar de jogadores: n rodadas, 1 folga por rodada
export const generateRoundRobin = (playerList) => {
  const rounds = [];
  const n = playerList.length;
  const isEven = n % 2 === 0;
  const numRounds = isEven ? n - 1 : n;
  
  if (isEven) {
    // Algoritmo para número par: método do círculo
    // Fixa o primeiro jogador e rotaciona os outros
    const fixed = playerList[0];
    const rotating = playerList.slice(1);
    
    for (let round = 0; round < numRounds; round++) {
      const matches = [];
      
      // Pareia o fixo com o último da lista rotativa
      matches.push({
        player1: fixed,
        player2: rotating[rotating.length - 1],
      });
      
      // Pareia os outros: primeiro com último, segundo com penúltimo, etc.
      for (let i = 0; i < (rotating.length - 1) / 2; i++) {
        matches.push({
          player1: rotating[i],
          player2: rotating[rotating.length - 2 - i],
        });
      }
      
      rounds.push({
        round: round + 1,
        matches,
        bye: null,
      });
      
      // Rotaciona a lista (move o último para o início)
      rotating.unshift(rotating.pop());
    }
  } else {
    // Algoritmo para número ímpar: método do círculo com folga
    for (let round = 0; round < numRounds; round++) {
      const matches = [];
      const byePlayer = playerList[round];
      
      // Cria uma lista temporária sem o jogador de folga
      const tempList = playerList.filter((_, idx) => idx !== round);
      const tempN = tempList.length;
      
      // Pareia os jogadores restantes
      for (let i = 0; i < tempN / 2; i++) {
        matches.push({
          player1: tempList[i],
          player2: tempList[tempN - 1 - i],
        });
      }
      
      rounds.push({
        round: round + 1,
        matches,
        bye: byePlayer,
      });
    }
  }
  
  return rounds;
};

export const groupARounds = generateRoundRobin(players.groupA);
export const groupBRounds = generateRoundRobin(players.groupB);

