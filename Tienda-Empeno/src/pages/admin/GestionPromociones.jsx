import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Tag, Calendar, Percent, DollarSign, Edit2, Trash2, Power, PowerOff } from 'lucide-react';
import HeaderAdmin from '../../components/HeaderAdmin';
import ModalCrearPromocion from '../../components/ModalCrearPromocion';
import { adminAPI } from '../../api/adminAPI';

const GestionPromociones = () => {
  const navigate = useNavigate();
  const [promociones, setPromociones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [promocionSeleccionada, setPromocionSeleccionada] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    cargarPromociones();
  }, []);

  const cargarPromociones = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await adminAPI.listarTodasPromociones();
      setPromociones(data);
    } catch (err) {
      console.error('Error al cargar promociones:', err);
      setError(err.response?.data?.error || 'Error al cargar promociones');
    } finally {
      setLoading(false);
    }
  };

  const handleCrearClick = () => {
    setPromocionSeleccionada(null);
    setShowModal(true);
  };

  const handleEditarClick = (promocion) => {
    setPromocionSeleccionada(promocion);
    setShowModal(true);
  };

  const handleDesactivar = async (idPromocion) => {
    if (!confirm('¿Estás seguro de desactivar esta promoción?')) return;

    try {
      await adminAPI.desactivarPromocion(idPromocion);
      setSuccessMessage('Promoción desactivada exitosamente');
      setTimeout(() => setSuccessMessage(''), 5000);
      cargarPromociones();
    } catch (err) {
      console.error('Error al desactivar promoción:', err);
      setError(err.response?.data?.error || 'Error al desactivar promoción');
    }
  };

  const handleEliminar = async (idPromocion) => {
    if (!confirm('¿Estás seguro de eliminar esta promoción? Esta acción no se puede deshacer.')) return;

    try {
      await adminAPI.eliminarPromocion(idPromocion);
      setSuccessMessage('Promoción eliminada exitosamente');
      setTimeout(() => setSuccessMessage(''), 5000);
      cargarPromociones();
    } catch (err) {
      console.error('Error al eliminar promoción:', err);
      setError(err.response?.data?.error || 'Error al eliminar promoción');
    }
  };

  const handlePromocionGuardada = () => {
    setShowModal(false);
    setPromocionSeleccionada(null);
    setSuccessMessage(promocionSeleccionada ? 'Promoción actualizada exitosamente' : 'Promoción creada exitosamente');
    setTimeout(() => setSuccessMessage(''), 5000);
    cargarPromociones();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ'
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-GT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTipoPromocionBadge = (tipo) => {
    const badges = {
      GENERAL: { color: 'bg-purple-100 text-purple-700', text: 'General - Toda la Tienda' },
      CATEGORIA: { color: 'bg-blue-100 text-blue-700', text: 'Por Categoría' },
      PRODUCTO: { color: 'bg-emerald-100 text-emerald-700', text: 'Producto Específico' }
    };
    return badges[tipo] || badges.GENERAL;
  };

  const getEstadoBadge = (promocion) => {
    const ahora = new Date();
    const inicio = new Date(promocion.fechaInicio);
    const fin = new Date(promocion.fechaFin);

    if (!promocion.activo) {
      return { color: 'bg-gray-100 text-gray-700', text: 'Inactiva', icon: PowerOff };
    }

    if (ahora < inicio) {
      return { color: 'bg-yellow-100 text-yellow-700', text: 'Programada', icon: Calendar };
    }

    if (ahora > fin) {
      return { color: 'bg-red-100 text-red-700', text: 'Expirada', icon: Calendar };
    }

    return { color: 'bg-emerald-100 text-emerald-700', text: 'Activa', icon: Power };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
        <HeaderAdmin />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Cargando promociones...</p>
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

          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                Gestión de Promociones
              </h1>
              <p className="text-gray-600">
                Crea y administra promociones para la tienda
              </p>
            </div>
            <button
              onClick={handleCrearClick}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nueva Promoción
            </button>
          </div>
        </div>

        {/* Mensajes */}
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

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Lista de Promociones */}
        {promociones.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Tag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No hay promociones creadas
            </h3>
            <p className="text-gray-600 mb-6">
              Comienza creando tu primera promoción para atraer más clientes
            </p>
            <button
              onClick={handleCrearClick}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Crear Primera Promoción
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {promociones.map((promocion) => {
              const tipoBadge = getTipoPromocionBadge(promocion.tipoPromocion);
              const estadoBadge = getEstadoBadge(promocion);
              const IconoEstado = estadoBadge.icon;

              return (
                <div
                  key={promocion.idPromocion}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Header con estado */}
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold">{promocion.nombrePromocion}</h3>
                      <div className={`${estadoBadge.color} px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1`}>
                        <IconoEstado className="w-3 h-3" />
                        {estadoBadge.text}
                      </div>
                    </div>
                    {promocion.descripcion && (
                      <p className="text-sm text-emerald-50">{promocion.descripcion}</p>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-6 space-y-4">
                    {/* Tipo de promoción */}
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-gray-500" />
                      <span className={`${tipoBadge.color} px-3 py-1 rounded-full text-xs font-semibold`}>
                        {tipoBadge.text}
                      </span>
                    </div>

                    {/* Descuento */}
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-xl">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Descuento:</span>
                        <div className="flex items-center gap-2">
                          {promocion.tipoDescuento === 'PORCENTAJE' ? (
                            <>
                              <Percent className="w-5 h-5 text-emerald-600" />
                              <span className="text-2xl font-bold text-emerald-600">
                                {promocion.valorDescuento}%
                              </span>
                            </>
                          ) : (
                            <>
                              <DollarSign className="w-5 h-5 text-emerald-600" />
                              <span className="text-2xl font-bold text-emerald-600">
                                {formatCurrency(promocion.valorDescuento)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Fechas */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                          <Calendar className="w-3 h-3" />
                          Inicio
                        </div>
                        <p className="text-sm font-medium text-gray-800">
                          {formatDate(promocion.fechaInicio)}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                          <Calendar className="w-3 h-3" />
                          Fin
                        </div>
                        <p className="text-sm font-medium text-gray-800">
                          {formatDate(promocion.fechaFin)}
                        </p>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex gap-2 pt-4 border-t">
                      <button
                        onClick={() => handleEditarClick(promocion)}
                        className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-semibold hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Editar
                      </button>
                      {promocion.activo && (
                        <button
                          onClick={() => handleDesactivar(promocion.idPromocion)}
                          className="flex-1 px-4 py-2 bg-yellow-50 text-yellow-600 rounded-lg font-semibold hover:bg-yellow-100 transition-colors flex items-center justify-center gap-2"
                        >
                          <PowerOff className="w-4 h-4" />
                          Desactivar
                        </button>
                      )}
                      <button
                        onClick={() => handleEliminar(promocion.idPromocion)}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <ModalCrearPromocion
          onClose={() => {
            setShowModal(false);
            setPromocionSeleccionada(null);
          }}
          onSuccess={handlePromocionGuardada}
          promocion={promocionSeleccionada}
        />
      )}
    </div>
  );
};

export default GestionPromociones;
