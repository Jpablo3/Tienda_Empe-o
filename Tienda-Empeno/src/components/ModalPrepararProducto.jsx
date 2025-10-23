import { useState } from 'react';
import { X, Package, DollarSign, FileEdit, Save } from 'lucide-react';
import { adminAPI } from '../api/adminAPI';

const ModalPrepararProducto = ({ articulo, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nombreEditado: articulo.nombreArticulo,
    descripcionEditada: articulo.descripcion,
    precioVentaTienda: articulo.precioArticulo
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!formData.nombreEditado.trim()) {
      setError('El nombre del producto es requerido');
      return;
    }

    if (!formData.descripcionEditada.trim()) {
      setError('La descripción del producto es requerida');
      return;
    }

    if (!formData.precioVentaTienda || formData.precioVentaTienda <= 0) {
      setError('El precio debe ser mayor a 0');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const payload = {
        idArticulo: articulo.idArticulo,
        nombreEditado: formData.nombreEditado.trim(),
        descripcionEditada: formData.descripcionEditada.trim(),
        precioVentaTienda: parseFloat(formData.precioVentaTienda)
      };

      await adminAPI.prepararProductoParaTienda(payload);
      onSuccess();
    } catch (err) {
      console.error('Error al preparar producto:', err);
      setError(err.response?.data?.error || 'Error al preparar el producto para la tienda');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ'
    }).format(value);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 rounded-t-3xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-center text-white">
            <div className="bg-white/20 p-3 rounded-2xl mr-4">
              <Package className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Preparar Producto para Tienda</h2>
              <p className="text-emerald-100 text-sm mt-1">
                Edita la información del producto antes de publicarlo
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Mensaje de error */}
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Información original */}
          <div className="mb-6 bg-gray-50 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <FileEdit className="w-4 h-4 mr-2 text-emerald-600" />
              Información Original
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">ID Artículo:</span>
                <span className="font-medium text-gray-800">#{articulo.idArticulo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tipo:</span>
                <span className="font-medium text-gray-800">{articulo.tipoArticulo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Precio Original:</span>
                <span className="font-bold text-emerald-600">{formatCurrency(articulo.precioArticulo)}</span>
              </div>
            </div>
          </div>

          {/* Formulario de edición */}
          <div className="space-y-6">
            {/* Nombre del producto */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre del Producto *
              </label>
              <input
                type="text"
                name="nombreEditado"
                value={formData.nombreEditado}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                placeholder="Ej: MacBook Pro 2023 - Reacondicionada Grado A+"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Dale un nombre atractivo que destaque las características principales
              </p>
            </div>

            {/* Descripción del producto */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descripción del Producto *
              </label>
              <textarea
                name="descripcionEditada"
                value={formData.descripcionEditada}
                onChange={handleChange}
                rows="5"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none resize-none"
                placeholder="Describe el producto de forma detallada, incluyendo estado, características, garantía, etc."
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Incluye detalles sobre el estado, garantía y características destacadas
              </p>
            </div>

            {/* Precio de venta */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Precio de Venta en Tienda (GTQ) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600" />
                <input
                  type="number"
                  name="precioVentaTienda"
                  value={formData.precioVentaTienda}
                  onChange={handleChange}
                  step="0.01"
                  min="0.01"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                  placeholder="0.00"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Define el precio final de venta en la tienda virtual
              </p>
            </div>
          </div>

          {/* Preview del precio */}
          <div className="mt-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border-2 border-emerald-200">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Precio que verán los clientes:</span>
              <span className="text-2xl font-bold text-emerald-600">
                {formatCurrency(formData.precioVentaTienda || 0)}
              </span>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Preparando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Confirmar y Publicar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalPrepararProducto;
