import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, UserPlus, LogOut, Home as HomeIcon, Package, ArrowLeft, User, FileText, CreditCard, ShoppingBag, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const { getCartCount, setIsCartOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const menuLinks = [
    { name: 'Inicio', icon: <HomeIcon className="h-5 w-5" />, path: '/' },
    { name: 'Contratos', icon: <FileText className="h-5 w-5" />, path: '/contratos', requireAuth: true },
    { name: 'Mis Préstamos', icon: <CreditCard className="h-5 w-5" />, path: '/prestamos', requireAuth: true },
    { name: 'Mis Ventas', icon: <ShoppingBag className="h-5 w-5" />, path: '/mis-ventas', requireAuth: true }
  ];

  // Cerrar menú de usuario al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setUserMenuOpen(false);
    navigate('/');
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const toggleHamburgerMenu = () => {
    setMenuOpen(!menuOpen);
    setUserMenuOpen(false); // Cerrar menú de usuario
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
    setMenuOpen(false); // Cerrar menú hamburguesa
  };

  const getUserInitial = () => {
    if (user && user.userEmail) {
      return user.userEmail.charAt(0).toUpperCase();
    }
    return 'U';
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
                onClick={toggleHamburgerMenu}
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
            {/* Botón del carrito - visible siempre */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-lg text-gray-600 hover:bg-purple-100 hover:text-purple-700 transition-all"
              title="Ver carrito"
            >
              <ShoppingCart className="h-6 w-6" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg animate-pulse">
                  {getCartCount()}
                </span>
              )}
            </button>

            {isAuthenticated() ? (
              <div className="relative" ref={userMenuRef}>
                {/* Círculo con inicial del usuario y nombre debajo */}
                <button
                  onClick={toggleUserMenu}
                  className="flex flex-col items-center space-y-1 hover:opacity-80 transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-lg hover:shadow-lg transition-all hover:scale-105">
                    {getUserInitial()}
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    Usuario
                  </span>
                </button>

                {/* Menú desplegable */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <button
                      onClick={() => {
                        navigate('/perfil');
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:text-purple-700 transition-all"
                    >
                      <User className="h-4 w-4 mr-3" />
                      Ver Perfil
                    </button>
                    <button
                      onClick={() => {
                        navigate('/tienda/mis-pedidos');
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:text-purple-700 transition-all"
                    >
                      <Package className="h-4 w-4 mr-3" />
                      Mis Pedidos
                    </button>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 transition-all"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
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
