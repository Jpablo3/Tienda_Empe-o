import { useState, useEffect } from 'react';
import { User, Lock, Shield, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { clienteAPI } from '../api/clienteAPI';

const Perfil = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Datos del usuario
  const [userData, setUserData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    numeroDocumento: '',
    tipoDocumento: '',
    direccion: '',
    ciudad: '',
    departamento: '',
    pais: '',
    codigoPostal: ''
  });

  // Datos originales para comparar cambios
  const [originalData, setOriginalData] = useState({});

  // Contraseña para confirmar cambios
  const [confirmPassword, setConfirmPassword] = useState('');

  // Datos para cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  // Cargar datos del usuario
  useEffect(() => {
    if (!user || !user.userId) {
      navigate('/login');
      return;
    }

    const cargarDatosUsuario = async () => {
      try {
        setLoading(true);
        const response = await clienteAPI.getClientePorId(user.userId);
        const direccion = response?.direccion || {};

        const data = {
          nombre: response?.nombreCliente || '',
          apellido: response?.apellidoCliente || '',
          telefono: response?.telefono || '',
          email: response?.emailCliente || user.userEmail || '',
          numeroDocumento: response?.numeroDocumento || '',
          tipoDocumento: response?.tipoDocumento || '',
          direccion: direccion?.direccionCliente || '',
          ciudad: direccion?.nombreCiudad || '',
          departamento: direccion?.nombreDepartamento || '',
          pais: direccion?.nombrePais || '',
          codigoPostal: direccion?.codigoPostal || ''
        };

        setUserData(data);
        setOriginalData(data);
      } catch (err) {
        console.error('Error al cargar datos del usuario:', err);
        setError('Error al cargar los datos del perfil');
      } finally {
        setLoading(false);
      }
    };

    cargarDatosUsuario();
  }, [user, navigate]);

  const handleChange = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
    setSuccess('');
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
    setSuccess('');
  };

  const hasChanges = () => {
    return JSON.stringify(userData) !== JSON.stringify(originalData);
  };

  const handleSavePersonalInfo = async () => {
    if (!hasChanges()) {
      setError('No hay cambios para guardar');
      return;
    }

    setShowPasswordModal(true);
  };

  const confirmSaveChanges = async () => {
    if (!confirmPassword) {
      setError('Por favor ingresa tu contraseña para confirmar los cambios');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Aquí llamarías al endpoint para actualizar los datos
      // Por ahora simulamos la actualización
      await clienteAPI.actualizarCliente(user.userId, {
        nombreCliente: userData.nombre,
        apellidoCliente: userData.apellido,
        telefono: userData.telefono,
        contraseña: confirmPassword // Para verificar
      });

      setSuccess('Datos actualizados correctamente');
      setOriginalData({ ...userData });
      setShowPasswordModal(false);
      setConfirmPassword('');
    } catch (err) {
      console.error('Error al actualizar datos:', err);
      setError(err.response?.data?.message || 'Error al actualizar los datos. Verifica tu contraseña.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setError('');
    setSuccess('');

    if (!passwordData.currentPassword) {
      setError('Ingresa tu contraseña actual');
      return;
    }

    if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      setError('La nueva contraseña debe ser diferente a la actual');
      return;
    }

    try {
      setLoading(true);

      // Aquí llamarías al endpoint para cambiar la contraseña
      // Por ahora simulamos el cambio
      console.log('Cambiando contraseña...');

      setSuccess('Contraseña actualizada correctamente');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
    } catch (err) {
      console.error('Error al cambiar contraseña:', err);
      setError(err.response?.data?.message || 'Error al cambiar la contraseña. Verifica tu contraseña actual.');
    } finally {
      setLoading(false);
    }
  };

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

  const InfoRow = ({ label, value }) => (
    <div className="flex flex-col space-y-1">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span className="text-base font-semibold text-gray-800">
        {value ? value : 'No registrado'}
      </span>
    </div>
  );

  const nombreCompleto = [userData.nombre, userData.apellido].filter(Boolean).join(' ').trim();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-8">
          Perfil de Usuario
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Menú Lateral */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl shadow-xl p-6">
              <h2 className="text-white font-bold text-lg mb-6">Menú de Perfil</h2>
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('personal')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'personal'
                      ? 'bg-white text-purple-900 shadow-lg'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <User className="h-5 w-5 mr-3" />
                  <span className="font-medium">Información Personal</span>
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'security'
                      ? 'bg-white text-purple-900 shadow-lg'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <Shield className="h-5 w-5 mr-3" />
                  <span className="font-medium">Seguridad</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Contenido Principal */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {/* Alertas */}
              {error && (
                <div className="mb-6">
                  <Alert type="error" message={error} onClose={() => setError('')} />
                </div>
              )}

              {success && (
                <div className="mb-6">
                  <Alert type="success" message={success} onClose={() => setSuccess('')} />
                </div>
              )}

              {/* Información Personal */}
              {activeTab === 'personal' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Información Personal</h2>

                  {loading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
                    </div>
                                    ) : (
                    <div className="space-y-8">
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen del cliente</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <InfoRow label="Nombre completo" value={nombreCompleto || null} />
                          <InfoRow label="Correo" value={userData.email || null} />
                          <InfoRow label="Tipo de documento" value={userData.tipoDocumento || null} />
                          <InfoRow label="Número de documento" value={userData.numeroDocumento || null} />
                          <InfoRow label="Teléfono" value={userData.telefono || null} />
                        </div>
                      </div>

                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Dirección y ubicación</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <InfoRow label="Dirección" value={userData.direccion || null} />
                          <InfoRow label="Ciudad" value={userData.ciudad || null} />
                          <InfoRow label="Departamento" value={userData.departamento || null} />
                          <InfoRow label="País" value={userData.pais || null} />
                          <InfoRow label="Código postal" value={userData.codigoPostal || null} />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actualizar datos de contacto</h3>
                        <div className="space-y-5">
                          {/* Nombre Completo */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Nombre Completo
                            </label>
                            <input
                              type="text"
                              value={nombreCompleto}
                              onChange={(e) => {
                                const partes = e.target.value.split(' ').filter(Boolean);
                                handleChange('nombre', partes[0] || '');
                                handleChange('apellido', partes.slice(1).join(' ') || '');
                              }}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                              placeholder="Juan Pérez"
                            />
                          </div>

                          {/* Correo Electrónico */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Correo Electrónico
                            </label>
                            <input
                              type="email"
                              value={userData.email}
                              onChange={(e) => handleChange('email', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                              placeholder="juan@example.com"
                            />
                          </div>

                          {/* Teléfono */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Teléfono
                            </label>
                            <input
                              type="tel"
                              value={userData.telefono}
                              onChange={(e) => handleChange('telefono', e.target.value.replace(/[^0-9]/g, '').substring(0, 8))}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                              placeholder="12345678"
                              maxLength={8}
                            />
                            <p className="text-xs text-gray-500 mt-1">Solo números, máximo 8 dígitos</p>
                          </div>

                          {/* Documento de Identidad */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Documento de Identidad
                            </label>
                            <input
                              type="text"
                              value={userData.numeroDocumento}
                              readOnly
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                              placeholder="12345678A"
                            />
                            <p className="text-xs text-gray-500 mt-1">El número de documento no se puede modificar</p>
                          </div>

                          {/* Botón Guardar */}
                          <button
                            onClick={handleSavePersonalInfo}
                            disabled={!hasChanges() || loading}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                          >
                            Guardar Cambios
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Seguridad */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Seguridad</h2>

                  <div className="space-y-5">
                    {/* Contraseña Actual */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contraseña Actual <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="Contraseña actual"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Nueva Contraseña */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nueva Contraseña <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="Nueva contraseña (mínimo 6 caracteres)"
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {passwordData.newPassword && passwordData.newPassword.length < 6 && (
                        <p className="text-red-600 text-xs mt-1">La contraseña debe tener al menos 6 caracteres</p>
                      )}
                    </div>

                    {/* Confirmar Nueva Contraseña */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmar Nueva Contraseña <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={passwordData.confirmNewPassword}
                          onChange={(e) => handlePasswordChange('confirmNewPassword', e.target.value)}
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="Confirmar nueva contraseña"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {passwordData.newPassword && passwordData.confirmNewPassword &&
                       passwordData.newPassword !== passwordData.confirmNewPassword && (
                        <p className="text-red-600 text-xs mt-1">Las contraseñas no coinciden</p>
                      )}
                    </div>

                    {/* Botón Cambiar Contraseña */}
                    <button
                      onClick={handleChangePassword}
                      disabled={loading || !passwordData.currentPassword || !passwordData.newPassword ||
                                passwordData.newPassword !== passwordData.confirmNewPassword}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                    >
                      {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmación de Contraseña */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirmar Cambios</h3>
            <p className="text-gray-600 mb-6">
              Por seguridad, ingresa tu contraseña para confirmar los cambios.
            </p>

            <div className="relative mb-6">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Ingresa tu contraseña"
                onKeyPress={(e) => e.key === 'Enter' && confirmSaveChanges()}
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setConfirmPassword('');
                  setError('');
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-all font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={confirmSaveChanges}
                disabled={!confirmPassword || loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {loading ? 'Guardando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Perfil;
