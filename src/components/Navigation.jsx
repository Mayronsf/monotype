import { Link, useLocation } from 'react-router-dom';

export default function Navigation() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: '🏠 Home', icon: '🏠' },
    { path: '/grupos', label: '📊 Fase de Grupos', icon: '📊' },
    { path: '/classificacao', label: '📈 Classificação', icon: '📈' },
    { path: '/mata-mata', label: '⚔️ Mata-Mata', icon: '⚔️' },
    { path: '/regras', label: '📜 Regras', icon: '📜' },
  ];
  
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };
  
  return (
    <nav className="bg-white/90 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b-2 border-yellow-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
            <img 
              src="/img/logo campeonato.png" 
              alt="Logo Campeonato" 
              className="h-10 sm:h-12 w-auto object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <span className="font-bold text-base sm:text-lg md:text-xl text-gray-800 hidden sm:inline">Campeonato Monotype</span>
          </Link>
          
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-yellow-400 text-gray-900 shadow-md'
                    : 'text-gray-700 hover:bg-yellow-100 hover:text-gray-900'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <select
              value={location.pathname}
              onChange={(e) => window.location.href = e.target.value}
              className="px-2 py-1.5 sm:px-3 sm:py-2 text-sm rounded-lg bg-yellow-400 text-gray-900 font-medium border-2 border-gray-800"
            >
              {navItems.map((item) => (
                <option key={item.path} value={item.path}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
}

