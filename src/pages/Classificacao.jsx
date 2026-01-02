import { useChampionship } from '../context/ChampionshipContext';
import TypeBadge from '../components/TypeBadge';

function StandingsTable({ groupName, groupId }) {
  const { getStandings } = useChampionship();
  const sorted = getStandings(groupId);
  
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-4 md:p-6 border-4 border-yellow-400">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
        {groupName}
      </h2>
      
      <div className="overflow-x-auto -mx-3 sm:mx-0">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left font-bold text-xs sm:text-sm">Pos.</th>
              <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left font-bold text-xs sm:text-sm">Jogador</th>
              <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left font-bold text-xs sm:text-sm">Tipo</th>
              <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-center font-bold text-xs sm:text-sm">J</th>
              <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-center font-bold text-xs sm:text-sm">V</th>
              <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-center font-bold text-xs sm:text-sm">D</th>
              <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-center font-bold text-xs sm:text-sm">P</th>
              <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-center font-bold text-xs sm:text-sm">SD</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((player, index) => {
              const isTopTwo = index < 2;
              const position = index + 1;
              
              return (
                <tr
                  key={player.id}
                  className={`border-b hover:bg-gray-50 transition-colors ${
                    isTopTwo ? 'bg-yellow-50 font-semibold' : ''
                  }`}
                >
                  <td className="px-2 sm:px-3 md:px-4 py-3 sm:py-4">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm ${
                        position === 1
                          ? 'bg-yellow-400 text-gray-900 font-bold'
                          : position === 2
                          ? 'bg-gray-300 text-gray-900 font-bold'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {position}º
                    </span>
                  </td>
                  <td className="px-2 sm:px-3 md:px-4 py-3 sm:py-4 font-bold text-gray-900 text-sm sm:text-base">
                    {player.emoji && <span className="mr-1">{player.emoji}</span>}
                    {player.name}
                  </td>
                  <td className="px-2 sm:px-3 md:px-4 py-3 sm:py-4">
                    <TypeBadge type={player.type} size="sm" />
                  </td>
                  <td className="px-2 sm:px-3 md:px-4 py-3 sm:py-4 text-center text-gray-700 text-sm sm:text-base">{player.games}</td>
                  <td className="px-2 sm:px-3 md:px-4 py-3 sm:py-4 text-center text-green-600 font-bold text-sm sm:text-base">{player.wins}</td>
                  <td className="px-2 sm:px-3 md:px-4 py-3 sm:py-4 text-center text-red-600 font-bold text-sm sm:text-base">{player.losses}</td>
                  <td className="px-2 sm:px-3 md:px-4 py-3 sm:py-4 text-center text-blue-600 font-bold text-base sm:text-lg">
                    {player.points}
                  </td>
                  <td className="px-2 sm:px-3 md:px-4 py-3 sm:py-4 text-center text-gray-700">
                    {player.pokemonDiff >= 0 ? (
                      <span className="text-green-600 font-bold">+{player.pokemonDiff}</span>
                    ) : (
                      <span className="text-red-600 font-bold">{player.pokemonDiff}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Legenda */}
      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-100 rounded-xl">
        <p className="text-xs sm:text-sm text-gray-700 mb-2">
          <strong>Legenda:</strong> J = Jogos | V = Vitórias | D = Derrotas | P = Pontos | SD = Saldo de Pokémon
        </p>
        <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 bg-yellow-400 rounded-full"></span>
            1º Lugar (Classificado)
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 bg-gray-300 rounded-full"></span>
            2º Lugar (Classificado)
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Classificacao() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center">
        📈 Classificação
      </h1>
      
      <div className="space-y-6 lg:space-y-8">
        <StandingsTable groupName="📊 Grupo A" groupId="A" />
        <StandingsTable groupName="📊 Grupo B" groupId="B" />
      </div>
    </div>
  );
}

