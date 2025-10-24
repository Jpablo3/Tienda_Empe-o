import { useState } from 'react';
import { X, Star } from 'lucide-react';
import { tiendaAPI } from '../api/tiendaAPI';

const ModalValorarProducto = ({ isOpen, onClose, producto, onValoracionExitosa }) => {
  const [calificacion, setCalificacion] = useState(0);
  const [hoverCalificacion, setHoverCalificacion] = useState(0);
  const [comentario, setComentario] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (calificacion === 0) {
      setError('Por favor selecciona una calificación');
      return;
    }

    if (comentario.trim().length < 10) {
      setError('El comentario debe tener al menos 10 caracteres');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await tiendaAPI.valorarProducto({
        idProductoTienda: producto.idProductoTienda,
        calificacion: calificacion,
        comentario: comentario.trim()
      });

      // Limpiar formulario
      setCalificacion(0);
      setComentario('');

      // Notificar éxito
      if (onValoracionExitosa) {
        onValoracionExitosa();
      }

      onClose();
    } catch (err) {
      console.error('Error al valorar producto:', err);
      setError(err.response?.data?.error || 'Error al enviar la valoración');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCalificacion(0);
    setHoverCalificacion(0);
    setComentario('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Valorar Producto
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Información del Producto */}
          <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="font-semibold text-gray-800">{producto?.nombreProducto}</p>
            {producto?.descripcion && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{producto.descripcion}</p>
            )}
          </div>

          {/* Calificación */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Calificación *
            </label>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setCalificacion(star)}
                  onMouseEnter={() => setHoverCalificacion(star)}
                  onMouseLeave={() => setHoverCalificacion(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-10 w-10 ${
                      star <= (hoverCalificacion || calificacion)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {calificacion > 0 && (
              <p className="text-center mt-2 text-sm text-gray-600">
                {calificacion === 1 && 'Muy malo'}
                {calificacion === 2 && 'Malo'}
                {calificacion === 3 && 'Regular'}
                {calificacion === 4 && 'Bueno'}
                {calificacion === 5 && 'Excelente'}
              </p>
            )}
          </div>

          {/* Comentario */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Comentario *
            </label>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Cuéntanos sobre tu experiencia con este producto..."
              rows={5}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none resize-none"
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-500">Mínimo 10 caracteres</p>
              <p className="text-xs text-gray-500">{comentario.length}/500</p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Enviando...' : 'Enviar Valoración'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalValorarProducto;
