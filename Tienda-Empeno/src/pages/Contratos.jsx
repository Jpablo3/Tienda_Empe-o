import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Calendar, DollarSign, Percent, Clock, ArrowRight, Loader } from 'lucide-react';
import Header from '../components/Header';
import { contratosAPI } from '../api/contratosAPI';

const Contratos = () => {
  const navigate = useNavigate();
  const [contratos, setContratos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarContratos();
  }, []);

  const cargarContratos = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await contratosAPI.listarContratosPendientes();
      setContratos(Array.isArray(response) ? response : response.data || []);
    } catch (error) {
      console.error('Error al cargar contratos:', error);
      setError('Error al cargar los contratos pendientes');
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
        {/* Header de la página */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full mb-4">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Contratos Pendientes
          </h1>
          <p className="text-gray-600">
            Revisa y firma los contratos de tus préstamos aprobados
          </p>
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="text-center py-12">
            <Loader className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Cargando contratos...</p>
          </div>
        ) : contratos.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No tienes contratos pendientes
            </h3>
            <p className="text-gray-500 mb-6">
              Cuando un préstamo sea aprobado, aparecerá aquí para que lo firmes
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Volver al Inicio
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contratos.map((contrato) => (
              <div
                key={contrato.idContrato}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-purple-100 hover:border-purple-300"
              >
                {/* Badge de estado */}
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-2">
                  <p className="text-white text-sm font-bold text-center">
                    ⏳ Pendiente de Firma
                  </p>
                </div>

                {/* Contenido */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {contrato.nombreArticulo}
                  </h3>

                  {/* Información del préstamo */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-sm">Monto:</span>
                      </div>
                      <span className="font-bold text-green-600 text-lg">
                        Q{parseFloat(contrato.montoPrestamo).toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Percent className="w-4 h-4" />
                        <span className="text-sm">Tasa:</span>
                      </div>
                      <span className="font-semibold text-gray-800">
                        {parseFloat(contrato.tasaInteres).toFixed(1)}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">Plazo:</span>
                      </div>
                      <span className="font-semibold text-gray-800">
                        {contrato.plazoMeses} {contrato.plazoMeses === 1 ? 'mes' : 'meses'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">Vencimiento:</span>
                      </div>
                      <span className="font-semibold text-gray-800 text-sm">
                        {formatearFecha(contrato.fechaVencimiento)}
                      </span>
                    </div>
                  </div>

                  {/* Información adicional */}
                  <div className="bg-purple-50 rounded-xl p-4 mb-4">
                    <p className="text-xs text-purple-800">
                      <strong>Saldo Total:</strong> Q{parseFloat(contrato.saldoAdeudado).toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-purple-600 mt-1">
                      Creado el {formatearFecha(contrato.fechaCreacion)}
                    </p>
                  </div>

                  {/* Botón de acción */}
                  <button
                    onClick={() => navigate(`/contratos/${contrato.idContrato}`)}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                  >
                    <FileText className="w-5 h-5" />
                    <span>Ver y Firmar Contrato</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Contratos;
