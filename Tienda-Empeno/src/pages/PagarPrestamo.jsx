import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, Banknote, ArrowLeft, Loader, CheckCircle, AlertCircle, Calendar, DollarSign } from 'lucide-react';
import Header from '../components/Header';
import { prestamosAPI } from '../api/prestamosAPI';
import { pagosAPI } from '../api/pagosAPI';

const PagarPrestamo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prestamo, setPrestamo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingPago, setLoadingPago] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [metodoPago, setMetodoPago] = useState('tarjeta'); // 'tarjeta' o 'efectivo'

  // Datos del formulario de tarjeta
  const [datosTarjeta, setDatosTarjeta] = useState({
    numeroTarjeta: '',
    fechaExpiracion: '',
    cvv: '',
    nombreTitular: ''
  });

  useEffect(() => {
    cargarPrestamo();
  }, [id]);

  const cargarPrestamo = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await prestamosAPI.obtenerPrestamoPorId(id);
      setPrestamo(response);
    } catch (error) {
      console.error('Error al cargar préstamo:', error);
      setError('Error al cargar el préstamo');
      if (error.response?.status === 401) {
        setTimeout(() => navigate('/login'), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangeTarjeta = (e) => {
    let { name, value } = e.target;

    // Formatear número de tarjeta
    if (name === 'numeroTarjeta') {
      value = value.replace(/\D/g, '').slice(0, 16);
    }

    // Formatear fecha (MM/YY)
    if (name === 'fechaExpiracion') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      value = value.slice(0, 5);
    }

    // CVV solo números
    if (name === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 4);
    }

    setDatosTarjeta(prev => ({ ...prev, [name]: value }));
  };

  const handlePagarConTarjeta = async (e) => {
    e.preventDefault();

    // Validaciones
    if (datosTarjeta.numeroTarjeta.length !== 16) {
      setError('El número de tarjeta debe tener 16 dígitos');
      return;
    }
    if (!datosTarjeta.fechaExpiracion.match(/^\d{2}\/\d{2}$/)) {
      setError('Formato de fecha inválido (MM/YY)');
      return;
    }
    if (datosTarjeta.cvv.length < 3) {
      setError('CVV inválido');
      return;
    }
    if (!datosTarjeta.nombreTitular.trim()) {
      setError('Ingresa el nombre del titular');
      return;
    }

    try {
      setLoadingPago(true);
      setError('');

      const response = await pagosAPI.pagarConTarjeta({
        idPrestamo: parseInt(id),
        ...datosTarjeta
      });

      setSuccess(`¡Pago exitoso! Monto: Q${response.montoPagado}. Saldo restante: Q${response.saldoRestante}`);

      // Redirigir después de 3 segundos
      setTimeout(() => {
        navigate('/prestamos');
      }, 3000);
    } catch (error) {
      console.error('Error al pagar:', error);
      setError(error.response?.data?.message || 'Error al procesar el pago');
    } finally {
      setLoadingPago(false);
    }
  };

  const handlePagarEnEfectivo = async () => {
    if (!confirm('¿Confirmas que deseas solicitar el pago en efectivo? Se asignará un cobrador.')) {
      return;
    }

    try {
      setLoadingPago(true);
      setError('');

      const response = await pagosAPI.pagarEnEfectivo(parseInt(id));

      setSuccess(`¡Solicitud exitosa! Se ha programado la visita del cobrador para el ${response.fechaVisita}. Monto a pagar: Q${response.montoPagar}`);

      setTimeout(() => {
        navigate('/prestamos');
      }, 4000);
    } catch (error) {
      console.error('Error al solicitar pago:', error);
      setError(error.response?.data?.message || 'Error al solicitar pago en efectivo');
    } finally {
      setLoadingPago(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader className="w-16 h-16 text-purple-600 animate-spin" />
        </div>
      </div>
    );
  }

  if (!prestamo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-20">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
            Préstamo no encontrado
          </div>
        </div>
      </div>
    );
  }

  // Usar la cuota mensual calculada por el backend con redondeo correcto
  // Si no viene del backend, calcular como fallback
  const cuotaMensual = prestamo.cuotaMensual ||
    (prestamo.saldoAdeudado || prestamo.montoPrestamo) / prestamo.plazoMeses;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Botón Volver */}
        <button
          onClick={() => navigate('/prestamos')}
          className="mb-6 flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver a Mis Préstamos</span>
        </button>

        {/* Mensajes */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-6 flex items-center">
            <AlertCircle className="w-6 h-6 mr-3" />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg mb-6 flex items-center">
            <CheckCircle className="w-6 h-6 mr-3" />
            {success}
          </div>
        )}

        {/* Información del préstamo */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
            Pagar Cuota de Préstamo
          </h1>

          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{prestamo.nombreArticulo}</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Saldo Adeudado:</p>
                <p className="text-2xl font-bold text-red-600">
                  Q{parseFloat(prestamo.saldoAdeudado || prestamo.montoPrestamo).toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Cuota Mensual:</p>
                <p className="text-2xl font-bold text-green-600">
                  Q{cuotaMensual.toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          {/* Selector de método de pago */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => setMetodoPago('tarjeta')}
              className={`p-4 rounded-xl border-2 transition-all ${
                metodoPago === 'tarjeta'
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <CreditCard className={`w-8 h-8 mx-auto mb-2 ${metodoPago === 'tarjeta' ? 'text-purple-600' : 'text-gray-400'}`} />
              <p className={`font-semibold ${metodoPago === 'tarjeta' ? 'text-purple-600' : 'text-gray-600'}`}>
                Tarjeta de Crédito/Débito
              </p>
            </button>

            <button
              onClick={() => setMetodoPago('efectivo')}
              className={`p-4 rounded-xl border-2 transition-all ${
                metodoPago === 'efectivo'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <Banknote className={`w-8 h-8 mx-auto mb-2 ${metodoPago === 'efectivo' ? 'text-blue-600' : 'text-gray-400'}`} />
              <p className={`font-semibold ${metodoPago === 'efectivo' ? 'text-blue-600' : 'text-gray-600'}`}>
                Efectivo
              </p>
            </button>
          </div>

          {/* Formulario de tarjeta */}
          {metodoPago === 'tarjeta' && (
            <form onSubmit={handlePagarConTarjeta} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Tarjeta
                </label>
                <input
                  type="text"
                  name="numeroTarjeta"
                  value={datosTarjeta.numeroTarjeta}
                  onChange={handleChangeTarjeta}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Expiración
                  </label>
                  <input
                    type="text"
                    name="fechaExpiracion"
                    value={datosTarjeta.fechaExpiracion}
                    onChange={handleChangeTarjeta}
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="password"
                    name="cvv"
                    value={datosTarjeta.cvv}
                    onChange={handleChangeTarjeta}
                    placeholder="123"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Titular
                </label>
                <input
                  type="text"
                  name="nombreTitular"
                  value={datosTarjeta.nombreTitular}
                  onChange={handleChangeTarjeta}
                  placeholder="Como aparece en la tarjeta"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loadingPago}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-4 rounded-xl text-lg font-bold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingPago ? (
                  <span className="flex items-center justify-center space-x-2">
                    <Loader className="w-6 h-6 animate-spin" />
                    <span>Procesando...</span>
                  </span>
                ) : (
                  `Pagar Q${cuotaMensual.toLocaleString('es-GT', { minimumFractionDigits: 2 })}`
                )}
              </button>
            </form>
          )}

          {/* Opción de efectivo */}
          {metodoPago === 'efectivo' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-bold text-blue-900 mb-2">Pago en Efectivo</h3>
                <p className="text-sm text-blue-800 mb-4">
                  Al solicitar el pago en efectivo, se asignará un cobrador que visitará tu domicilio.
                </p>
                <p className="text-sm text-blue-700">
                  <strong>Monto a pagar:</strong> Q{cuotaMensual.toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                </p>
              </div>

              <button
                onClick={handlePagarEnEfectivo}
                disabled={loadingPago}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl text-lg font-bold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingPago ? (
                  <span className="flex items-center justify-center space-x-2">
                    <Loader className="w-6 h-6 animate-spin" />
                    <span>Procesando...</span>
                  </span>
                ) : (
                  'Solicitar Pago en Efectivo'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PagarPrestamo;
