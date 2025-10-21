import { useState, useEffect } from 'react';
import { X, Check, XCircle, Loader } from 'lucide-react';
import { adminAPI } from '../api/adminAPI';

const ModalEvaluarCompra = ({ articulo, onClose, onSuccess }) => {
  const [compraId, setCompraId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingCompra, setLoadingCompra] = useState(true);
  const [error, setError] = useState('');

  // Datos para evaluación
  const [evaluacionData, setEvaluacionData] = useState({
    precioCompra: articulo.precioArticulo.toString(),
    mensaje: ''
  });

  // Obtener la compra existente al montar el componente
  useEffect(() => {
    obtenerCompraExistente();
  }, []);

  // Buscar la compra existente para este artículo
  const obtenerCompraExistente = async () => {
    try {
      setLoadingCompra(true);
      setError('');

      // Obtener todas las compras y buscar la de este artículo
      const response = await adminAPI.listarTodasLasCompras();
      const compras = Array.isArray(response) ? response : response.data || [];

      // Buscar la compra de este artículo que esté en estado "En Espera" (13)
      const compraExistente = compras.find(
        c => c.idArticulo === articulo.idArticulo && c.idEstado === 13
      );

      if (compraExistente) {
        setCompraId(compraExistente.idCompra);
      } else {
        setError('No se encontró una solicitud de compra para este artículo');
      }
    } catch (error) {
      console.error('Error al obtener compra:', error);
      setError('Error al cargar la información de la compra');
    } finally {
      setLoadingCompra(false);
    }
  };

  // Aprobar compra (Comprado)
  const handleAprobar = async () => {
    try {
      setLoading(true);
      setError('');

      // Validaciones
      if (!evaluacionData.precioCompra || parseFloat(evaluacionData.precioCompra) <= 0) {
        setError('Por favor ingresa un precio de compra válido');
        setLoading(false);
        return;
      }

      const evaluacion = {
        idEstado: 14, // Comprado
        precioCompra: parseFloat(evaluacionData.precioCompra),
        mensaje: evaluacionData.mensaje || `Hemos aceptado la compra de tu artículo "${articulo.nombreArticulo}" por Q${parseFloat(evaluacionData.precioCompra).toFixed(2)}. Puedes pasar a recoger tu pago.`
      };

      await adminAPI.evaluarCompra(compraId, evaluacion);

      onSuccess('Compra aprobada exitosamente');
      onClose();
    } catch (error) {
      console.error('Error al aprobar compra:', error);
      setError(error.response?.data?.error || error.response?.data?.message || 'Error al aprobar la compra');
    } finally {
      setLoading(false);
    }
  };

  // Rechazar compra (No Aceptado)
  const handleRechazar = async () => {
    if (!confirm('¿Estás seguro de rechazar esta compra?')) return;

    try {
      setLoading(true);
      setError('');

      const evaluacion = {
        idEstado: 15, // No Aceptado
        mensaje: evaluacionData.mensaje || `Lamentamos informarte que no podemos aceptar la compra de tu artículo "${articulo.nombreArticulo}" en este momento.`
      };

      await adminAPI.evaluarCompra(compraId, evaluacion);

      onSuccess('Compra rechazada');
      onClose();
    } catch (error) {
      console.error('Error al rechazar compra:', error);
      setError(error.response?.data?.error || error.response?.data?.message || 'Error al rechazar la compra');
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
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Evaluar Compra
            </h2>
            <p className="text-blue-100 text-sm mt-1">
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

          {/* Loading inicial */}
          {loadingCompra ? (
            <div className="text-center py-12">
              <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Cargando información de la compra...</p>
            </div>
          ) : !compraId ? (
            <div className="text-center py-8">
              <p className="text-red-600 font-medium">No se puede evaluar este artículo</p>
            </div>
          ) : (
            <>
              {/* Información del Artículo */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Información del Artículo</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Cliente:</span>
                    <p className="font-medium text-gray-800">{articulo.nombreCliente}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <p className="font-medium text-gray-800 text-xs">{articulo.emailCliente}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Tipo:</span>
                    <p className="font-medium text-gray-800">{articulo.tipoArticulo}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Estado:</span>
                    <p className="font-medium text-gray-800">{articulo.estadoArticulo}/10</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-600">Precio Solicitado:</span>
                    <p className="font-bold text-green-600 text-lg">
                      Q{parseFloat(articulo.precioArticulo).toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-600">Descripción:</span>
                    <p className="font-medium text-gray-700 text-sm mt-1">{articulo.descripcion}</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <p className="text-blue-800 font-medium text-sm">
                  ✓ Solicitud de compra encontrada (ID: {compraId})
                </p>
              </div>

              {/* Formulario de Evaluación */}
              <div className="space-y-4 mb-6">
                <h3 className="font-semibold text-gray-800">Evaluación de la Compra</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio de Compra (GTQ) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg font-bold">Q</span>
                    <input
                      type="number"
                      name="precioCompra"
                      value={evaluacionData.precioCompra}
                      onChange={handleChange}
                      step="0.01"
                      placeholder="0.00"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Precio sugerido por el cliente: Q{parseFloat(articulo.precioArticulo).toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje para el Cliente (opcional)
                  </label>
                  <textarea
                    name="mensaje"
                    value={evaluacionData.mensaje}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Escribe un mensaje personalizado para el cliente..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Si se deja vacío, se enviará un mensaje automático
                  </p>
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
                      Aprobar Compra
                    </>
                  )}
                </button>
              </div>

              {/* Advertencia */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800 mt-4">
                <strong>Nota:</strong> Al aprobar, el artículo pasará a estado "En Venta" y el cliente recibirá un mensaje con el precio final.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalEvaluarCompra;
