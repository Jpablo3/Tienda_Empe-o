import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ClienteRegistro from './pages/ClienteRegistro';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registro" element={<ClienteRegistro />} />
        {/* Agrega más rutas aquí según necesites */}
      </Routes>
    </Router>
  );
}

export default App;
