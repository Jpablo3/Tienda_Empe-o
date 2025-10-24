import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, Package, Tag, Check } from 'lucide-react';
import Header from '../components/Header';
import { tiendaAPI } from '../api/tiendaAPI';
import { useCart } from '../context/CartContext';

const ProductoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();

  const [producto, setProducto] = useState(null);
  const [valoraciones, setValoraciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imagenPrincipal, setImagenPrincipal] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    cargarProducto();
    cargarValoraciones();
  }, [id]);

  const cargarProducto = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await tiendaAPI.verDetalleProducto(id);
      setProducto(data);
    } catch (err) {
      console.error('Error al cargar producto:', err);
      setError('Error al cargar el detalle del producto');
    } finally {
      setLoading(false);
    }
  };

  const cargarValoraciones = async () => {
    try {
      const data = await tiendaAPI.verValoracionesProducto(id);
      setValoraciones(data);
    } catch (err) {
      console.error('Error al cargar valoraciones:', err);
    }
  };

  const handleAddToCart = () => {
    addToCart(producto);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
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
          className={`w-5 h-5 ${i < fullStars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  const obtenerImagenesValidas = () => {
    if (!producto) return [];

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
        <Header />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Cargando producto...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {error || 'Producto no encontrado'}
            </h3>
            <button
              onClick={() => navigate('/tienda')}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Volver al catálogo
            </button>
          </div>
        </div>
      </div>
    );
  }

  const imagenesValidas = obtenerImagenesValidas();
  const enCarrito = isInCart(producto.idProductoTienda);

  // Verificar si tiene promoción activa
  const tienePromocion = producto.promocionActiva && producto.precioOriginal && producto.precioConDescuento;
  const descuento = tienePromocion ? producto.precioOriginal - producto.precioConDescuento : 0;
  const porcentajeDescuento = tienePromocion ? Math.round((descuento / producto.precioOriginal) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Botón volver */}
        <button
          onClick={() => navigate('/tienda')}
          className="flex items-center text-gray-600 hover:text-purple-600 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver al catálogo
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Galería de imágenes */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            {/* Imagen principal */}
            <div className="relative h-96 bg-gray-100 rounded-xl overflow-hidden mb-4">
              <img
                src={`http://localhost:8080${imagenesValidas[imagenPrincipal]}`}
                alt={producto.nombreProducto}
                className="w-full h-full object-cover"
              />

              {/* Badge de descuento o único */}
              {tienePromocion ? (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-orange-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg animate-pulse">
                  {producto.promocionActiva.tipoDescuento === 'PORCENTAJE'
                    ? `-${porcentajeDescuento}% DESCUENTO`
                    : `-${formatCurrency(descuento)} DESCUENTO`
                  }
                </div>
              ) : (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                  ¡ARTÍCULO ÚNICO!
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {imagenesValidas.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {imagenesValidas.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setImagenPrincipal(index)}
                    className={`relative h-24 rounded-lg overflow-hidden border-2 transition-all ${
                      imagenPrincipal === index
                        ? 'border-purple-600 shadow-lg'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <img
                      src={`http://localhost:8080${img}`}
                      alt={`${producto.nombreProducto} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Información del producto */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Tipo y calificación */}
            <div className="flex items-center justify-between mb-4">
              <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                {producto.tipoArticulo}
              </span>
              <div className="flex items-center">
                {renderStars(producto.calificacionPromedio)}
                {producto.totalValoraciones > 0 && (
                  <span className="ml-2 text-sm text-gray-600">
                    ({producto.totalValoraciones} valoraciones)
                  </span>
                )}
              </div>
            </div>

            {/* Nombre */}
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {producto.nombreProducto}
            </h1>

            {/* Precio */}
            <div className="mb-6">
              {tienePromocion ? (
                <div>
                  {/* Nombre de la promoción */}
                  <div className="mb-3 p-3 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-lg">
                    <p className="text-sm font-bold text-red-700 flex items-center">
                      <Tag className="w-4 h-4 mr-2" />
                      {producto.promocionActiva.nombrePromocion}
                    </p>
                    {producto.promocionActiva.descripcion && (
                      <p className="text-xs text-red-600 mt-1">{producto.promocionActiva.descripcion}</p>
                    )}
                  </div>

                  {/* Precio original tachado */}
                  <p className="text-xl text-gray-400 line-through mb-2">
                    {formatCurrency(producto.precioOriginal)}
                  </p>

                  {/* Precio con descuento */}
                  <div className="flex items-center gap-3 mb-2">
                    <p className="text-4xl font-bold text-red-600">
                      {formatCurrency(producto.precioConDescuento)}
                    </p>
                    <span className="text-lg font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full">
                      -{porcentajeDescuento}%
                    </span>
                  </div>

                  {/* Ahorro */}
                  <p className="text-lg text-emerald-600 font-bold">
                    ¡Ahorras {formatCurrency(descuento)}!
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-4xl font-bold text-purple-600">
                    {formatCurrency(producto.precioVentaTienda)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Artículo único - Solo disponible 1 unidad
                  </p>
                </div>
              )}
            </div>

            {/* Estado físico */}
            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Estado:</span>
                <span className="text-sm font-medium text-gray-900">{producto.estadoFisico}</span>
              </div>
            </div>

            {/* Descripción */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Descripción</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {producto.descripcion}
              </p>
            </div>

            {/* Botón agregar al carrito */}
            {enCarrito ? (
              <div className="flex items-center justify-center p-4 bg-emerald-50 border-2 border-emerald-500 rounded-xl">
                <Check className="w-5 h-5 text-emerald-600 mr-2" />
                <span className="text-emerald-700 font-semibold">Ya está en tu carrito</span>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center ${
                  added
                    ? 'bg-emerald-600'
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-6 h-6 mr-2" />
                    ¡Agregado al carrito!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-6 h-6 mr-2" />
                    Agregar al Carrito
                  </>
                )}
              </button>
            )}

            {/* Info adicional */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Tag className="w-4 h-4 mr-2 text-purple-600" />
                Envío a domicilio disponible
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Package className="w-4 h-4 mr-2 text-purple-600" />
                Tiempo estimado de entrega: 15 días
              </div>
            </div>
          </div>
        </div>

        {/* Sección de valoraciones */}
        {valoraciones.length > 0 && (
          <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Valoraciones de Clientes
            </h2>

            <div className="space-y-6">
              {valoraciones.map((val, index) => (
                <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-800">{val.nombreCliente}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(val.fechaValoracion).toLocaleDateString('es-GT')}
                      </p>
                    </div>
                    <div className="flex items-center">
                      {renderStars(val.calificacion)}
                    </div>
                  </div>
                  {val.comentario && (
                    <p className="text-gray-600 leading-relaxed">{val.comentario}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductoDetalle;
