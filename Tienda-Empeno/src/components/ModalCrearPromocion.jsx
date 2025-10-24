import { useState, useEffect } from 'react';
import { X, Tag, Percent, DollarSign, Calendar, Package, Grid3x3, Store } from 'lucide-react';
import { adminAPI } from '../api/adminAPI';
import { tiendaAPI } from '../api/tiendaAPI';
import apiService from '../api/apiService';

const ModalCrearPromocion = ({ onClose, onSuccess, promocion }) => {
  const [formData, setFormData] = useState({
    nombrePromocion: '',
    descripcion: '',
    tipoPromocion: 'GENERAL',
    tipoDescuento: 'PORCENTAJE',
    valorDescuento: '',
    idTipoArticulo: '',
    idProductoTienda: '',
    fechaInicio: '',
    fechaFin: ''
  });

  const [tiposArticulo, setTiposArticulo] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarTiposArticulo();
    cargarProductos();

    if (promocion) {
      // Convertir fechas de ISO a datetime-local
      const fechaInicio = promocion.fechaInicio ? new Date(promocion.fechaInicio).toISOString().slice(0, 16) : '';
      const fechaFin = promocion.fechaFin ? new Date(promocion.fechaFin).toISOString().slice(0, 16) : '';

      setFormData({
        nombrePromocion: promocion.nombrePromocion || '',
        descripcion: promocion.descripcion || '',
        tipoPromocion: promocion.tipoPromocion || 'GENERAL',
        tipoDescuento: promocion.tipoDescuento || 'PORCENTAJE',
        valorDescuento: promocion.valorDescuento || '',
        idTipoArticulo: promocion.idTipoArticulo || '',
        idProductoTienda: promocion.idProductoTienda || '',
        fechaInicio,
        fechaFin
      });
    }
  }, [promocion]);

  const cargarTiposArticulo = async () => {
    try {
      const response = await apiService.getPublic('/articulos/tipos-activos');
      setTiposArticulo(response);
    } catch (err) {
      console.error('Error al cargar tipos de artículo:', err);
    }
  };

  const cargarProductos = async () => {
    try {
      const response = await tiendaAPI.listarCatalogo();
      setProductos(response);
    } catch (err) {
      console.error('Error al cargar productos:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Limpiar campos condicionales
      ...(name === 'tipoPromocion' && value === 'GENERAL' && { idTipoArticulo: '', idProductoTienda: '' }),
      ...(name === 'tipoPromocion' && value === 'CATEGORIA' && { idProductoTienda: '' }),
      ...(name === 'tipoPromocion' && value === 'PRODUCTO' && { idTipoArticulo: '' })
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!formData.nombrePromocion.trim()) {
      setError('El nombre de la promoción es requerido');
      return;
    }

    if (!formData.valorDescuento || parseFloat(formData.valorDescuento) <= 0) {
      setError('El valor del descuento debe ser mayor a 0');
      return;
    }

    if (formData.tipoDescuento === 'PORCENTAJE' && parseFloat(formData.valorDescuento) > 100) {
      setError('El porcentaje no puede ser mayor a 100%');
      return;
    }

    if (formData.tipoPromocion === 'CATEGORIA' && !formData.idTipoArticulo) {
      setError('Debes seleccionar una categoría');
      return;
    }

    if (formData.tipoPromocion === 'PRODUCTO' && !formData.idProductoTienda) {
      setError('Debes seleccionar un producto');
      return;
    }

    if (!formData.fechaInicio || !formData.fechaFin) {
      setError('Las fechas de inicio y fin son requeridas');
      return;
    }

    if (new Date(formData.fechaInicio) >= new Date(formData.fechaFin)) {
      setError('La fecha de inicio debe ser anterior a la fecha de fin');
      return;
    }

    try {
      setLoading(true);

      // Preparar datos para enviar
      const dataToSend = {
        nombrePromocion: formData.nombrePromocion,
        descripcion: formData.descripcion,
        tipoPromocion: formData.tipoPromocion,
        tipoDescuento: formData.tipoDescuento,
        valorDescuento: parseFloat(formData.valorDescuento),
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin
      };

      // Agregar campos condicionales
      if (formData.tipoPromocion === 'CATEGORIA') {
        dataToSend.idTipoArticulo = parseInt(formData.idTipoArticulo);
      } else if (formData.tipoPromocion === 'PRODUCTO') {
        dataToSend.idProductoTienda = parseInt(formData.idProductoTienda);
      }

      if (promocion) {
        await adminAPI.actualizarPromocion(promocion.idPromocion, dataToSend);
      } else {
        await adminAPI.crearPromocion(dataToSend);
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Error al guardar promoción:', err);
      setError(err.response?.data?.error || 'Error al guardar la promoción');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center">
              <Tag className="w-6 h-6 mr-2" />
              {promocion ? 'Editar Promoción' : 'Crear Nueva Promoción'}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Nombre */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nombre de la Promoción *
            </label>
            <input
              type="text"
              name="nombrePromocion"
              value={formData.nombrePromocion}
              onChange={handleChange}
              placeholder="Ej: Black Friday - Joyería"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Describe la promoción..."
              rows="3"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none resize-none"
            />
          </div>

          {/* Tipo de Promoción */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tipo de Promoción *
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleChange({ target: { name: 'tipoPromocion', value: 'GENERAL' } })}
                className={`p-4 border-2 rounded-xl transition-all ${
                  formData.tipoPromocion === 'GENERAL'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 hover:border-emerald-300'
                }`}
              >
                <Store className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-semibold">General</span>
              </button>

              <button
                type="button"
                onClick={() => handleChange({ target: { name: 'tipoPromocion', value: 'CATEGORIA' } })}
                className={`p-4 border-2 rounded-xl transition-all ${
                  formData.tipoPromocion === 'CATEGORIA'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 hover:border-emerald-300'
                }`}
              >
                <Grid3x3 className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-semibold">Categoría</span>
              </button>

              <button
                type="button"
                onClick={() => handleChange({ target: { name: 'tipoPromocion', value: 'PRODUCTO' } })}
                className={`p-4 border-2 rounded-xl transition-all ${
                  formData.tipoPromocion === 'PRODUCTO'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 hover:border-emerald-300'
                }`}
              >
                <Package className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-semibold">Producto</span>
              </button>
            </div>
          </div>

          {/* Categoría (solo si tipoPromocion === 'CATEGORIA') */}
          {formData.tipoPromocion === 'CATEGORIA' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Categoría *
              </label>
              <select
                name="idTipoArticulo"
                value={formData.idTipoArticulo}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                required
              >
                <option value="">Selecciona una categoría</option>
                {tiposArticulo.map(tipo => (
                  <option key={tipo.idTipoArticulo} value={tipo.idTipoArticulo}>
                    {tipo.nombreTipoArticulo}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Producto (solo si tipoPromocion === 'PRODUCTO') */}
          {formData.tipoPromocion === 'PRODUCTO' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Producto *
              </label>
              <select
                name="idProductoTienda"
                value={formData.idProductoTienda}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                required
              >
                <option value="">Selecciona un producto</option>
                {productos.map(producto => (
                  <option key={producto.idProductoTienda} value={producto.idProductoTienda}>
                    {producto.nombreProducto}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Tipo de Descuento */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tipo de Descuento *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleChange({ target: { name: 'tipoDescuento', value: 'PORCENTAJE' } })}
                className={`p-4 border-2 rounded-xl transition-all ${
                  formData.tipoDescuento === 'PORCENTAJE'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 hover:border-emerald-300'
                }`}
              >
                <Percent className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-semibold">Porcentaje</span>
              </button>

              <button
                type="button"
                onClick={() => handleChange({ target: { name: 'tipoDescuento', value: 'MONTO_FIJO' } })}
                className={`p-4 border-2 rounded-xl transition-all ${
                  formData.tipoDescuento === 'MONTO_FIJO'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 hover:border-emerald-300'
                }`}
              >
                <DollarSign className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-semibold">Monto Fijo</span>
              </button>
            </div>
          </div>

          {/* Valor del Descuento */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Valor del Descuento *
            </label>
            <div className="relative">
              {formData.tipoDescuento === 'MONTO_FIJO' && (
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">Q</span>
              )}
              {formData.tipoDescuento === 'PORCENTAJE' && (
                <Percent className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              )}
              <input
                type="number"
                name="valorDescuento"
                value={formData.valorDescuento}
                onChange={handleChange}
                placeholder={formData.tipoDescuento === 'PORCENTAJE' ? '15' : '200.00'}
                step="0.01"
                min="0"
                className={`w-full ${formData.tipoDescuento === 'MONTO_FIJO' ? 'pl-8' : 'pl-4'} pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none`}
                required
              />
            </div>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Fecha de Inicio *
              </label>
              <input
                type="datetime-local"
                name="fechaInicio"
                value={formData.fechaInicio}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Fecha de Fin *
              </label>
              <input
                type="datetime-local"
                name="fechaFin"
                value={formData.fechaFin}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                required
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
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
              className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : promocion ? 'Actualizar' : 'Crear Promoción'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCrearPromocion;
