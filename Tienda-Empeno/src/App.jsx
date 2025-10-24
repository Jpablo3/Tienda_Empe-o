import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedRouteAdmin from './components/ProtectedRouteAdmin';
import InstallPWA from './components/InstallPWA';
import FloatingCart from './components/FloatingCart';
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
import GestionPromociones from './pages/admin/GestionPromociones';
import TiendaCatalogo from './pages/TiendaCatalogo';
import ProductoDetalle from './pages/ProductoDetalle';
import Checkout from './pages/Checkout';
import MisPedidos from './pages/MisPedidos';
import SeguimientoPedido from './pages/SeguimientoPedido';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <FloatingCart />
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
          <Route
            path="/admin/promociones"
            element={
              <ProtectedRouteAdmin>
                <GestionPromociones />
              </ProtectedRouteAdmin>
            }
          />
          {/* Rutas de Tienda */}
          <Route path="/tienda" element={<TiendaCatalogo />} />
          <Route path="/tienda/producto/:id" element={<ProductoDetalle />} />
          <Route
            path="/tienda/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tienda/mis-pedidos"
            element={
              <ProtectedRoute>
                <MisPedidos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tienda/pedido/:idPedido/seguimiento"
            element={
              <ProtectedRoute>
                <SeguimientoPedido />
              </ProtectedRoute>
            }
          />
          </Routes>
          <InstallPWA />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
