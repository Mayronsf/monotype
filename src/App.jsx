import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChampionshipProvider } from './context/ChampionshipContext';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Grupos from './pages/Grupos';
import Classificacao from './pages/Classificacao';
import MataMata from './pages/MataMata';
import Regras from './pages/Regras';

function App() {
  return (
    <ChampionshipProvider>
      <Router>
        <div className="min-h-screen">
          <Navigation />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/grupos" element={<Grupos />} />
              <Route path="/classificacao" element={<Classificacao />} />
              <Route path="/mata-mata" element={<MataMata />} />
              <Route path="/regras" element={<Regras />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ChampionshipProvider>
  );
}

export default App;

