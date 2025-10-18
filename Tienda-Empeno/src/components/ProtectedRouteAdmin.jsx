import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRouteAdmin({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // Mostrar un loader mientras verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated()) {
    localStorage.setItem('redirectAfterLogin', window.location.pathname);
    return <Navigate to="/login" replace />;
  }

  // Verificar si es administrador
  const tipoUsuario = localStorage.getItem('tipoUsuario');
  if (tipoUsuario !== 'Administrador') {
    // Si no es admin, redirigir a la página principal de clientes
    return <Navigate to="/" replace />;
  }

  // Si está autenticado y es admin, mostrar el contenido protegido
  return children;
}

export default ProtectedRouteAdmin;
