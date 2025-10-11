import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, UserPlus, LogOut, Home as HomeIcon, Users, Package, Settings, DollarSign, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const menuLinks = [
    { name: 'Inicio', icon: <HomeIcon className="h-5 w-5" />, path: '/' },
    { name: 'Mis Préstamos', icon: <DollarSign className="h-5 w-5" />, path: '/prestamos', requireAuth: true },
    { name: 'Mis Artículos', icon: <Package className="h-5 w-5" />, path: '/articulos', requireAuth: true },
    { name: 'Perfil', icon: <Users className="h-5 w-5" />, path: '/perfil', requireAuth: true },
    { name: 'Configuración', icon: <Settings className="h-5 w-5" />, path: '/configuracion', requireAuth: true }
  ];

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const isHomePage = location.pathname === '/';

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Lado izquierdo: Botón volver o menú hamburguesa */}
          <div className="flex items-center">
            {!isHomePage ? (
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg text-gray-600 hover:bg-purple-100 hover:text-purple-700 transition-all"
                title="Volver"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
            ) : (
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:bg-purple-100 hover:text-purple-700 transition-all"
              >
                {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            )}
            <h1
              className="ml-4 text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent cursor-pointer"
              onClick={() => navigate('/')}
            >
              Tienda Empeño
            </h1>
          </div>

          {/* Lado derecho: Botones de autenticación */}
          <div className="flex items-center space-x-3">
            {isAuthenticated() ? (
              <>
                <span className="text-sm text-gray-600 hidden sm:block">
                  {user.userEmail}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg font-medium transition-all"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => navigate('/registro')}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Registro
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Menú Desplegable (solo en página de inicio) */}
      {menuOpen && isHomePage && (
        <div className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="space-y-2">
              {menuLinks.map((link) => {
                // Si el link requiere autenticación y el usuario no está autenticado, no mostrarlo
                if (link.requireAuth && !isAuthenticated()) {
                  return null;
                }

                return (
                  <button
                    key={link.name}
                    onClick={() => handleNavigate(link.path)}
                    className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:text-purple-700 rounded-lg transition-all group"
                  >
                    <span className="text-gray-500 group-hover:text-purple-600 transition-colors">
                      {link.icon}
                    </span>
                    <span className="ml-3 font-medium">{link.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
