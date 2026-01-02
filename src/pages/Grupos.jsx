import { useState } from 'react';
import { groupARounds, groupBRounds } from '../data/players';
import TypeBadge from '../components/TypeBadge';
import MatchResult from '../components/MatchResult';

export default function Grupos() {
  const [activeGroup, setActiveGroup] = useState('A');
  
  const rounds = activeGroup === 'A' ? groupARounds : groupBRounds;
  const groupId = activeGroup;
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center">
        📊 Fase de Grupos
      </h1>
      
      {/* Tabs */}
      <div className="flex justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
        <button
          onClick={() => setActiveGroup('A')}
          className={`px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg md:text-xl transition-all duration-300 flex-1 sm:flex-initial max-w-[200px] sm:max-w-none ${
            activeGroup === 'A'
              ? 'bg-blue-500 text-white shadow-lg scale-105'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          📊 Grupo A
        </button>
        <button
          onClick={() => setActiveGroup('B')}
          className={`px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg md:text-xl transition-all duration-300 flex-1 sm:flex-initial max-w-[200px] sm:max-w-none ${
            activeGroup === 'B'
              ? 'bg-blue-500 text-white shadow-lg scale-105'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          📊 Grupo B
        </button>
      </div>
      
      {/* Rodadas */}
      <div className="space-y-6">
        {rounds.map((roundData) => (
          <div
            key={roundData.round}
            className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border-4 border-yellow-400"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
              Rodada {roundData.round}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 justify-items-center max-w-4xl mx-auto">
              {roundData.matches.map((match, idx) => (
                <MatchResult
                  key={idx}
                  groupId={groupId}
                  round={roundData.round}
                  matchIndex={idx}
                  player1={match.player1}
                  player2={match.player2}
                />
              ))}
            </div>
            
            {/* Jogador de Folga (apenas se houver) */}
            {roundData.bye && (
              <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-yellow-100 rounded-lg sm:rounded-xl border-2 border-yellow-400">
                <p className="text-center text-sm sm:text-base text-gray-700">
                  <span className="font-semibold">Folga nesta rodada:</span>{' '}
                  <span className="font-bold text-gray-900">
                    {roundData.bye.emoji && <span className="mr-1">{roundData.bye.emoji}</span>}
                    {roundData.bye.name}
                  </span>{' '}
                  <TypeBadge type={roundData.bye.type} size="sm" />
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

