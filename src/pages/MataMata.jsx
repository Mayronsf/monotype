import { bracket } from '../data/bracket';
import { useChampionship } from '../context/ChampionshipContext';
import KnockoutMatchResult from '../components/KnockoutMatchResult';
import { players } from '../data/players';
import { sortStandings } from '../data/standings';

export default function MataMata() {
  // Acessar diretamente os valores reativos do contexto
  const { standings, bracketResults } = useChampionship();
  
  // Obtém os jogadores classificados automaticamente baseado na classificação atual
  const getPlayerFromStanding = (group, position) => {
    const groupKey = `group${group}`;
    const sorted = sortStandings(standings[groupKey] || []);
    return sorted[position - 1] || { name: 'TBD', type: 'normal', typeName: 'Normal', id: null };
  };
  
  // Resolve jogador baseado no resultado de uma partida anterior
  const resolvePlayerFromResult = (sourceMatchId, isLoser = false) => {
    const result = bracketResults[sourceMatchId];
    if (!result) return null;
    
    const allPlayers = [...players.groupA, ...players.groupB];
    const playerId = isLoser ? result.loserId : result.winnerId;
    return allPlayers.find(p => p.id === playerId) || null;
  };

  // Semifinais
  const sfMatches = bracket.semifinals.map((sf) => {
    const player1 = sf.player1.group 
      ? getPlayerFromStanding(sf.player1.group, sf.player1.position)
      : resolvePlayerFromResult(sf.player1.source, false);
    const player2 = sf.player2.group
      ? getPlayerFromStanding(sf.player2.group, sf.player2.position)
      : resolvePlayerFromResult(sf.player2.source, false);
    
    return {
      ...sf,
      player1: player1 || { name: 'TBD', type: 'normal', typeName: 'Normal', id: null },
      player2: player2 || { name: 'TBD', type: 'normal', typeName: 'Normal', id: null },
    };
  });

  // Final
  const sf1Winner = resolvePlayerFromResult('sf1', false);
  const sf2Winner = resolvePlayerFromResult('sf2', false);
  const finalMatch = {
    ...bracket.final,
    player1: sf1Winner || { name: 'TBD', type: 'normal', typeName: 'Normal', id: null },
    player2: sf2Winner || { name: 'TBD', type: 'normal', typeName: 'Normal', id: null },
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
        ⚔️ Mata-Mata
      </h1>
      
      {/* Semifinais */}
      <div className="mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 text-center bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 sm:py-4 rounded-xl px-2">
          ⚔️ Semifinais
        </h2>
        
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          {sfMatches.map((sf, idx) => (
            <div
              key={sf.id}
              className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border-4 border-red-400"
            >
              <div className="text-center mb-3 sm:mb-4">
                <span className="bg-red-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold text-sm sm:text-base">
                  SF {idx + 1}
                </span>
              </div>
              
              <KnockoutMatchResult
                matchId={sf.id}
                player1={sf.player1}
                player2={sf.player2}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Final */}
      <div className="mb-8 sm:mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 text-center bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 text-white py-4 sm:py-5 rounded-xl px-2">
          🏆 Final
        </h2>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 border-4 border-yellow-400">
            <KnockoutMatchResult
              matchId={finalMatch.id}
              player1={finalMatch.player1}
              player2={finalMatch.player2}
            />
          </div>
        </div>
      </div>
      
    </div>
  );
}

