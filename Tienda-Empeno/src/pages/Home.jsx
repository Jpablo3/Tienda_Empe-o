import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Store, ShoppingCart, DollarSign, LogIn, UserPlus, Home as HomeIcon, Users, Package, Settings } from 'lucide-react';

function Home() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Imágenes destacadas (puedes reemplazar con tus URLs)
  const featuredItems = [
    {
      id: 1,
      title: 'Joyas de Oro',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=300&fit=crop',
      link: '/categoria/joyas'
    },
    {
      id: 2,
      title: 'Electrónicos',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&h=300&fit=crop',
      link: '/categoria/electronicos'
    },
    {
      id: 3,
      title: 'Relojes Premium',
      image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&h=300&fit=crop',
      link: '/categoria/relojes'
    },
    {
      id: 4,
      title: 'Instrumentos Musicales',
      image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&h=300&fit=crop',
      link: '/categoria/instrumentos'
    }
  ];

  const menuLinks = [
    { name: 'Inicio', icon: <HomeIcon className="h-5 w-5" />, path: '/' },
    { name: 'Mis Préstamos', icon: <DollarSign className="h-5 w-5" />, path: '/prestamos' },
    { name: 'Mis Artículos', icon: <Package className="h-5 w-5" />, path: '/articulos' },
    { name: 'Perfil', icon: <Users className="h-5 w-5" />, path: '/perfil' },
    { name: 'Configuración', icon: <Settings className="h-5 w-5" />, path: '/configuracion' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Menú Hamburguesa - Izquierda */}
            <div className="flex items-center">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:bg-purple-100 hover:text-purple-700 transition-all"
              >
                {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <h1 className="ml-4 text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Tienda Empeño
              </h1>
            </div>

            {/* Botones de Auth - Derecha */}
            <div className="flex items-center space-x-3">
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
            </div>
          </div>
        </div>

        {/* Menú Desplegable */}
        {menuOpen && (
          <div className="bg-white border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <nav className="space-y-2">
                {menuLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => {
                      navigate(link.path);
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:text-purple-700 rounded-lg transition-all group"
                  >
                    <span className="text-gray-500 group-hover:text-purple-600 transition-colors">
                      {link.icon}
                    </span>
                    <span className="ml-3 font-medium">{link.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Bienvenido a Tienda Empeño
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Empeña, compra o vende artículos de valor de manera segura y confiable
          </p>
        </div>

        {/* Grid de Imágenes Destacadas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {featuredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(item.link)}
              className="group cursor-pointer bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">Ver más →</p>
              </div>
            </div>
          ))}
        </div>

        {/* Sección Informativa */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-16">
          <h3 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            ¿Cómo Funciona?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-semibold text-lg mb-2">Empeñar</h4>
              <p className="text-gray-600 text-sm">
                Obtén efectivo rápido empeñando tus artículos de valor
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Store className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-semibold text-lg mb-2">Tienda</h4>
              <p className="text-gray-600 text-sm">
                Explora nuestra colección de artículos disponibles
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-semibold text-lg mb-2">Comprar</h4>
              <p className="text-gray-600 text-sm">
                Adquiere artículos de calidad a excelentes precios
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Botones Principales */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-4 py-4">
            <button
              onClick={() => navigate('/empenar')}
              className="flex flex-col items-center justify-center py-3 px-4 rounded-xl hover:bg-gradient-to-br hover:from-purple-50 hover:to-purple-100 transition-all group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-purple-600">
                Empeñar
              </span>
            </button>

            <button
              onClick={() => navigate('/tienda')}
              className="flex flex-col items-center justify-center py-3 px-4 rounded-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 transition-all group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Store className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600">
                Tienda
              </span>
            </button>

            <button
              onClick={() => navigate('/comprar')}
              className="flex flex-col items-center justify-center py-3 px-4 rounded-xl hover:bg-gradient-to-br hover:from-indigo-50 hover:to-indigo-100 transition-all group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-indigo-600">
                Comprar
              </span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
