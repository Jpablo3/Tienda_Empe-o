import { useState, useEffect } from 'react';
import { ShoppingBag, Clock, CheckCircle, XCircle, Calendar, MessageSquare, Loader } from 'lucide-react';
import Header from '../components/Header';
import { ventasAPI } from '../api/ventasAPI';
import { useNavigate } from 'react-router-dom';

const MisVentas = () => {
  const navigate = useNavigate();
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState('todas'); // 'todas', 'pendientes', 'aprobadas', 'rechazadas'
  const [imagenesActuales, setImagenesActuales] = useState({});

  useEffect(() => {
    cargarVentas();
  }, []);

  // Carrusel automático de imágenes (cada 5 segundos)
  useEffect(() => {
    const interval = setInterval(() => {
      setImagenesActuales(prev => {
        const nuevasImagenes = { ...prev };
        ventas.forEach(venta => {
          // Obtener array de imágenes válidas
          const imagenesValidas = obtenerImagenesValidas(venta);
          if (imagenesValidas.length > 1) {
            const indexActual = nuevasImagenes[venta.idCompra] || 0;
            nuevasImagenes[venta.idCompra] = (indexActual + 1) % imagenesValidas.length;
          }
        });
        return nuevasImagenes;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [ventas]);

  // Función helper para obtener imágenes válidas
  const obtenerImagenesValidas = (venta) => {
    const imagenes = [];

    // Intentar usar el array de imágenes del backend
    if (venta.imagenes && Array.isArray(venta.imagenes)) {
      venta.imagenes.forEach(img => {
        if (typeof img === 'string' && img.trim().length > 0) {
          imagenes.push(img);
        }
      });
    }

    // Si no hay imágenes en el array, usar urlImagen como fallback
    if (imagenes.length === 0 && venta.urlImagen && typeof venta.urlImagen === 'string') {
      imagenes.push(venta.urlImagen);
    }

    return imagenes;
  };

  const cargarVentas = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await ventasAPI.listarMisVentas();
      setVentas(response);
    } catch (error) {
      console.error('Error al cargar ventas:', error);
      setError('Error al cargar tus solicitudes de venta');
      if (error.response?.status === 401) {
        setTimeout(() => navigate('/login'), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const getEstadoInfo = (idEstado) => {
    switch (idEstado) {
      case 13:
        return {
          nombre: 'En Espera',
          color: 'text-yellow-600',
          bg: 'bg-yellow-100',
          border: 'border-yellow-300',
          icon: <Clock className="w-5 h-5" />
        };
      case 14:
        return {
          nombre: 'Comprado',
          color: 'text-green-600',
          bg: 'bg-green-100',
          border: 'border-green-300',
          icon: <CheckCircle className="w-5 h-5" />
        };
      case 15:
        return {
          nombre: 'No Aceptado',
          color: 'text-red-600',
          bg: 'bg-red-100',
          border: 'border-red-300',
          icon: <XCircle className="w-5 h-5" />
        };
      default:
        return {
          nombre: 'Desconocido',
          color: 'text-gray-600',
          bg: 'bg-gray-100',
          border: 'border-gray-300',
          icon: <Clock className="w-5 h-5" />
        };
    }
  };

  const ventasFiltradas = ventas.filter(venta => {
    if (filtro === 'todas') return true;
    if (filtro === 'pendientes') return venta.idEstado === 13;
    if (filtro === 'aprobadas') return venta.idEstado === 14;
    if (filtro === 'rechazadas') return venta.idEstado === 15;
    return true;
  });

  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-GT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full mb-4">
            <ShoppingBag className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Mis Solicitudes de Venta
          </h1>
          <p className="text-gray-600">
            Historial de artículos que has ofrecido vender a la tienda
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => setFiltro('todas')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              filtro === 'todas'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Todas ({ventas.length})
          </button>
          <button
            onClick={() => setFiltro('pendientes')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              filtro === 'pendientes'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            En Espera ({ventas.filter(v => v.idEstado === 13).length})
          </button>
          <button
            onClick={() => setFiltro('aprobadas')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              filtro === 'aprobadas'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Compradas ({ventas.filter(v => v.idEstado === 14).length})
          </button>
          <button
            onClick={() => setFiltro('rechazadas')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              filtro === 'rechazadas'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Rechazadas ({ventas.filter(v => v.idEstado === 15).length})
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="text-center py-12">
            <Loader className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Cargando tus solicitudes...</p>
          </div>
        ) : ventasFiltradas.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {filtro === 'todas' ? 'No tienes solicitudes de venta' : `No tienes solicitudes ${filtro}`}
            </h3>
            <p className="text-gray-500">
              {filtro === 'todas'
                ? 'Ofrece tus artículos para venta y aparecerán aquí'
                : 'Prueba con otro filtro para ver más resultados'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ventasFiltradas.map(venta => {
              const estadoInfo = getEstadoInfo(venta.idEstado);
              return (
                <div
                  key={venta.idCompra}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-purple-200"
                >
                  {/* Header del card con estado */}
                  <div className={`${estadoInfo.bg} ${estadoInfo.border} border-b-2 p-4`}>
                    <div className="flex items-center justify-between">
                      <span className={`flex items-center gap-2 ${estadoInfo.color} font-semibold`}>
                        {estadoInfo.icon}
                        {estadoInfo.nombre}
                      </span>
                      <span className="text-sm text-gray-600">
                        #{venta.idCompra}
                      </span>
                    </div>
                  </div>

                  {/* Carrusel de imágenes del artículo */}
                  {(() => {
                    const imagenesValidas = obtenerImagenesValidas(venta);
                    const indexActual = imagenesActuales[venta.idCompra] || 0;

                    if (imagenesValidas.length > 0) {
                      return (
                        <div className="relative h-48 bg-gray-100">
                          <img
                            src={`http://localhost:8080${imagenesValidas[indexActual]}`}
                            alt={venta.nombreArticulo}
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
                      );
                    } else {
                      return (
                        <div className="h-48 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                          <ShoppingBag className="w-16 h-16 text-gray-400" />
                        </div>
                      );
                    }
                  })()}

                  {/* Contenido */}
                  <div className="p-6">
                    {/* Nombre del artículo */}
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {venta.nombreArticulo}
                    </h3>

                    {/* Descripción del artículo */}
                    {venta.descripcionArticulo && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {venta.descripcionArticulo}
                      </p>
                    )}

                    {/* Precio ofrecido por el cliente */}
                    {venta.precioOfrecido && (
                      <div className="bg-blue-50 rounded-lg p-2 mb-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Precio solicitado:</span>
                          <span className="text-sm font-semibold text-blue-600">
                            Q{parseFloat(venta.precioOfrecido).toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Fecha de solicitud */}
                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        Solicitado: {formatearFecha(venta.fechaCreacion)}
                      </span>
                    </div>

                    {/* Precio aprobado (si fue comprada) */}
                    {venta.idEstado === 14 && venta.precioCompra && (
                      <div className="bg-green-50 rounded-lg p-3 mb-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Precio aprobado:</span>
                          <span className="text-lg font-bold text-green-600">
                            Q{parseFloat(venta.precioCompra).toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        {venta.fechaCompra && (
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                            <Calendar className="w-3 h-3" />
                            {formatearFecha(venta.fechaCompra)}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Mensaje del administrador */}
                    {venta.mensaje && (
                      <div className={`${estadoInfo.bg} rounded-lg p-3 mb-3`}>
                        <div className="flex items-start gap-2">
                          <MessageSquare className={`w-4 h-4 ${estadoInfo.color} mt-1 flex-shrink-0`} />
                          <p className={`text-sm ${estadoInfo.color}`}>
                            {venta.mensaje}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Administrador */}
                    {venta.nombreAdmin && (
                      <div className="text-xs text-gray-500 mt-3 pt-3 border-t">
                        Evaluado por: {venta.nombreAdmin}
                      </div>
                    )}
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

export default MisVentas;
