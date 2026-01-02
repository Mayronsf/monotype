import { Link } from 'react-router-dom';

export default function Home() {
  const quickLinks = [
    { path: '/grupos', label: '📊 Fase de Grupos', description: 'Veja todos os confrontos das rodadas', color: 'bg-blue-500 hover:bg-blue-600' },
    { path: '/classificacao', label: '📈 Classificação', description: 'Acompanhe a pontuação dos jogadores', color: 'bg-green-500 hover:bg-green-600' },
    { path: '/mata-mata', label: '⚔️ Mata-Mata', description: 'Visualize a chave do mata-mata', color: 'bg-red-500 hover:bg-red-600' },
    { path: '/regras', label: '📜 Regras', description: 'Entenda como funciona o campeonato', color: 'bg-purple-500 hover:bg-purple-600' },
  ];
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Banner Hero */}
      <div className="text-center mb-12">
        {/* Logo Principal */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <img 
            src="/img/logo campeonato.png" 
            alt="Logo Campeonato Pokémon Monotype" 
            className="h-24 sm:h-32 md:h-40 w-auto object-contain max-w-full"
          />
        </div>
        
        {/* Nome Pokémon (se existir) */}
        <div className="flex justify-center mb-6">
          <img 
            src="/img/nome pokemon.png" 
            alt="Nome Pokémon" 
            className="h-16 md:h-20 w-auto object-contain opacity-0"
            style={{ display: 'none' }}
            onError={(e) => e.target.style.display = 'none'}
          />
        </div>
        
        <div className="inline-block mb-4 sm:mb-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 text-shadow px-2">
            🏆 Liga da Pokéfirma
          </h1>
          <div className="h-1.5 sm:h-2 bg-gradient-to-r from-yellow-400 via-red-500 to-blue-500 rounded-full"></div>
        </div>
        <p className="text-xl sm:text-2xl md:text-3xl text-gray-700 font-semibold mt-4 sm:mt-6 px-2">
          Tabela Oficial
        </p>
      </div>
      
      {/* Texto Explicativo */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 mb-8 sm:mb-12 border-4 border-yellow-400">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 text-center">Sobre o Campeonato</h2>
        <div className="prose prose-lg max-w-none text-center">
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6 px-2">
            Bem-vindo à <strong className="text-yellow-600">Liga da Pokéfirma — Fase de Grupos</strong>! 
            Este é um torneio competitivo onde cada treinador usa apenas Pokémon de um único tipo.
          </p>
          
          {/* Imagem dos Treinadores */}
          <div className="flex justify-center mb-4 sm:mb-6">
            <img 
              src="/img/treinadores.png" 
              alt="Treinadores Pokémon" 
              className="h-36 sm:h-48 md:h-64 w-auto object-contain rounded-xl max-w-full"
              onError={(e) => e.target.style.display = 'none'}
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-4 sm:p-6 border-2 border-blue-400 relative overflow-hidden">
              <div className="absolute top-2 right-2 opacity-20 hidden sm:block">
                <img 
                  src="/img/bulbasaur.png" 
                  alt="" 
                  className="h-16 sm:h-20 w-auto"
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-blue-900 mb-2 sm:mb-3 relative z-10">📊 Fase de Grupos</h3>
              <p className="text-sm sm:text-base text-blue-800 relative z-10">
                Dois grupos (A e B) com 4 jogadores cada, disputando em formato <strong>Round-robin</strong>, 
                onde cada jogador enfrenta todos os outros do seu grupo (3 batalhas por jogador).
              </p>
            </div>
            <div className="bg-gradient-to-br from-red-100 to-red-200 rounded-xl p-4 sm:p-6 border-2 border-red-400 relative overflow-hidden">
              <div className="absolute top-2 right-2 opacity-20 hidden sm:block">
                <img 
                  src="/img/charmander.png" 
                  alt="" 
                  className="h-16 sm:h-20 w-auto"
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-red-900 mb-2 sm:mb-3 relative z-10">⚔️ Mata-Mata</h3>
              <p className="text-sm sm:text-base text-red-800 relative z-10">
                Após a fase de grupos, os <strong>Top 2 de cada grupo</strong> avançam para as 
                <strong> Semifinais</strong>, seguindo até a grande final!
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Botões de Navegação */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {quickLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`${link.color} text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg card-hover transform transition-all duration-300`}
          >
            <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{link.label.split(' ')[0]}</div>
            <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">{link.label.substring(2)}</h3>
            <p className="text-xs sm:text-sm opacity-90">{link.description}</p>
          </Link>
        ))}
      </div>
      
      {/* Destaque Visual com Imagens de Pokémon */}
      <div className="mt-8 sm:mt-12 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-white text-center shadow-2xl relative overflow-hidden">
        {/* Pokémon decorativos */}
        <div className="absolute left-2 sm:left-4 top-2 sm:top-4 opacity-30 hidden md:block">
          <img 
            src="/img/crocodaile.png" 
            alt="" 
            className="h-16 sm:h-24 w-auto transform -scale-x-100"
            onError={(e) => e.target.style.display = 'none'}
          />
        </div>
        <div className="absolute right-2 sm:right-4 top-2 sm:top-4 opacity-30 hidden md:block">
          <img 
            src="/img/squartale.png" 
            alt="" 
            className="h-16 sm:h-24 w-auto"
            onError={(e) => e.target.style.display = 'none'}
          />
        </div>
        
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 px-2">🎮 Prepare-se para a Batalha!</h2>
          <p className="text-base sm:text-xl opacity-90 px-2">
            Acompanhe cada confronto, torça pelo seu tipo favorito e descubra quem será o campeão!
          </p>
        </div>
      </div>
    </div>
  );
}

