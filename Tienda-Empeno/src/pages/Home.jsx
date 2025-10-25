import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Store, HandCoins, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '../components/Header';

function Home() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Promociones del carrusel
  const promociones = [
    {
      id: 1,
      titulo: '20% DE DESCUENTO',
      subtitulo: 'EN TODA LA CATEGORÍA',
      categoria: 'ELECTRÓNICOS',
      descripcion: '¡No te pierdas esta increíble oferta en todos nuestros productos electrónicos!',
      gradiente: 'from-blue-600 via-blue-500 to-cyan-500',
      icono: '📱'
    },
    {
      id: 2,
      titulo: '15% DE DESCUENTO',
      subtitulo: 'OFERTAS EXCLUSIVAS EN',
      categoria: 'AUTOS',
      descripcion: 'Aprovecha nuestros descuentos especiales en vehículos seleccionados',
      gradiente: 'from-red-600 via-orange-500 to-yellow-500',
      icono: '🚗'
    },
    {
      id: 3,
      titulo: '50% DE DESCUENTO',
      subtitulo: 'OFERTA LIMITADA',
      categoria: 'NINTENDO SWITCH',
      descripcion: '¡Increíble descuento en consolas Nintendo Switch! Stock limitado',
      gradiente: 'from-purple-600 via-pink-500 to-red-500',
      icono: '🎮'
    }
  ];

  // Redirigir a los administradores al panel de administrador
  useEffect(() => {
    const tipoUsuario = localStorage.getItem('tipoUsuario');
    if (tipoUsuario === 'Administrador') {
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  // Auto-avanzar carrusel cada 5 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promociones.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [promociones.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % promociones.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + promociones.length) % promociones.length);
  };

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

        {/* Carrusel de Promociones */}
        <div className="relative mb-16 overflow-hidden rounded-3xl shadow-2xl">
          {/* Slides */}
          <div className="relative h-[400px] md:h-[500px]">
            {promociones.map((promo, index) => (
              <div
                key={promo.id}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  index === currentSlide
                    ? 'opacity-100 translate-x-0'
                    : index < currentSlide
                    ? 'opacity-0 -translate-x-full'
                    : 'opacity-0 translate-x-full'
                }`}
              >
                <div className={`h-full bg-gradient-to-br ${promo.gradiente} flex items-center justify-center relative overflow-hidden`}>
                  {/* Decoración de fondo */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 text-9xl">{promo.icono}</div>
                    <div className="absolute bottom-10 right-10 text-9xl rotate-12">{promo.icono}</div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[20rem] opacity-5">
                      {promo.icono}
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="relative z-10 text-center px-4 sm:px-8 max-w-4xl">
                    <div className="mb-6">
                      <p className="text-white/90 text-lg md:text-xl font-semibold mb-2 tracking-wide">
                        {promo.subtitulo}
                      </p>
                      <h3 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-4 drop-shadow-2xl animate-pulse">
                        {promo.titulo}
                      </h3>
                      <p className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-wider drop-shadow-lg">
                        {promo.categoria}
                      </p>
                    </div>
                    <p className="text-white/95 text-base md:text-xl font-medium max-w-2xl mx-auto drop-shadow-md">
                      {promo.descripcion}
                    </p>

                    {/* Badge decorativo */}
                    <div className="mt-8 inline-block">
                      <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-white/40">
                        <span className="text-white font-bold text-sm md:text-base tracking-wide">
                          ¡OFERTA ESPECIAL!
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Botones de navegación */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110 z-20"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110 z-20"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Indicadores */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
            {promociones.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentSlide
                    ? 'bg-white w-12 h-3'
                    : 'bg-white/50 hover:bg-white/75 w-3 h-3'
                }`}
                aria-label={`Ir a slide ${index + 1}`}
              />
            ))}
          </div>
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
