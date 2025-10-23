import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, DollarSign, Tag, Edit3 } from 'lucide-react';
import HeaderAdmin from '../../components/HeaderAdmin';
import { adminAPI } from '../../api/adminAPI';
import ModalPrepararProducto from '../../components/ModalPrepararProducto';

const ArticulosTienda = () => {
  const navigate = useNavigate();
  const [articulos, setArticulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [imagenesActuales, setImagenesActuales] = useState({});

  useEffect(() => {
    cargarArticulos();
  }, []);

  // Carrusel automático de imágenes (cada 5 segundos)
  useEffect(() => {
    const interval = setInterval(() => {
      setImagenesActuales(prev => {
        const nuevasImagenes = { ...prev };
        articulos.forEach(articulo => {
          const imagenesValidas = obtenerImagenesValidas(articulo);
          if (imagenesValidas.length > 1) {
            const indexActual = nuevasImagenes[articulo.idArticulo] || 0;
            nuevasImagenes[articulo.idArticulo] = (indexActual + 1) % imagenesValidas.length;
          }
        });
        return nuevasImagenes;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [articulos]);

  // Función helper para obtener imágenes válidas
  const obtenerImagenesValidas = (articulo) => {
    const imagenes = [];

    if (articulo.imagenes && Array.isArray(articulo.imagenes)) {
      articulo.imagenes.forEach(img => {
        if (typeof img === 'string' && img.trim().length > 0) {
          imagenes.push(img);
        }
      });
    }

    if (imagenes.length === 0 && articulo.urlImagen && typeof articulo.urlImagen === 'string') {
      imagenes.push(articulo.urlImagen);
    }

    return imagenes;
  };

  const cargarArticulos = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await adminAPI.listarArticulosParaPreparar();
      setArticulos(data);
    } catch (err) {
      console.error('Error al cargar artículos:', err);
      setError(err.response?.data?.error || 'Error al cargar artículos para preparar');
    } finally {
      setLoading(false);
    }
  };

  const handlePrepararClick = (articulo) => {
    setArticuloSeleccionado(articulo);
    setShowModal(true);
  };

  const handleProductoPreparado = () => {
    setShowModal(false);
    setArticuloSeleccionado(null);
    setSuccessMessage('¡Producto preparado y publicado en la tienda exitosamente!');

    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);

    cargarArticulos();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ'
    }).format(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
        <HeaderAdmin />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Cargando artículos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      <HeaderAdmin />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/panel')}
            className="flex items-center text-gray-600 hover:text-emerald-600 transition-colors mb-4 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver al Panel
          </button>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
              Artículos para Preparar
            </h1>
            <p className="text-gray-600">
              Prepara artículos aprobados para publicar en la tienda virtual
            </p>
          </div>
        </div>

        {/* Mensaje de éxito */}
        {successMessage && (
          <div className="mb-6 bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-lg shadow-md animate-fade-in">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="ml-3 text-emerald-800 font-medium">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Mensaje de error */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Lista de artículos */}
        {articulos.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No hay artículos para preparar
            </h3>
            <p className="text-gray-600">
              Los artículos aprobados aparecerán aquí para ser preparados para la tienda
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articulos.map((articulo) => {
              const imagenesValidas = obtenerImagenesValidas(articulo);
              const indexActual = imagenesActuales[articulo.idArticulo] || 0;

              return (
                <div
                  key={articulo.idArticulo}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Carrusel de imágenes */}
                  {imagenesValidas.length > 0 ? (
                    <div className="relative h-56 bg-gray-100">
                      <img
                        src={`http://localhost:8080${imagenesValidas[indexActual]}`}
                        alt={articulo.nombreArticulo}
                        className="w-full h-full object-cover transition-opacity duration-500"
                        loading="lazy"
                      />
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
                      {/* Contador de imágenes */}
                      {imagenesValidas.length > 1 && (
                        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                          {indexActual + 1}/{imagenesValidas.length}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-56 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <Package className="w-16 h-16 text-gray-400" />
                    </div>
                  )}

                  {/* Información del artículo */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-gray-800 line-clamp-2">
                        {articulo.nombreArticulo}
                      </h3>
                      <span className="ml-2 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full whitespace-nowrap">
                        {articulo.estadoArticulo}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {articulo.descripcion}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <Tag className="w-4 h-4 text-emerald-600 mr-2" />
                        <span className="text-gray-600">Tipo:</span>
                        <span className="ml-2 font-medium text-gray-800">{articulo.tipoArticulo}</span>
                      </div>

                      <div className="flex items-center text-sm">
                        <DollarSign className="w-4 h-4 text-emerald-600 mr-2" />
                        <span className="text-gray-600">Precio actual:</span>
                        <span className="ml-2 font-bold text-emerald-600">
                          {formatCurrency(articulo.precioArticulo)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handlePrepararClick(articulo)}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center group"
                    >
                      <Edit3 className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                      Preparar para Tienda
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal para preparar producto */}
      {showModal && articuloSeleccionado && (
        <ModalPrepararProducto
          articulo={articuloSeleccionado}
          onClose={() => {
            setShowModal(false);
            setArticuloSeleccionado(null);
          }}
          onSuccess={handleProductoPreparado}
        />
      )}
    </div>
  );
};

export default ArticulosTienda;
