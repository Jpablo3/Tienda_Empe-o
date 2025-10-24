import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, MapPin, CreditCard, Check, AlertCircle, ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { tiendaAPI } from '../api/tiendaAPI';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [paso, setPaso] = useState(1); // 1: Dirección, 2: Pago, 3: Confirmación
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pedidoCreado, setPedidoCreado] = useState(null);

  // Datos de dirección
  const [direccion, setDireccion] = useState({
    direccion: '',
    ciudad: '',
    departamento: '',
    codigoPostal: '',
    telefono: ''
  });

  // Datos de pago - SOLO TARJETA
  const [metodoPago, setMetodoPago] = useState('tarjeta');
  const [datosTarjeta, setDatosTarjeta] = useState({
    numeroTarjeta: '',
    nombreTitular: '',
    fechaExpiracion: '',
    cvv: ''
  });

  // Cargar datos del cliente automáticamente
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      navigate('/tienda');
      return;
    }

    // Cargar datos del cliente desde localStorage o API
    const cargarDatosCliente = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail') || '';
        const userName = localStorage.getItem('userName') || '';
        const userPhone = localStorage.getItem('userPhone') || '';
        const userAddress = localStorage.getItem('userAddress') || '';
        const userCity = localStorage.getItem('userCity') || '';
        const userDepartment = localStorage.getItem('userDepartment') || '';
        const userPostalCode = localStorage.getItem('userPostalCode') || '';

        // Pre-llenar dirección si hay datos guardados
        if (userAddress || userCity || userDepartment) {
          setDireccion({
            direccion: userAddress,
            ciudad: userCity,
            departamento: userDepartment,
            codigoPostal: userPostalCode,
            telefono: userPhone
          });
        }

        // Pre-llenar nombre del titular con el nombre del usuario
        if (userName) {
          setDatosTarjeta(prev => ({ ...prev, nombreTitular: userName.toUpperCase() }));
        }
      } catch (error) {
        console.error('Error al cargar datos del cliente:', error);
      }
    };

    cargarDatosCliente();
  }, [cart, isAuthenticated, navigate]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ'
    }).format(value);
  };

  const validarDireccion = () => {
    if (!direccion.direccion.trim()) {
      setError('La dirección es requerida');
      return false;
    }
    if (!direccion.ciudad.trim()) {
      setError('La ciudad es requerida');
      return false;
    }
    if (!direccion.departamento.trim()) {
      setError('El departamento es requerido');
      return false;
    }
    if (!direccion.telefono.trim()) {
      setError('El teléfono es requerido');
      return false;
    }
    return true;
  };

  const validarPago = () => {
    if (metodoPago === 'tarjeta') {
      if (!datosTarjeta.numeroTarjeta || datosTarjeta.numeroTarjeta.replace(/\s/g, '').length !== 16) {
        setError('Número de tarjeta inválido (16 dígitos)');
        return false;
      }
      if (!datosTarjeta.nombreTitular.trim()) {
        setError('El nombre del titular es requerido');
        return false;
      }
      if (!datosTarjeta.fechaExpiracion.match(/^\d{2}\/\d{2}$/)) {
        setError('Fecha de expiración inválida (MM/AA)');
        return false;
      }
      if (!datosTarjeta.cvv || datosTarjeta.cvv.length !== 3) {
        setError('CVV inválido (3 dígitos)');
        return false;
      }
    }
    return true;
  };

  const handleSiguiente = () => {
    setError('');

    if (paso === 1) {
      if (validarDireccion()) {
        setPaso(2);
      }
    } else if (paso === 2) {
      if (validarPago()) {
        setPaso(3);
      }
    }
  };

  const handleConfirmarPedido = async () => {
    try {
      setLoading(true);
      setError('');

      // Crear items del pedido
      const items = cart.map(item => ({
        idProductoTienda: item.idProductoTienda,
        cantidad: 1
      }));

      // Crear pedido
      const pedidoData = {
        items: items,
        idDireccion: 1 // Temporal - en producción se debe registrar la dirección primero
      };

      const pedidoResponse = await tiendaAPI.crearPedido(pedidoData);
      setPedidoCreado(pedidoResponse.pedido);

      // Pagar pedido - Siempre con tarjeta (idMetodoPago = 1)
      const pagoData = {
        idPedido: pedidoResponse.pedido.idPedido,
        idDireccion: 1,
        idMetodoPago: 1, // Tarjeta de crédito/débito
        numeroTarjeta: datosTarjeta.numeroTarjeta.replace(/\s/g, ''),
        nombreTitular: datosTarjeta.nombreTitular,
        fechaExpiracion: datosTarjeta.fechaExpiracion,
        cvv: datosTarjeta.cvv
      };

      const pagoResponse = await tiendaAPI.pagarPedido(pagoData);

      // Limpiar carrito
      clearCart();

      // Redirigir a seguimiento
      setTimeout(() => {
        navigate(`/tienda/pedido/${pagoResponse.pedido.idPedido}/seguimiento`);
      }, 3000);

    } catch (err) {
      console.error('Error al procesar pedido:', err);
      setError(err.response?.data?.error || 'Error al procesar el pedido');
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value) => {
    return value
      .replace(/\s/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim();
  };

  if (cart.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Tu carrito está vacío
            </h3>
            <button
              onClick={() => navigate('/tienda')}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Ir al Catálogo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate('/tienda')}
          className="flex items-center text-gray-600 hover:text-purple-600 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver a la tienda
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Finalizar Compra
          </h1>
          <p className="text-gray-600">Completa tu pedido en 3 simples pasos</p>
        </div>

        {/* Progress bar */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: 'Dirección', icon: MapPin },
              { num: 2, label: 'Pago', icon: CreditCard },
              { num: 3, label: 'Confirmación', icon: Check }
            ].map((step, index) => (
              <div key={step.num} className="flex-1 flex items-center">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                      paso >= step.num
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    <step.icon className="w-6 h-6" />
                  </div>
                  <span className={`mt-2 text-sm font-medium ${paso >= step.num ? 'text-purple-600' : 'text-gray-500'}`}>
                    {step.label}
                  </span>
                </div>
                {index < 2 && (
                  <div className={`flex-1 h-1 mx-4 rounded ${paso > step.num ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formularios */}
          <div className="lg:col-span-2">
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {/* Paso 1: Dirección */}
            {paso === 1 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Dirección de Envío</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Dirección Completa *
                    </label>
                    <input
                      type="text"
                      value={direccion.direccion}
                      onChange={(e) => setDireccion({ ...direccion, direccion: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                      placeholder="Calle, número, colonia..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Ciudad *
                      </label>
                      <input
                        type="text"
                        value={direccion.ciudad}
                        onChange={(e) => setDireccion({ ...direccion, ciudad: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                        placeholder="Ej: Guatemala"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Departamento *
                      </label>
                      <input
                        type="text"
                        value={direccion.departamento}
                        onChange={(e) => setDireccion({ ...direccion, departamento: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                        placeholder="Ej: Guatemala"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Código Postal
                      </label>
                      <input
                        type="text"
                        value={direccion.codigoPostal}
                        onChange={(e) => setDireccion({ ...direccion, codigoPostal: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                        placeholder="01001"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        value={direccion.telefono}
                        onChange={(e) => setDireccion({ ...direccion, telefono: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                        placeholder="1234-5678"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSiguiente}
                  className="mt-6 w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
                >
                  Continuar al Pago
                </button>
              </div>
            )}

            {/* Paso 2: Pago */}
            {paso === 2 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Método de Pago</h2>

                {/* Solo método de pago con tarjeta */}
                <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border-2 border-purple-200">
                  <div className="flex items-center justify-center">
                    <CreditCard className="w-8 h-8 text-purple-600 mr-3" />
                    <div>
                      <p className="font-bold text-purple-900">Pago con Tarjeta de Crédito/Débito</p>
                      <p className="text-sm text-purple-700">Método de pago seguro y verificado</p>
                    </div>
                  </div>
                </div>

                {/* Formulario de tarjeta - Siempre visible */}
                <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Número de Tarjeta *
                      </label>
                      <input
                        type="text"
                        value={datosTarjeta.numeroTarjeta}
                        onChange={(e) => {
                          const formatted = formatCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16));
                          setDatosTarjeta({ ...datosTarjeta, numeroTarjeta: formatted });
                        }}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nombre del Titular *
                      </label>
                      <input
                        type="text"
                        value={datosTarjeta.nombreTitular}
                        onChange={(e) => setDatosTarjeta({ ...datosTarjeta, nombreTitular: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                        placeholder="JUAN PÉREZ"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Fecha de Expiración *
                        </label>
                        <input
                          type="text"
                          value={datosTarjeta.fechaExpiracion}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, '');
                            if (value.length >= 2) {
                              value = value.slice(0, 2) + '/' + value.slice(2, 4);
                            }
                            setDatosTarjeta({ ...datosTarjeta, fechaExpiracion: value });
                          }}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                          placeholder="MM/AA"
                          maxLength="5"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          CVV *
                        </label>
                        <input
                          type="text"
                          value={datosTarjeta.cvv}
                          onChange={(e) => setDatosTarjeta({ ...datosTarjeta, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                          placeholder="123"
                          maxLength="3"
                        />
                      </div>
                    </div>
                  </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setPaso(1)}
                    className="flex-1 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Volver
                  </button>
                  <button
                    onClick={handleSiguiente}
                    className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
                  >
                    Revisar Pedido
                  </button>
                </div>
              </div>
            )}

            {/* Paso 3: Confirmación */}
            {paso === 3 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Resumen del Pedido</h2>

                {/* Resumen de dirección */}
                <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-purple-600" />
                    Dirección de Envío
                  </h3>
                  <p className="text-sm text-gray-600">
                    {direccion.direccion}, {direccion.ciudad}, {direccion.departamento}
                    <br />
                    Tel: {direccion.telefono}
                  </p>
                </div>

                {/* Resumen de pago */}
                <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <CreditCard className="w-4 h-4 mr-2 text-purple-600" />
                    Método de Pago
                  </h3>
                  <p className="text-sm text-gray-600">
                    Tarjeta de Crédito/Débito terminada en {datosTarjeta.numeroTarjeta.slice(-4)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {datosTarjeta.nombreTitular}
                  </p>
                </div>

                {/* Lista de productos */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Productos ({cart.length})</h3>
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.idProductoTienda} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="w-16 h-16 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                          {item.imagenes && item.imagenes[0] && (
                            <img
                              src={`http://localhost:8080${item.imagenes[0]}`}
                              alt={item.nombreProducto}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 text-sm line-clamp-1">{item.nombreProducto}</p>
                          <p className="text-xs text-gray-500">{item.tipoArticulo}</p>
                          <p className="text-sm font-bold text-purple-600 mt-1">
                            {formatCurrency(item.precioVentaTienda)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setPaso(2)}
                    className="flex-1 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Volver
                  </button>
                  <button
                    onClick={handleConfirmarPedido}
                    disabled={loading}
                    className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-bold text-lg hover:from-emerald-700 hover:to-green-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Procesando...
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5 mr-2" />
                        Confirmar Pedido
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Resumen del carrito */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Resumen</h3>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({cart.length} productos)</span>
                  <span className="font-semibold text-gray-800">{formatCurrency(getCartTotal())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Envío</span>
                  <span className="font-semibold text-gray-800">Gratis</span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-800">Total</span>
                    <span className="text-2xl font-bold text-purple-600">{formatCurrency(getCartTotal())}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <p className="text-xs text-emerald-800">
                  <strong>Entrega estimada:</strong> 15 días hábiles
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
