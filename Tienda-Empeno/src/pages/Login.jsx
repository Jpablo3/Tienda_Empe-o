import React, { useState } from 'react';
import { LogIn, AlertCircle, CheckCircle, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { clienteAPI } from '../api/clienteAPI';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (field, value) => {
    setLoginData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const validarEmail = (email) => {
    if (!email) return { valido: false, mensaje: '' };

    const emailLower = email.toLowerCase().trim();

    // Validar formato básico de email
    const formatoBasico = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formatoBasico.test(emailLower)) {
      return { valido: false, mensaje: 'Formato de email inválido' };
    }

    // Validar dominios permitidos para login
    // Clientes: gmail.com, hotmail.com
    // Admins: gmail.com, hotmail.com, admin.com
    const dominiosPermitidos = /@(gmail\.com|hotmail\.com|admin\.com)$/;
    if (!dominiosPermitidos.test(emailLower)) {
      return {
        valido: false,
        mensaje: 'Solo se permiten correos de Gmail o Hotmail'
      };
    }

    return { valido: true, mensaje: '' };
  };

  const validateForm = () => {
    const emailValido = validarEmail(loginData.email).valido;
    return loginData.email.trim() &&
           emailValido &&
           loginData.password &&
           loginData.password.length >= 6;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setError('Por favor, completa todos los campos correctamente');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        emailCliente: loginData.email.trim().toLowerCase(),
        contraseña: loginData.password
      };

      console.log('Intentando login con:', payload);
      const response = await clienteAPI.login(payload);

      console.log('Respuesta del login:', response);

      if (response.success) {
        // Usar el contexto de autenticación
        login(response.token, response.idUsuario, response.tipoUsuario, loginData.email);

        // Mostrar mensaje de éxito
        setLoading(false);
        setSuccess('¡Ha ingresado exitosamente!');

        // Verificar si hay una ruta de redirección guardada
        const redirectPath = localStorage.getItem('redirectAfterLogin');

        // Redirigir después de 1.5 segundos
        setTimeout(() => {
          if (redirectPath) {
            // Limpiar la ruta guardada
            localStorage.removeItem('redirectAfterLogin');
            navigate(redirectPath);
          } else {
            // Tanto admin como cliente van al home
            navigate('/');
          }
        }, 1500);
      } else {
        setError(response.message || 'Credenciales incorrectas');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error completo en login:', err);
      console.error('Error.response:', err.response);
      console.error('Error.message:', err.message);
      console.error('Error.code:', err.code);

      let mensajeError = 'Error al iniciar sesión';

      if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        mensajeError = 'No se puede conectar al servidor. Verifica que el backend esté corriendo en: ' + (import.meta.env.VITE_API_URL || 'URL no configurada');
      } else if (err.code === 'ECONNABORTED') {
        mensajeError = 'La petición tardó demasiado tiempo. El servidor no responde.';
      } else if (err.response) {
        mensajeError = err.response.data?.message || `Error del servidor: ${err.response.status}`;
      } else {
        mensajeError = err.message || 'Error desconocido';
      }

      setError(mensajeError);
      setLoading(false);
    }
  };

  // Componente de alerta
  const Alert = ({ type, message, onClose }) => (
    <div className={`p-4 rounded-lg flex items-start space-x-3 ${
      type === 'error' ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
    }`}>
      {type === 'error' ? (
        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
      ) : (
        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
      )}
      <div className="flex-1">
        <p className={`text-sm font-medium ${type === 'error' ? 'text-red-800' : 'text-green-800'}`}>
          {message}
        </p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`text-sm font-medium ${type === 'error' ? 'text-red-600 hover:text-red-500' : 'text-green-600 hover:text-green-500'}`}
        >
          ✕
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      {/* Botón Volver */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-4 left-4 p-2 rounded-lg text-gray-600 hover:bg-purple-100 hover:text-purple-700 transition-all z-50"
        title="Volver al inicio"
      >
        <ArrowLeft className="h-6 w-6" />
      </button>

      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-8">
            <div className="flex justify-center mb-4">
              <div className="bg-white rounded-full p-4">
                <LogIn className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white text-center">
              Iniciar Sesión
            </h2>
            <p className="text-indigo-100 text-center mt-2 text-sm">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          <div className="p-8">
            {/* Alertas */}
            {error && (
              <div className="mb-6">
                <Alert type="error" message={error} onClose={() => setError('')} />
              </div>
            )}

            {success && (
              <div className="mb-6">
                <Alert type="success" message={success} />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={loginData.email}
                    onChange={(e) => handleChange('email', e.target.value.toLowerCase())}
                    placeholder="usuario@gmail.com"
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      loginData.email && !validarEmail(loginData.email).valido
                        ? 'border-red-400'
                        : 'border-gray-300'
                    }`}
                  />
                </div>
                {loginData.email && !validarEmail(loginData.email).valido && (
                  <p className="text-red-600 text-xs mt-1">{validarEmail(loginData.email).mensaje}</p>
                )}
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={loginData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {loginData.password && loginData.password.length < 6 && (
                  <p className="text-red-600 text-xs mt-1">La contraseña debe tener al menos 6 caracteres</p>
                )}
              </div>

              {/* Botón de Login */}
              <button
                type="submit"
                disabled={!validateForm() || loading}
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center font-semibold transition-all"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    <LogIn className="mr-2 h-5 w-5" />
                    Iniciar Sesión
                  </>
                )}
              </button>

              {/* Link a Registro */}
              <div className="text-center pt-4">
                <p className="text-sm text-gray-600">
                  ¿No tienes cuenta?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/registro')}
                    className="text-indigo-600 hover:text-indigo-800 font-semibold"
                  >
                    Regístrate aquí
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
