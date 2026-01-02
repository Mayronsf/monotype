export const pokemonTypes = {
  normal: { name: 'Normal', color: '#A8A878', emoji: '⚪' },
  fire: { name: 'Fogo', color: '#F08030', emoji: '🔥' },
  water: { name: 'Água', color: '#6890F0', emoji: '💧' },
  electric: { name: 'Elétrico', color: '#F8D030', emoji: '⚡' },
  grass: { name: 'Grama', color: '#78C850', emoji: '🌿' },
  ice: { name: 'Gelo', color: '#98D8D8', emoji: '❄️' },
  fighting: { name: 'Lutador', color: '#C03028', emoji: '👊' },
  poison: { name: 'Veneno', color: '#A040A0', emoji: '☠️' },
  ground: { name: 'Terra', color: '#E0C068', emoji: '🌍' },
  flying: { name: 'Voador', color: '#A890F0', emoji: '🌪️' },
  psychic: { name: 'Psíquico', color: '#F85888', emoji: '🔮' },
  bug: { name: 'Inseto', color: '#A8B820', emoji: '🐛' },
  rock: { name: 'Pedra', color: '#B8A038', emoji: '🪨' },
  ghost: { name: 'Fantasma', color: '#705898', emoji: '👻' },
  dragon: { name: 'Dragão', color: '#7038F8', emoji: '🐉' },
  dark: { name: 'Sombrio', color: '#705848', emoji: '🌑' },
  steel: { name: 'Metal', color: '#B8B8D0', emoji: '⚔️' },
  fairy: { name: 'Fada', color: '#EE99AC', emoji: '✨' },
};

export const getTypeInfo = (typeKey) => {
  return pokemonTypes[typeKey] || pokemonTypes.normal;
};

export const getTypeColor = (typeKey) => {
  return getTypeInfo(typeKey).color;
};





