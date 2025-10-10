import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ClienteRegistro from './pages/ClienteRegistro';
import Login from './pages/Login';
import EmpenarArticulo from './pages/EmpenarArticulo';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<ClienteRegistro />} />
        <Route path="/empenar" element={<EmpenarArticulo />} />
        {/* Agrega más rutas aquí según necesites */}
      </Routes>
    </Router>
  );
}

export default App;
