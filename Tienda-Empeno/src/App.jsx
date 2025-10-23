import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedRouteAdmin from './components/ProtectedRouteAdmin';
import InstallPWA from './components/InstallPWA';
import Home from './pages/Home';
import ClienteRegistro from './pages/ClienteRegistro';
import Login from './pages/Login';
import EmpenarArticulo from './pages/EmpenarArticulo';
import VenderArticulo from './pages/VenderArticulo';
import Perfil from './pages/Perfil';
import Contratos from './pages/Contratos';
import DetalleContrato from './pages/DetalleContrato';
import MisPrestamos from './pages/MisPrestamos';
import PagarPrestamo from './pages/PagarPrestamo';
import MisVentas from './pages/MisVentas';
import PanelAdmin from './pages/admin/PanelAdmin';
import ArticulosPrestamos from './pages/admin/ArticulosPrestamos';
import ArticulosCompras from './pages/admin/ArticulosCompras';
import ArticulosTienda from './pages/admin/ArticulosTienda';

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
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Perfil />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ventas"
            element={
              <ProtectedRoute>
                <VenderArticulo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contratos"
            element={
              <ProtectedRoute>
                <Contratos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contratos/:id"
            element={
              <ProtectedRoute>
                <DetalleContrato />
              </ProtectedRoute>
            }
          />
          <Route
            path="/prestamos"
            element={
              <ProtectedRoute>
                <MisPrestamos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/prestamos/:id/pagar"
            element={
              <ProtectedRoute>
                <PagarPrestamo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mis-ventas"
            element={
              <ProtectedRoute>
                <MisVentas />
              </ProtectedRoute>
            }
          />
          {/* Rutas de Administrador */}
          <Route
            path="/admin"
            element={
              <ProtectedRouteAdmin>
                <PanelAdmin />
              </ProtectedRouteAdmin>
            }
          />
          <Route
            path="/admin/prestamos"
            element={
              <ProtectedRouteAdmin>
                <ArticulosPrestamos />
              </ProtectedRouteAdmin>
            }
          />
          <Route
            path="/admin/compras"
            element={
              <ProtectedRouteAdmin>
                <ArticulosCompras />
              </ProtectedRouteAdmin>
            }
          />
          <Route
            path="/admin/tienda"
            element={
              <ProtectedRouteAdmin>
                <ArticulosTienda />
              </ProtectedRouteAdmin>
            }
          />
          <Route
            path="/admin/panel"
            element={
              <ProtectedRouteAdmin>
                <PanelAdmin />
              </ProtectedRouteAdmin>
            }
          />
        </Routes>
        <InstallPWA />
      </AuthProvider>
    </Router>
  );
}

export default App;
