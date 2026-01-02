export default function Regras() {
  const rules = [
    {
      title: '🏆 Sistema de Pontuação',
      items: [
        { label: 'Vitória', value: '3 pontos' },
        { label: 'Derrota', value: '0 pontos' },
      ],
      color: 'from-green-500 to-emerald-600',
    },
    {
      title: '📊 Fase de Grupos',
      items: [
        { label: 'Formato', value: 'Round-robin (todos contra todos)' },
        { label: 'Grupos', value: 'Grupo A e Grupo B (4 jogadores cada)' },
        { label: 'Batalhas', value: '3 batalhas por jogador' },
        { label: 'Classificação', value: 'Top 2 de cada grupo avançam' },
      ],
      color: 'from-blue-500 to-cyan-600',
    },
    {
      title: '⚔️ Mata-Mata',
      items: [
        { label: 'Semifinais', value: '1º A vs 2º B | 1º B vs 2º A' },
        { label: 'Final', value: 'Vencedores das semifinais' },
      ],
      color: 'from-red-500 to-pink-600',
    },
    {
      title: '🎯 Critérios de Desempate',
      items: [
        { label: '1º Critério', value: 'Confronto direto' },
        { label: '2º Critério', value: 'Saldo de Pokémon (pokémon restantes - pokémon derrotados)' },
        { label: '3º Critério', value: 'Sorteio' },
      ],
      color: 'from-purple-500 to-indigo-600',
    },
  ];
  
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center">
        📜 Regras do Campeonato
      </h1>
      
      <div className="space-y-4 sm:space-y-6">
        {rules.map((rule, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${rule.color} rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 text-white border-4 border-white/50 card-hover`}
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">{rule.title}</h2>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4">
              <ul className="space-y-2 sm:space-y-3">
                {rule.items.map((item, idx) => (
                  <li key={idx} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                    <span className="font-semibold text-sm sm:text-base md:text-lg">{item.label}:</span>
                    <span className="font-bold text-sm sm:text-base md:text-lg lg:text-xl bg-white/30 px-3 sm:px-4 py-1 rounded-lg text-left sm:text-center">
                      {item.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      
      {/* Info Adicional */}
      <div className="mt-6 sm:mt-8 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border-4 border-white">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 text-center">
          ⚠️ Informações Importantes
        </h2>
        <div className="bg-white/90 rounded-lg sm:rounded-xl p-3 sm:p-4 space-y-2 text-gray-800">
          <p className="font-semibold text-sm sm:text-base">• Cada jogador usa apenas Pokémon de um único tipo (Monotype)</p>
          <p className="font-semibold text-sm sm:text-base">• As batalhas seguem as regras padrão de competição Pokémon</p>
          <p className="font-semibold text-sm sm:text-base">• Os resultados devem ser reportados após cada batalha</p>
          <p className="font-semibold text-sm sm:text-base">• A classificação é atualizada automaticamente após cada resultado</p>
        </div>
      </div>
    </div>
  );
}

