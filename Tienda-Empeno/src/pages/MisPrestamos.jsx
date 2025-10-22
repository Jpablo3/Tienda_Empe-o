import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, DollarSign, Package, Loader, Clock } from 'lucide-react';
import Header from '../components/Header';
import { prestamosAPI } from '../api/prestamosAPI';

const MisPrestamos = () => {
  const navigate = useNavigate();
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imagenesActuales, setImagenesActuales] = useState({});

  useEffect(() => {
    cargarPrestamos();
  }, []);

  // Carrusel automático de imágenes (cada 5 segundos)
  useEffect(() => {
    const interval = setInterval(() => {
      setImagenesActuales(prev => {
        const nuevasImagenes = { ...prev };
        prestamos.forEach(prestamo => {
          // Obtener array de imágenes válidas
          const imagenesValidas = obtenerImagenesValidas(prestamo);
          if (imagenesValidas.length > 1) {
            const indexActual = nuevasImagenes[prestamo.idPrestamo] || 0;
            nuevasImagenes[prestamo.idPrestamo] = (indexActual + 1) % imagenesValidas.length;
          }
        });
        return nuevasImagenes;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [prestamos]);

  // Función helper para obtener imágenes válidas
  const obtenerImagenesValidas = (prestamo) => {
    const imagenes = [];

    // Intentar usar el array de imágenes del backend
    if (prestamo.imagenes && Array.isArray(prestamo.imagenes)) {
      prestamo.imagenes.forEach(img => {
        if (typeof img === 'string' && img.trim().length > 0) {
          imagenes.push(img);
        }
      });
    }

    // Si no hay imágenes en el array, usar urlImagen como fallback
    if (imagenes.length === 0 && prestamo.urlImagen && typeof prestamo.urlImagen === 'string') {
      imagenes.push(prestamo.urlImagen);
    }

    return imagenes;
  };

  const cargarPrestamos = async () => {
    try {
      setLoading(true);
      setError('');
      // Necesitarías crear este endpoint en el backend
      // Por ahora simulo que existe
      const response = await prestamosAPI.listarMisPrestamosActivos();
      setPrestamos(Array.isArray(response) ? response : response.data || []);
    } catch (error) {
      console.error('Error al cargar préstamos:', error);
      setError('Error al cargar los préstamos activos');
      if (error.response?.status === 401) {
        setTimeout(() => navigate('/login'), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-GT', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const calcularDiasRestantes = (fechaVencimiento) => {
    if (!fechaVencimiento) return 0;
    const hoy = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const diffTime = vencimiento - hoy;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getEstadoPago = (diasRestantes) => {
    if (diasRestantes < 0) {
      return { texto: 'En atraso', color: 'text-red-600', bg: 'bg-red-100', icon: '✗' };
    } else if (diasRestantes <= 7) {
      return { texto: 'Próximo a vencer', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: '⚠' };
    } else {
      return { texto: 'Al día', color: 'text-green-600', bg: 'bg-green-100', icon: '✓' };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full mb-4">
            <CreditCard className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Mis Préstamos Activos
          </h1>
          <p className="text-gray-600">
            Administra tus préstamos y realiza pagos
          </p>
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
            <p className="text-gray-600">Cargando préstamos...</p>
          </div>
        ) : prestamos.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No tienes préstamos activos
            </h3>
            <p className="text-gray-500 mb-6">
              Cuando firmes un contrato, tu préstamo aparecerá aquí
            </p>
            <button
              onClick={() => navigate('/contratos')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Ver Contratos Pendientes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prestamos.map((prestamo) => {
              const diasRestantes = calcularDiasRestantes(prestamo.fechaVencimiento);
              const estadoPago = getEstadoPago(diasRestantes);
              const cuotaMensual = prestamo.montoPrestamo * (1 + (prestamo.tasaInteres * prestamo.plazoMeses / 100)) / prestamo.plazoMeses;

              return (
                <div
                  key={prestamo.idPrestamo}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-purple-100 hover:border-purple-300"
                >
                  {/* Badge de estado */}
                  <div className={`${estadoPago.bg} px-4 py-2`}>
                    <p className={`${estadoPago.color} text-sm font-bold text-center`}>
                      {estadoPago.icon} {estadoPago.texto}
                    </p>
                  </div>

                  {/* Carrusel de imágenes del artículo */}
                  {(() => {
                    const imagenesValidas = obtenerImagenesValidas(prestamo);
                    const indexActual = imagenesActuales[prestamo.idPrestamo] || 0;

                    if (imagenesValidas.length > 0) {
                      return (
                        <div className="relative h-48 bg-gray-100">
                          <img
                            src={`http://localhost:8080${imagenesValidas[indexActual]}`}
                            alt={prestamo.nombreArticulo}
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
                          <Package className="w-16 h-16 text-gray-400" />
                        </div>
                      );
                    }
                  })()}

                  {/* Contenido */}
                  <div className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Package className="w-6 h-6 text-purple-600" />
                      <h3 className="text-lg font-bold text-gray-800">
                        {prestamo.nombreArticulo}
                      </h3>
                    </div>

                    {/* Información del préstamo */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Saldo Adeudado:</span>
                        <span className="font-bold text-red-600 text-lg">
                          Q{parseFloat(prestamo.saldoAdeudado || prestamo.montoPrestamo).toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Cuota Mensual:</span>
                        <span className="font-bold text-green-600">
                          Q{cuotaMensual.toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Vencimiento:</span>
                        <span className="font-semibold text-gray-800 text-sm">
                          {formatearFecha(prestamo.fechaVencimiento)}
                        </span>
                      </div>

                      {diasRestantes < 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                          <p className="text-xs text-red-800 text-center font-semibold">
                            ⚠ Atraso: +Q25.00 de mora
                          </p>
                        </div>
                      )}

                      {diasRestantes >= 0 && (
                        <div className="flex items-center justify-between text-xs">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">
                            {diasRestantes === 0 ? 'Vence hoy' : `${diasRestantes} días restantes`}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Botón de pago */}
                    <button
                      onClick={() => navigate(`/prestamos/${prestamo.idPrestamo}/pagar`)}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                    >
                      <DollarSign className="w-5 h-5" />
                      <span>Pagar Cuota</span>
                    </button>
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

export default MisPrestamos;
