import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import ClienteRegistro from './pages/ClienteRegistro';
import Login from './pages/Login';
import EmpenarArticulo from './pages/EmpenarArticulo';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<ClienteRegistro />} />
          <Route
            path="/empenar"
            element={
              <ProtectedRoute>
                <EmpenarArticulo />
              </ProtectedRoute>
            }
          />
          {/* Agrega más rutas aquí según necesites */}
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
