import { useState } from 'react';
import { useChampionship } from '../context/ChampionshipContext';
import TypeBadge from './TypeBadge';

export default function KnockoutMatchResult({ matchId, player1, player2 }) {
  const { updateBracketResult, getBracketResult, removeBracketResult } = useChampionship();
  const [pokemonDiff, setPokemonDiff] = useState('');
  const [winner, setWinner] = useState(null);
  
  const existingResult = getBracketResult(matchId);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!winner || !pokemonDiff) return;
    
    const diff = parseInt(pokemonDiff);
    if (isNaN(diff) || diff < 0) {
      alert('O saldo de Pokémon deve ser um número positivo!');
      return;
    }
    
    const winnerId = winner === 'player1' ? player1.id : player2.id;
    const loserId = winner === 'player1' ? player2.id : player1.id;
    
    updateBracketResult(matchId, winnerId, loserId, diff, player1.id, player2.id);
    setWinner(null);
    setPokemonDiff('');
  };

  const handleEdit = () => {
    if (existingResult) {
      const winnerId = existingResult.winnerId;
      setWinner(winnerId === player1.id ? 'player1' : 'player2');
    }
  };

  const handleReset = () => {
    if (confirm('Tem certeza que deseja remover este resultado?')) {
      removeBracketResult(matchId);
      setWinner(null);
      setPokemonDiff('');
    }
  };

  const winnerPlayer = existingResult 
    ? (existingResult.winnerId === player1.id ? player1 : player2)
    : null;

  // Se player1 ou player2 não existir (TBD), não mostrar formulário
  if (!player1 || !player1.id || !player2 || !player2.id || player1.name === 'TBD' || player2.name === 'TBD') {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border-2 border-gray-300">
        <div className="flex items-center justify-center gap-3">
          <div className="text-gray-500 font-semibold">
            {player1?.name || 'TBD'}
          </div>
          <div className="text-xl font-bold text-gray-400">VS</div>
          <div className="text-gray-500 font-semibold">
            {player2?.name || 'TBD'}
          </div>
        </div>
        <div className="text-center text-sm text-gray-400 mt-2">
          Aguardando resultados anteriores
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border-2 border-gray-300 hover:border-blue-500 transition-all duration-300">
      {/* Layout horizontal: Jogador 1 | VS | Jogador 2 */}
      <div className="flex items-center justify-center gap-3 mb-3 flex-wrap">
        {/* Jogador 1 */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className={`font-bold ${existingResult && existingResult.winnerId === player1.id ? 'text-green-600' : 'text-gray-900'}`}>
            {player1.emoji && <span className="mr-1">{player1.emoji}</span>}
            {player1.name}
          </span>
          <TypeBadge type={player1.type} size="sm" />
          {existingResult && existingResult.winnerId === player1.id && (
            <span className="text-xl">✅</span>
          )}
        </div>
        
        {/* VS no meio */}
        <div className="flex-shrink-0">
          {existingResult ? (
            <div className="text-lg font-bold text-green-600 whitespace-nowrap">
              VS
            </div>
          ) : (
            <div className="text-xl font-bold text-gray-500">VS</div>
          )}
        </div>
        
        {/* Jogador 2 */}
        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
          {existingResult && existingResult.winnerId === player2.id && (
            <span className="text-xl">✅</span>
          )}
          <TypeBadge type={player2.type} size="sm" />
          <span className={`font-bold ${existingResult && existingResult.winnerId === player2.id ? 'text-green-600' : 'text-gray-900'}`}>
            {player2.emoji && <span className="mr-1">{player2.emoji}</span>}
            {player2.name}
          </span>
        </div>
      </div>
      
      {/* Mensagem de vencedor (se houver resultado) */}
      {existingResult && (
        <div className="text-center mb-3">
          <div className="text-sm font-semibold text-green-600">
            {winnerPlayer.emoji && <span className="mr-1">{winnerPlayer.emoji}</span>}
            {winnerPlayer.name} venceu!
          </div>
        </div>
      )}

      {existingResult ? (
        <div className="mt-4 pt-4 border-t-2 border-gray-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
            <span className="text-xs sm:text-sm text-gray-600">
              Saldo de Pokémon: <strong className="text-gray-900">{existingResult.pokemonDiff}</strong>
            </span>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={handleEdit}
                className="flex-1 sm:flex-initial px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-blue-600 transition-colors"
              >
                Editar
              </button>
              <button
                onClick={handleReset}
                className="flex-1 sm:flex-initial px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-red-600 transition-colors"
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t-2 border-gray-300 space-y-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Vencedor:
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setWinner('player1')}
                className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-colors ${
                  winner === 'player1'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {player1.emoji && <span className="mr-1">{player1.emoji}</span>}
                {player1.name}
              </button>
              <button
                type="button"
                onClick={() => setWinner('player2')}
                className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-colors ${
                  winner === 'player2'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {player2.emoji && <span className="mr-1">{player2.emoji}</span>}
                {player2.name}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
              <span className="block mb-1">Saldo de Pokémon:</span>
              <span className="block text-xs text-gray-500 font-normal">(pokémon restantes - pokémon derrotados)</span>
            </label>
            <input
              type="number"
              min="0"
              value={pokemonDiff}
              onChange={(e) => setPokemonDiff(e.target.value)}
              placeholder="Ex: 3"
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={!winner || !pokemonDiff}
            className="w-full py-2 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Salvar Resultado
          </button>
        </form>
      )}
    </div>
  );
}

