import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle, XCircle, Truck, MapPin, CreditCard, ArrowLeft, Calendar, Phone, Home, Star } from 'lucide-react';
import { tiendaAPI } from '../api/tiendaAPI';
import Header from '../components/Header';
import ModalValorarProducto from '../components/ModalValorarProducto';

const SeguimientoPedido = () => {
  const { idPedido } = useParams();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalValorarOpen, setModalValorarOpen] = useState(false);
  const [productoAValorar, setProductoAValorar] = useState(null);

  useEffect(() => {
    cargarDetallePedido();
  }, [idPedido]);

  const cargarDetallePedido = async () => {
    try {
      setLoading(true);
      const data = await tiendaAPI.verSeguimientoPedido(idPedido);
      setPedido(data);
    } catch (error) {
      console.error('Error al cargar detalle del pedido:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleValorarProducto = (item) => {
    setProductoAValorar(item);
    setModalValorarOpen(true);
  };

  const handleVentoracionExitosa = () => {
    // Recargar datos del pedido para actualizar el estado
    cargarDetallePedido();
  };

  const getEstadoConfig = (estado) => {
    const configs = {
      'PENDIENTE': {
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        borderColor: 'border-yellow-300',
        icon: Clock,
        label: 'Pendiente',
        descripcion: 'Tu pedido está siendo procesado'
      },
      'PAGADO': {
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        borderColor: 'border-blue-300',
        icon: CheckCircle,
        label: 'Pagado',
        descripcion: 'El pago ha sido confirmado'
      },
      'PROCESANDO': {
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
        borderColor: 'border-purple-300',
        icon: Package,
        label: 'Procesando',
        descripcion: 'Estamos preparando tu pedido'
      },
      'EN_CAMINO': {
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-100',
        borderColor: 'border-indigo-300',
        icon: Truck,
        label: 'En Camino',
        descripcion: 'Tu pedido está en camino'
      },
      'ENTREGADO': {
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        borderColor: 'border-green-300',
        icon: CheckCircle,
        label: 'Entregado',
        descripcion: 'Tu pedido ha sido entregado'
      },
      'CANCELADO': {
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        borderColor: 'border-red-300',
        icon: XCircle,
        label: 'Cancelado',
        descripcion: 'El pedido ha sido cancelado'
      }
    };
    return configs[estado] || configs['PENDIENTE'];
  };

  const getEstadosProgreso = () => {
    return [
      { key: 'PENDIENTE', label: 'Pedido Realizado', icon: CheckCircle },
      { key: 'PAGADO', label: 'Pago Confirmado', icon: CreditCard },
      { key: 'PROCESANDO', label: 'Preparando Pedido', icon: Package },
      { key: 'EN_CAMINO', label: 'En Camino', icon: Truck },
      { key: 'ENTREGADO', label: 'Entregado', icon: CheckCircle }
    ];
  };

  const getIndiceEstadoActual = (estado) => {
    const estados = ['PENDIENTE', 'PAGADO', 'PROCESANDO', 'EN_CAMINO', 'ENTREGADO'];
    return estados.indexOf(estado);
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-GT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ'
    }).format(precio);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-white flex items-center justify-center">
          <div className="text-center">
            <Package className="h-16 w-16 text-purple-600 animate-pulse mx-auto mb-4" />
            <p className="text-gray-600">Cargando seguimiento...</p>
          </div>
        </div>
      </>
    );
  }

  if (!pedido) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-white flex items-center justify-center">
          <div className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Pedido no encontrado</h3>
            <button
              onClick={() => navigate('/tienda/mis-pedidos')}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
            >
              Ver Mis Pedidos
            </button>
          </div>
        </div>
      </>
    );
  }

  const estadoConfig = getEstadoConfig(pedido.estadoPedido);
  const IconoEstado = estadoConfig.icon;
  const estadosProgreso = getEstadosProgreso();
  const indiceEstadoActual = getIndiceEstadoActual(pedido.estadoPedido);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Botón Volver */}
          <button
            onClick={() => navigate('/tienda/mis-pedidos')}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-6 transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
            Volver a Mis Pedidos
          </button>

          {/* Encabezado del Pedido */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-purple-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Pedido #{pedido.idPedido}
                </h1>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{formatearFecha(pedido.fechaPedido)}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${estadoConfig.bgColor} ${estadoConfig.borderColor}`}>
                  <IconoEstado className={`h-6 w-6 ${estadoConfig.color}`} />
                  <div>
                    <p className={`font-bold ${estadoConfig.color}`}>{estadoConfig.label}</p>
                    <p className="text-xs text-gray-600">{estadoConfig.descripcion}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Barra de Progreso */}
          {pedido.estadoPedido !== 'CANCELADO' && (
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Seguimiento del Pedido</h2>
              <div className="relative">
                {/* Línea de progreso */}
                <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-500"
                    style={{ width: `${(indiceEstadoActual / (estadosProgreso.length - 1)) * 100}%` }}
                  />
                </div>

                {/* Estados */}
                <div className="relative flex justify-between">
                  {estadosProgreso.map((estado, index) => {
                    const completado = index <= indiceEstadoActual;
                    const IconoProgreso = estado.icon;

                    return (
                      <div key={estado.key} className="flex flex-col items-center">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all ${
                            completado
                              ? 'bg-gradient-to-r from-purple-600 to-blue-600 border-white shadow-lg'
                              : 'bg-gray-200 border-gray-300'
                          }`}
                        >
                          <IconoProgreso className={`h-6 w-6 ${completado ? 'text-white' : 'text-gray-400'}`} />
                        </div>
                        <p className={`mt-3 text-xs font-medium text-center max-w-[100px] ${
                          completado ? 'text-purple-600' : 'text-gray-500'
                        }`}>
                          {estado.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Información de Envío */}
            <div className="lg:col-span-2 space-y-6">
              {/* Dirección de Envío */}
              {pedido.direccionEnvio && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="h-6 w-6 text-purple-600" />
                    <h2 className="text-xl font-bold text-gray-800">Dirección de Envío</h2>
                  </div>
                  <div className="space-y-2 text-gray-700">
                    <div className="flex items-start gap-2">
                      <Home className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium">{pedido.direccionEnvio.direccion}</p>
                        <p>{pedido.direccionEnvio.ciudad}, {pedido.direccionEnvio.departamento}</p>
                        <p>Código Postal: {pedido.direccionEnvio.codigoPostal}</p>
                      </div>
                    </div>
                    {pedido.direccionEnvio.telefono && (
                      <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <p>{pedido.direccionEnvio.telefono}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Productos */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="h-6 w-6 text-purple-600" />
                  <h2 className="text-xl font-bold text-gray-800">Productos</h2>
                </div>
                <div className="space-y-4">
                  {pedido.items?.map((item, index) => (
                    <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-purple-50 transition-all">
                      {item.imagenUrl && (
                        <img
                          src={item.imagenUrl}
                          alt={item.nombreProducto}
                          className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{item.nombreProducto}</h3>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-gray-500">Cantidad: {item.cantidad || 1}</span>
                          {item.precio && !isNaN(item.precio) && (
                            <span className="font-bold text-purple-600">{formatearPrecio(item.precio)}</span>
                          )}
                        </div>
                        {/* Botón de valorar (solo si el pedido está entregado) */}
                        {pedido.idEstado === 24 && (
                          <button
                            onClick={() => handleValorarProducto(item)}
                            className="mt-3 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all text-sm"
                          >
                            <Star className="h-4 w-4" />
                            Valorar Producto
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Resumen del Pedido */}
            <div className="space-y-6">
              {/* Información de Pago */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="h-6 w-6 text-purple-600" />
                  <h2 className="text-xl font-bold text-gray-800">Pago</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-700">
                    <span>Método de Pago:</span>
                    <span className="font-medium">{pedido.metodoPago || 'Tarjeta de Crédito'}</span>
                  </div>
                  {pedido.ultimosDigitosTarjeta && (
                    <div className="flex justify-between text-gray-700">
                      <span>Tarjeta:</span>
                      <span className="font-medium">**** {pedido.ultimosDigitosTarjeta}</span>
                    </div>
                  )}
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between text-gray-700 mb-2">
                      <span>Subtotal:</span>
                      <span>{formatearPrecio(pedido.subtotal || pedido.total)}</span>
                    </div>
                    {pedido.costoEnvio && (
                      <div className="flex justify-between text-gray-700 mb-2">
                        <span>Envío:</span>
                        <span>{formatearPrecio(pedido.costoEnvio)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg text-gray-800 pt-2 border-t border-gray-200">
                      <span>Total:</span>
                      <span className="text-purple-600">{formatearPrecio(pedido.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Valoración */}
      <ModalValorarProducto
        isOpen={modalValorarOpen}
        onClose={() => setModalValorarOpen(false)}
        producto={productoAValorar}
        onValoracionExitosa={handleVentoracionExitosa}
      />
    </>
  );
};

export default SeguimientoPedido;
