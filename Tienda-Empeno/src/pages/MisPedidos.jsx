import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle, XCircle, Truck, Eye, ShoppingBag } from 'lucide-react';
import { tiendaAPI } from '../api/tiendaAPI';
import Header from '../components/Header';

const MisPedidos = () => {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('todos');

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    try {
      setLoading(true);
      const data = await tiendaAPI.verMisPedidos();
      setPedidos(data);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoConfig = (estado) => {
    const configs = {
      'PENDIENTE': {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        icon: Clock,
        label: 'Pendiente'
      },
      'PAGADO': {
        color: 'bg-blue-100 text-blue-800 border-blue-300',
        icon: CheckCircle,
        label: 'Pagado'
      },
      'PROCESANDO': {
        color: 'bg-purple-100 text-purple-800 border-purple-300',
        icon: Package,
        label: 'Procesando'
      },
      'EN_CAMINO': {
        color: 'bg-indigo-100 text-indigo-800 border-indigo-300',
        icon: Truck,
        label: 'En Camino'
      },
      'ENTREGADO': {
        color: 'bg-green-100 text-green-800 border-green-300',
        icon: CheckCircle,
        label: 'Entregado'
      },
      'CANCELADO': {
        color: 'bg-red-100 text-red-800 border-red-300',
        icon: XCircle,
        label: 'Cancelado'
      }
    };
    return configs[estado] || configs['PENDIENTE'];
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

  const pedidosFiltrados = filtroEstado === 'todos'
    ? pedidos
    : pedidos.filter(p => p.estadoPedido === filtroEstado);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-white flex items-center justify-center">
          <div className="text-center">
            <Package className="h-16 w-16 text-purple-600 animate-pulse mx-auto mb-4" />
            <p className="text-gray-600">Cargando pedidos...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Encabezado */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <ShoppingBag className="h-8 w-8 text-purple-600" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Mis Pedidos
              </h1>
            </div>
            <p className="text-gray-600">
              Revisa el estado de tus pedidos y su historial de entrega
            </p>
          </div>

          {/* Filtros */}
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setFiltroEstado('todos')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filtroEstado === 'todos'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              Todos ({pedidos.length})
            </button>
            {['PENDIENTE', 'PAGADO', 'PROCESANDO', 'EN_CAMINO', 'ENTREGADO', 'CANCELADO'].map(estado => {
              const count = pedidos.filter(p => p.estadoPedido === estado).length;
              if (count === 0) return null;
              const config = getEstadoConfig(estado);
              return (
                <button
                  key={estado}
                  onClick={() => setFiltroEstado(estado)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filtroEstado === estado
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {config.label} ({count})
                </button>
              );
            })}
          </div>

          {/* Lista de Pedidos */}
          {pedidosFiltrados.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <Package className="h-24 w-24 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {filtroEstado === 'todos' ? 'No tienes pedidos' : 'No hay pedidos con este estado'}
              </h3>
              <p className="text-gray-500 mb-6">
                {filtroEstado === 'todos'
                  ? 'Comienza a comprar en nuestra tienda'
                  : 'Intenta con otro filtro'}
              </p>
              {filtroEstado === 'todos' && (
                <button
                  onClick={() => navigate('/tienda')}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
                >
                  Ir a la Tienda
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {pedidosFiltrados.map((pedido) => {
                const estadoConfig = getEstadoConfig(pedido.estadoPedido);
                const IconoEstado = estadoConfig.icon;

                return (
                  <div
                    key={pedido.idPedido}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border-2 border-transparent hover:border-purple-200"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Información del Pedido */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          {/* Imagen del primer producto */}
                          {pedido.items && pedido.items.length > 0 && pedido.items[0].imagenUrl && (
                            <img
                              src={pedido.items[0].imagenUrl}
                              alt="Producto"
                              className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200"
                            />
                          )}

                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-bold text-gray-800">
                                Pedido #{pedido.idPedido}
                              </h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 flex items-center gap-1 ${estadoConfig.color}`}>
                                <IconoEstado className="h-3 w-3" />
                                {estadoConfig.label}
                              </span>
                            </div>

                            <div className="space-y-1 text-sm text-gray-600">
                              <p>
                                <span className="font-medium">Fecha:</span> {formatearFecha(pedido.fechaPedido)}
                              </p>
                              <p>
                                <span className="font-medium">Total:</span>{' '}
                                <span className="text-lg font-bold text-purple-600">
                                  {formatearPrecio(pedido.total)}
                                </span>
                              </p>
                              <p>
                                <span className="font-medium">Productos:</span> {pedido.items?.length || 0} artículo{pedido.items?.length !== 1 ? 's' : ''}
                              </p>
                              {pedido.direccionEnvio && (
                                <p>
                                  <span className="font-medium">Envío a:</span> {pedido.direccionEnvio.ciudad}, {pedido.direccionEnvio.departamento}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Botón de Ver Seguimiento */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => navigate(`/tienda/pedido/${pedido.idPedido}/seguimiento`)}
                          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
                        >
                          <Eye className="h-5 w-5" />
                          Ver Seguimiento
                        </button>
                      </div>
                    </div>

                    {/* Lista de productos (oculta, expandible si hay muchos) */}
                    {pedido.items && pedido.items.length > 1 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600 mb-2 font-medium">Productos en este pedido:</p>
                        <div className="flex flex-wrap gap-2">
                          {pedido.items.slice(0, 5).map((item, idx) => (
                            <div
                              key={idx}
                              className="text-xs bg-purple-50 text-purple-700 px-3 py-1 rounded-full border border-purple-200"
                            >
                              {item.nombreProducto}
                            </div>
                          ))}
                          {pedido.items.length > 5 && (
                            <div className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full border border-gray-300">
                              +{pedido.items.length - 5} más
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MisPedidos;
