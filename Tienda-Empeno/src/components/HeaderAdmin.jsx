import { useNavigate } from 'react-router-dom';
import { LogOut, Home } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const HeaderAdmin = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const nombreAdmin = localStorage.getItem('nombreUsuario') || 'Admin';
  const emailAdmin = localStorage.getItem('userEmail') || 'admin@tienda.com';

  const getUserInitial = () => {
    return nombreAdmin.charAt(0).toUpperCase();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo y Título */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate('/admin')}
          >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-purple-600">TE</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Panel Administrador</h1>
              <p className="text-xs text-purple-100">Tienda de Empeño</p>
            </div>
          </div>

          {/* Perfil y Menú */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 rounded-full px-4 py-2 transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <span className="text-lg font-bold text-purple-600">
                  {getUserInitial()}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-white">{nombreAdmin}</p>
                <p className="text-xs text-purple-100">Administrador</p>
              </div>
            </button>

            {/* Menú Desplegable */}
            {showMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl py-2 border border-gray-200">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-800">{nombreAdmin}</p>
                  <p className="text-xs text-gray-500">{emailAdmin}</p>
                  <span className="inline-block mt-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                    Administrador
                  </span>
                </div>

                <button
                  onClick={() => {
                    setShowMenu(false);
                    navigate('/admin');
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                >
                  <Home className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Panel Principal</span>
                </button>

                <button
                  onClick={() => {
                    setShowMenu(false);
                    handleLogout();
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-red-50 flex items-center space-x-3 transition-colors border-t border-gray-200"
                >
                  <LogOut className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-600 font-medium">Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderAdmin;
