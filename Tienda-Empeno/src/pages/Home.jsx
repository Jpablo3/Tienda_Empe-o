import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Store, HandCoins, DollarSign } from 'lucide-react';
import Header from '../components/Header';

function Home() {
  const navigate = useNavigate();

  // Redirigir a los administradores al panel de administrador
  useEffect(() => {
    const tipoUsuario = localStorage.getItem('tipoUsuario');
    if (tipoUsuario === 'Administrador') {
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
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
                <HandCoins className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-semibold text-lg mb-2">Ventas</h4>
              <p className="text-gray-600 text-sm">
                Vende tus artículos de forma rápida y segura
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Botones Principales */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-4 py-5">
            <button
              onClick={() => navigate('/empenar')}
              className="flex flex-col items-center justify-center py-3 px-2 rounded-xl hover:bg-gradient-to-br hover:from-purple-50 hover:to-purple-100 transition-all group"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-md">
                <DollarSign className="h-7 w-7 text-white" />
              </div>
              <span className="text-sm font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                Empeñar
              </span>
            </button>

            <button
              onClick={() => navigate('/tienda')}
              className="flex flex-col items-center justify-center py-3 px-2 rounded-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 transition-all group"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-md">
                <Store className="h-7 w-7 text-white" />
              </div>
              <span className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                Tienda
              </span>
            </button>

            <button
              onClick={() => navigate('/ventas')}
              className="flex flex-col items-center justify-center py-3 px-2 rounded-xl hover:bg-gradient-to-br hover:from-indigo-50 hover:to-indigo-100 transition-all group"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-md">
                <HandCoins className="h-7 w-7 text-white" />
              </div>
              <span className="text-sm font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                Ventas
              </span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
