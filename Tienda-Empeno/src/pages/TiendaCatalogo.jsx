import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ShoppingCart, Star, Package, Tag } from 'lucide-react';
import Header from '../components/Header';
import { tiendaAPI } from '../api/tiendaAPI';
import { useCart } from '../context/CartContext';

const TiendaCatalogo = () => {
  const navigate = useNavigate();
  const { addToCart, isInCart, setIsCartOpen } = useCart();

  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroPromocion, setFiltroPromocion] = useState('todos');
  const [orden, setOrden] = useState('recientes');
  const [imagenesActuales, setImagenesActuales] = useState({});

  // Carrusel automático de imágenes (cada 5 segundos)
  useEffect(() => {
    const interval = setInterval(() => {
      setImagenesActuales(prev => {
        const nuevasImagenes = { ...prev };
        productosFiltrados.forEach(producto => {
          const imagenesValidas = obtenerImagenesValidas(producto);
          if (imagenesValidas.length > 1) {
            const indexActual = nuevasImagenes[producto.idProductoTienda] || 0;
            nuevasImagenes[producto.idProductoTienda] = (indexActual + 1) % imagenesValidas.length;
          }
        });
        return nuevasImagenes;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [productosFiltrados]);

  useEffect(() => {
    cargarCatalogo();
  }, []);

  useEffect(() => {
    aplicarFiltrosYOrden();
  }, [productos, busqueda, filtroTipo, filtroPromocion, orden]);

  const cargarCatalogo = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await tiendaAPI.listarCatalogo();
      setProductos(data);
    } catch (err) {
      console.error('Error al cargar catálogo:', err);
      setError('Error al cargar el catálogo de productos');
    } finally {
      setLoading(false);
    }
  };

  const obtenerImagenesValidas = (producto) => {
    const imagenes = [];

    if (producto.imagenes && Array.isArray(producto.imagenes)) {
      producto.imagenes.forEach(img => {
        if (typeof img === 'string' && img.trim().length > 0) {
          imagenes.push(img);
        }
      });
    }

    return imagenes.length > 0 ? imagenes : ['/placeholder-product.png'];
  };

  const aplicarFiltrosYOrden = () => {
    let resultado = [...productos];

    // Filtro por búsqueda
    if (busqueda.trim()) {
      resultado = resultado.filter(p =>
        p.nombreProducto.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.descripcion.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    // Filtro por tipo
    if (filtroTipo !== 'todos') {
      resultado = resultado.filter(p => p.tipoArticulo === filtroTipo);
    }

    // Filtro por promoción
    if (filtroPromocion === 'con-promocion') {
      resultado = resultado.filter(p =>
        p.promocionActiva && p.precioOriginal && p.precioConDescuento
      );
    } else if (filtroPromocion === 'sin-promocion') {
      resultado = resultado.filter(p =>
        !p.promocionActiva || !p.precioOriginal || !p.precioConDescuento
      );
    }

    // Ordenar
    switch (orden) {
      case 'precio-menor':
        resultado.sort((a, b) => a.precioVentaTienda - b.precioVentaTienda);
        break;
      case 'precio-mayor':
        resultado.sort((a, b) => b.precioVentaTienda - a.precioVentaTienda);
        break;
      case 'mejor-calificados':
        resultado.sort((a, b) => (b.calificacionPromedio || 0) - (a.calificacionPromedio || 0));
        break;
      case 'recientes':
      default:
        resultado.sort((a, b) => new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion));
        break;
    }

    setProductosFiltrados(resultado);
  };

  const obtenerTiposUnicos = () => {
    const tipos = new Set(productos.map(p => p.tipoArticulo));
    return Array.from(tipos);
  };

  const handleAddToCart = (producto) => {
    addToCart(producto);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ'
    }).format(value);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);

    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${i < fullStars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
        <Header />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Cargando catálogo...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      <Header />

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Tienda de Artículos Únicos</h1>
          <p className="text-xl text-purple-100">
            Descubre artículos de segunda mano en excelente estado
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Barra de búsqueda y filtros */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar productos..."
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
              />
            </div>

            {/* Filtro por tipo */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="pl-10 pr-8 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none appearance-none bg-white"
              >
                <option value="todos">Todos los tipos</option>
                {obtenerTiposUnicos().map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>

            {/* Filtro por promoción */}
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filtroPromocion}
                onChange={(e) => setFiltroPromocion(e.target.value)}
                className="pl-10 pr-8 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none appearance-none bg-white"
              >
                <option value="todos">Todos los productos</option>
                <option value="con-promocion">Con promoción</option>
                <option value="sin-promocion">Sin promoción</option>
              </select>
            </div>

            {/* Ordenar */}
            <select
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none appearance-none bg-white"
            >
              <option value="recientes">Más recientes</option>
              <option value="precio-menor">Precio: menor a mayor</option>
              <option value="precio-mayor">Precio: mayor a menor</option>
              <option value="mejor-calificados">Mejor calificados</option>
            </select>
          </div>

          {/* Resultados */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
            <div className="text-gray-600">
              Mostrando <span className="font-semibold text-purple-600">{productosFiltrados.length}</span> productos
            </div>
            {filtroPromocion === 'todos' && (
              <div className="flex items-center gap-2 bg-gradient-to-r from-red-50 to-orange-50 px-3 py-1.5 rounded-full border border-red-200">
                <Tag className="w-4 h-4 text-red-600" />
                <span className="text-red-700 font-medium">
                  {productosFiltrados.filter(p => p.promocionActiva && p.precioOriginal && p.precioConDescuento).length} con promoción
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Grid de productos */}
        {productosFiltrados.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No se encontraron productos
            </h3>
            <p className="text-gray-600">
              Intenta ajustar los filtros o buscar con otros términos
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productosFiltrados.map((producto) => {
              const imagenesValidas = obtenerImagenesValidas(producto);
              const indexActual = imagenesActuales[producto.idProductoTienda] || 0;
              const enCarrito = isInCart(producto.idProductoTienda);

              // Verificar si tiene promoción activa
              const tienePromocion = producto.promocionActiva && producto.precioOriginal && producto.precioConDescuento;
              const descuento = tienePromocion ? producto.precioOriginal - producto.precioConDescuento : 0;
              const porcentajeDescuento = tienePromocion ? Math.round((descuento / producto.precioOriginal) * 100) : 0;

              return (
                <div
                  key={producto.idProductoTienda}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
                >
                  {/* Imagen con carrusel */}
                  <div
                    onClick={() => navigate(`/tienda/producto/${producto.idProductoTienda}`)}
                    className="relative h-64 bg-gray-100"
                  >
                    <img
                      src={`http://localhost:8080${imagenesValidas[indexActual]}`}
                      alt={producto.nombreProducto}
                      className="w-full h-full object-cover transition-opacity duration-500"
                      loading="lazy"
                    />

                    {/* Badge de descuento (si tiene promoción) */}
                    {tienePromocion ? (
                      <div className="absolute top-2 left-2 bg-gradient-to-r from-red-600 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                        {producto.promocionActiva.tipoDescuento === 'PORCENTAJE'
                          ? `-${porcentajeDescuento}%`
                          : `-${formatCurrency(descuento)}`
                        }
                      </div>
                    ) : (
                      <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        ¡ÚNICO!
                      </div>
                    )}

                    {/* Indicadores de carrusel */}
                    {imagenesValidas.length > 1 && (
                      <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
                        {imagenesValidas.map((_, index) => (
                          <div
                            key={index}
                            className={`h-2 rounded-full transition-all duration-300 ${
                              index === indexActual
                                ? 'w-6 bg-white shadow-lg'
                                : 'w-2 bg-white/60'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Información del producto */}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        {renderStars(producto.calificacionPromedio)}
                        {producto.totalValoraciones > 0 && (
                          <span className="ml-2 text-sm text-gray-600">
                            ({producto.totalValoraciones})
                          </span>
                        )}
                      </div>
                      <Tag className="w-4 h-4 text-purple-600" />
                    </div>

                    <h3
                      onClick={() => navigate(`/tienda/producto/${producto.idProductoTienda}`)}
                      className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 hover:text-purple-600 transition-colors"
                    >
                      {producto.nombreProducto}
                    </h3>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {producto.descripcion}
                    </p>

                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                        {producto.tipoArticulo}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        {tienePromocion ? (
                          <div>
                            {/* Precio original tachado */}
                            <p className="text-sm text-gray-400 line-through">
                              {formatCurrency(producto.precioOriginal)}
                            </p>
                            {/* Precio con descuento */}
                            <div className="flex items-center gap-2">
                              <p className="text-2xl font-bold text-red-600">
                                {formatCurrency(producto.precioConDescuento)}
                              </p>
                              <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded">
                                ¡OFERTA!
                              </span>
                            </div>
                            {/* Ahorro */}
                            <p className="text-xs text-emerald-600 font-semibold">
                              Ahorras {formatCurrency(descuento)}
                            </p>
                          </div>
                        ) : (
                          <p className="text-2xl font-bold text-purple-600">
                            {formatCurrency(producto.precioVentaTienda)}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          if (enCarrito) {
                            setIsCartOpen(true);
                          } else {
                            handleAddToCart(producto);
                          }
                        }}
                        className={`${
                          enCarrito
                            ? 'bg-emerald-600 hover:bg-emerald-700'
                            : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                        } text-white p-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg`}
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TiendaCatalogo;
