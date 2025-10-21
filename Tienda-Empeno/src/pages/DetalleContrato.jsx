import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FileText, Calendar, DollarSign, Percent, Clock, ArrowLeft,
  Download, CheckCircle, Loader, AlertCircle, User, Mail
} from 'lucide-react';
import Header from '../components/Header';
import ModalFirmaTexto from '../components/ModalFirmaTexto';
import { contratosAPI } from '../api/contratosAPI';

const DetalleContrato = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contrato, setContrato] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingFirma, setLoadingFirma] = useState(false);
  const [error, setError] = useState('');
  const [showModalFirma, setShowModalFirma] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    cargarContrato();
  }, [id]);

  const cargarContrato = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await contratosAPI.obtenerContrato(id);
      setContrato(response);
    } catch (error) {
      console.error('Error al cargar contrato:', error);
      setError('Error al cargar el contrato. Por favor intenta de nuevo.');
      if (error.response?.status === 401) {
        setTimeout(() => navigate('/login'), 2000);
      } else if (error.response?.status === 404) {
        setError('Contrato no encontrado');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFirmarContrato = async (nombreCompleto) => {
    try {
      setLoadingFirma(true);
      setError('');

      await contratosAPI.firmarContrato(id, nombreCompleto);

      setShowModalFirma(false);
      setSuccessMessage('¡Contrato firmado exitosamente! Tu préstamo ya está activo.');

      // Redirigir a la página de préstamos después de 2 segundos
      setTimeout(() => {
        navigate('/prestamos');
      }, 2000);
    } catch (error) {
      console.error('Error al firmar contrato:', error);
      setError(error.response?.data?.message || 'Error al firmar el contrato');
      setShowModalFirma(false);
    } finally {
      setLoadingFirma(false);
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-GT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader className="w-16 h-16 text-purple-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Cargando contrato...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !contrato) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-20">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
            <AlertCircle className="w-6 h-6 inline mr-2" />
            {error}
          </div>
          <button
            onClick={() => navigate('/contratos')}
            className="mt-4 text-purple-600 hover:text-purple-700 font-semibold"
          >
            ← Volver a Contratos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <Header />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Botón Volver */}
        <button
          onClick={() => navigate('/contratos')}
          className="mb-6 flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver a Contratos</span>
        </button>

        {/* Mensaje de Éxito */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg mb-6 flex items-center">
            <CheckCircle className="w-6 h-6 mr-3" />
            {successMessage}
          </div>
        )}

        {/* Mensaje de Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-6">
            <AlertCircle className="w-6 h-6 inline mr-2" />
            {error}
          </div>
        )}

        {contrato && (
          <>
            {/* Header del contrato */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                    Contrato de Préstamo
                  </h1>
                  <p className="text-gray-600">ID: {contrato.idContrato}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full font-semibold text-sm">
                    {contrato.estado}
                  </span>
                </div>
              </div>

              {/* Información del artículo */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Artículo en Garantía</h2>
                <p className="text-2xl font-bold text-purple-600">{contrato.nombreArticulo}</p>
              </div>

              {/* Información del cliente */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-600">Cliente</span>
                  </div>
                  <p className="font-semibold text-gray-800">{contrato.nombreCliente}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Mail className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-600">Email</span>
                  </div>
                  <p className="font-semibold text-gray-800 text-sm">{contrato.emailCliente}</p>
                </div>
              </div>

              {/* Detalles del préstamo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <DollarSign className="w-6 h-6 text-green-600" />
                      <span className="text-gray-700">Monto del Préstamo</span>
                    </div>
                    <span className="text-2xl font-bold text-green-600">
                      Q{parseFloat(contrato.montoPrestamo).toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Percent className="w-6 h-6 text-blue-600" />
                      <span className="text-gray-700">Tasa de Interés</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">
                      {parseFloat(contrato.tasaInteres).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-6 h-6 text-purple-600" />
                      <span className="text-gray-700">Plazo</span>
                    </div>
                    <span className="text-2xl font-bold text-purple-600">
                      {contrato.plazoMeses} {contrato.plazoMeses === 1 ? 'mes' : 'meses'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <DollarSign className="w-6 h-6 text-orange-600" />
                      <span className="text-gray-700">Saldo Adeudado</span>
                    </div>
                    <span className="text-2xl font-bold text-orange-600">
                      Q{parseFloat(contrato.saldoAdeudado).toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-600">Fecha de Inicio</span>
                  </div>
                  <p className="font-semibold text-gray-800">{formatearFecha(contrato.fechaInicio)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-5 h-5 text-red-600" />
                    <span className="text-sm text-gray-600">Fecha de Vencimiento</span>
                  </div>
                  <p className="font-semibold text-red-600">{formatearFecha(contrato.fechaVencimiento)}</p>
                </div>
              </div>

              {/* Documento del contrato */}
              {contrato.documentoContrato && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-8 h-8 text-blue-600" />
                      <div>
                        <h3 className="font-bold text-gray-800">Documento del Contrato</h3>
                        <p className="text-sm text-gray-600">Descarga y revisa el contrato completo</p>
                      </div>
                    </div>
                    <a
                      href={contrato.documentoContrato}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center space-x-2"
                    >
                      <Download className="w-5 h-5" />
                      <span>Descargar PDF</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Botón de firma */}
              {contrato.estado === 'Pendiente' && (
                <div className="text-center">
                  <button
                    onClick={() => setShowModalFirma(true)}
                    disabled={loadingFirma}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-4 rounded-xl text-xl font-bold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingFirma ? (
                      <span className="flex items-center space-x-2">
                        <Loader className="w-6 h-6 animate-spin" />
                        <span>Procesando...</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-2">
                        <CheckCircle className="w-6 h-6" />
                        <span>Firmar Contrato</span>
                      </span>
                    )}
                  </button>
                  <p className="text-sm text-gray-600 mt-4">
                    Al firmar, aceptas los términos y condiciones del préstamo
                  </p>
                </div>
              )}

              {/* Si ya está firmado */}
              {contrato.estado === 'Firmado' && (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-800 mb-2">
                    Contrato Firmado
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Firmado el {formatearFecha(contrato.fechaFirma)}
                  </p>
                  <button
                    onClick={() => navigate('/prestamos')}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold transition-all"
                  >
                    Ver Mis Préstamos
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Modal de Firma (texto) */}
      {showModalFirma && (
        <ModalFirmaTexto
          onConfirm={handleFirmarContrato}
          onClose={() => setShowModalFirma(false)}
        />
      )}
    </div>
  );
};

export default DetalleContrato;
