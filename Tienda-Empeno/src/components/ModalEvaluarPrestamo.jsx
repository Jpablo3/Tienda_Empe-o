import { useState } from 'react';
import { X, Check, XCircle, Loader } from 'lucide-react';
import { prestamosAPI } from '../api/prestamosAPI';

const ModalEvaluarPrestamo = ({ articulo, onClose, onSuccess }) => {
  const [step, setStep] = useState(1); // 1: Crear préstamo, 2: Evaluar (aprobar/rechazar)
  const [prestamoId, setPrestamoId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Datos para evaluación (solo cuando se aprueba)
  const [evaluacionData, setEvaluacionData] = useState({
    montoPrestamo: '',
    tasaInteres: '10',
    porcentajeAvaluo: '70',
    plazoMeses: '3'
  });

  // Paso 1: Crear el préstamo
  const handleCrearPrestamo = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await prestamosAPI.crearPrestamo({
        idArticulo: articulo.idArticulo
      });

      console.log('Préstamo creado:', response);

      // El backend devuelve el préstamo con su ID
      const prestamoCreado = response.data || response;
      setPrestamoId(prestamoCreado.idPrestamo);

      // Calcular monto sugerido (70% del avalúo)
      const montoSugerido = (parseFloat(articulo.precioAvaluo) * 0.7).toFixed(2);
      setEvaluacionData(prev => ({
        ...prev,
        montoPrestamo: montoSugerido
      }));

      setStep(2); // Pasar al paso de evaluación
    } catch (error) {
      console.error('Error al crear préstamo:', error);
      setError(error.response?.data?.message || 'Error al crear el préstamo');
    } finally {
      setLoading(false);
    }
  };

  // Paso 2: Aprobar préstamo
  const handleAprobar = async () => {
    try {
      setLoading(true);
      setError('');

      // Validaciones
      if (!evaluacionData.montoPrestamo || parseFloat(evaluacionData.montoPrestamo) <= 0) {
        setError('Por favor ingresa un monto de préstamo válido');
        setLoading(false);
        return;
      }

      const evaluacion = {
        idEstado: 3, // Aprobado
        montoPrestamo: parseFloat(evaluacionData.montoPrestamo),
        tasaInteres: parseFloat(evaluacionData.tasaInteres),
        porcentajeAvaluo: parseFloat(evaluacionData.porcentajeAvaluo),
        plazoMeses: parseInt(evaluacionData.plazoMeses)
      };

      await prestamosAPI.evaluarPrestamo(prestamoId, evaluacion);

      onSuccess('Préstamo aprobado exitosamente');
      onClose();
    } catch (error) {
      console.error('Error al aprobar préstamo:', error);
      setError(error.response?.data?.message || 'Error al aprobar el préstamo');
    } finally {
      setLoading(false);
    }
  };

  // Paso 2: Rechazar préstamo
  const handleRechazar = async () => {
    if (!confirm('¿Estás seguro de rechazar este préstamo?')) return;

    try {
      setLoading(true);
      setError('');

      const evaluacion = {
        idEstado: 4 // Rechazado
      };

      await prestamosAPI.evaluarPrestamo(prestamoId, evaluacion);

      onSuccess('Préstamo rechazado');
      onClose();
    } catch (error) {
      console.error('Error al rechazar préstamo:', error);
      setError(error.response?.data?.message || 'Error al rechazar el préstamo');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvaluacionData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {step === 1 ? 'Crear Préstamo' : 'Evaluar Préstamo'}
            </h2>
            <p className="text-purple-100 text-sm mt-1">
              {articulo.nombreArticulo}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {/* Mensaje de Error */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Información del Artículo */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Información del Artículo</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Cliente:</span>
                <p className="font-medium text-gray-800">{articulo.nombreCliente}</p>
              </div>
              <div>
                <span className="text-gray-600">Tipo:</span>
                <p className="font-medium text-gray-800">{articulo.tipoArticulo}</p>
              </div>
              <div>
                <span className="text-gray-600">Precio Solicitado:</span>
                <p className="font-bold text-blue-600">
                  Q{parseFloat(articulo.precioArticulo).toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Avalúo del Sistema:</span>
                <p className="font-bold text-green-600">
                  Q{parseFloat(articulo.precioAvaluo).toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Estado:</span>
                <p className="font-medium text-gray-800">{articulo.estadoArticulo}/10</p>
              </div>
            </div>
          </div>

          {/* Paso 1: Crear Préstamo */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-gray-600">
                Al hacer clic en "Iniciar Evaluación", se creará un registro de préstamo para este artículo.
                Luego podrás aprobarlo o rechazarlo.
              </p>

              <button
                onClick={handleCrearPrestamo}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Creando préstamo...
                  </>
                ) : (
                  'Iniciar Evaluación'
                )}
              </button>
            </div>
          )}

          {/* Paso 2: Evaluar (Aprobar/Rechazar) */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-green-800 font-medium">
                  ✓ Préstamo creado exitosamente (ID: {prestamoId})
                </p>
              </div>

              {/* Formulario de Aprobación */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">Datos del Préstamo</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monto del Préstamo (GTQ)
                  </label>
                  <input
                    type="number"
                    name="montoPrestamo"
                    value={evaluacionData.montoPrestamo}
                    onChange={handleChange}
                    step="0.01"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Sugerencia: 70% del avalúo = Q{(parseFloat(articulo.precioAvaluo) * 0.7).toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tasa de Interés (%)
                    </label>
                    <input
                      type="number"
                      name="tasaInteres"
                      value={evaluacionData.tasaInteres}
                      onChange={handleChange}
                      step="0.1"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Plazo (meses)
                    </label>
                    <select
                      name="plazoMeses"
                      value={evaluacionData.plazoMeses}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="1">1 mes</option>
                      <option value="3">3 meses</option>
                      <option value="6">6 meses</option>
                      <option value="12">12 meses</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Porcentaje Avalúo (%)
                  </label>
                  <input
                    type="number"
                    name="porcentajeAvaluo"
                    value={evaluacionData.porcentajeAvaluo}
                    onChange={handleChange}
                    step="1"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <button
                  onClick={handleRechazar}
                  disabled={loading}
                  className="bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <XCircle className="w-5 h-5 mr-2" />
                  Rechazar
                </button>

                <button
                  onClick={handleAprobar}
                  disabled={loading}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Aprobar
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalEvaluarPrestamo;
