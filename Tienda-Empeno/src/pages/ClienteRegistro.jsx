import React, { useState, useEffect } from 'react';
import { ChevronDown, MapPin, User, ArrowRight, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { ubicacionAPI } from '../api/ubicacionAPI';
import { clienteAPI } from '../api/clienteAPI';
import { tipoDocumentoAPI } from '../api/tipoDocumentoAPI';

const ClienteRegistroForm = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingDepartamentos, setLoadingDepartamentos] = useState(false);
  const [loadingCiudades, setLoadingCiudades] = useState(false);
  const [loadingTiposDocumento, setLoadingTiposDocumento] = useState(false);
  const [validandoEmail, setValidandoEmail] = useState(false);
  const [emailDisponible, setEmailDisponible] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Estados para los datos del formulario
  const [direccionData, setDireccionData] = useState({
    pais_id: 1, // Guatemala por defecto
    departamento_id: '',
    ciudad_id: '',
    direccion_cliente: '',
    codigo_postal: ''
  });

  const [clienteData, setClienteData] = useState({
    tipo_usuario_id: 1, // Cliente por defecto
    tipo_documento_id: '',
    numero_documento: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  });

  // Estados para los datos de los selects
  const [departamentos, setDepartamentos] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [tiposDocumento, setTiposDocumento] = useState([]);

  // Cargar departamentos al iniciar
  useEffect(() => {
    const cargarDepartamentos = async () => {
      setLoadingDepartamentos(true);
      setError('');
      try {
        const data = await ubicacionAPI.getDepartamentos();
        setDepartamentos(data);
      } catch (err) {
        setError('Error al cargar departamentos: ' + (err.response?.data?.mensaje || err.message));
        console.error('Error cargando departamentos:', err);
      } finally {
        setLoadingDepartamentos(false);
      }
    };

    cargarDepartamentos();
  }, []);

  // Cargar tipos de documento al iniciar
  useEffect(() => {
    const cargarTiposDocumento = async () => {
      setLoadingTiposDocumento(true);
      try {
        const data = await tipoDocumentoAPI.getTiposDocumento();
        setTiposDocumento(data);
      } catch (err) {
        console.error('Error cargando tipos de documento:', err);
      } finally {
        setLoadingTiposDocumento(false);
      }
    };

    cargarTiposDocumento();
  }, []);

  // Cargar ciudades cuando cambia el departamento
  useEffect(() => {
    const cargarCiudades = async () => {
      if (direccionData.departamento_id) {
        setLoadingCiudades(true);
        setError('');
        try {
          const data = await ubicacionAPI.getCiudadesByDepartamento(direccionData.departamento_id);
          setCiudades(data);
          setDireccionData(prev => ({ ...prev, ciudad_id: '' }));
        } catch (err) {
          setError('Error al cargar ciudades: ' + (err.response?.data?.mensaje || err.message));
          console.error('Error cargando ciudades:', err);
          setCiudades([]);
        } finally {
          setLoadingCiudades(false);
        }
      } else {
        setCiudades([]);
      }
    };

    cargarCiudades();
  }, [direccionData.departamento_id]);

  // Validar email cuando cambia (con debounce)
  useEffect(() => {
    const validarEmail = async () => {
      if (clienteData.email && clienteData.email.includes('@') && clienteData.email.length > 5) {
        setValidandoEmail(true);
        try {
          const disponible = await clienteAPI.validarEmailDisponibilidad(clienteData.email);
          setEmailDisponible(disponible);
        } catch (err) {
          console.error('Error validando email:', err);
          setEmailDisponible(null);
        } finally {
          setValidandoEmail(false);
        }
      } else {
        setEmailDisponible(null);
      }
    };

    const timeoutId = setTimeout(validarEmail, 1000);
    return () => clearTimeout(timeoutId);
  }, [clienteData.email]);

  const handleDireccionChange = (field, value) => {
    setDireccionData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleClienteChange = (field, value) => {
    setClienteData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');

    if (field === 'email') {
      setEmailDisponible(null);
    }

    // Limpiar número de documento cuando cambia el tipo
    if (field === 'tipo_documento_id') {
      setClienteData(prev => ({
        ...prev,
        tipo_documento_id: value,
        numero_documento: ''
      }));
    }
  };

  // Función para validar número de documento según tipo
  const validarNumeroDocumento = (tipoDocId, numeroDoc) => {
    const tipoDoc = tiposDocumento.find(t => t.id === parseInt(tipoDocId));
    if (!tipoDoc || !numeroDoc) return { valido: true, mensaje: '' };

    const nombreTipo = tipoDoc.nombre.toUpperCase();

    if (nombreTipo.includes('DPI')) {
      // DPI: 13 dígitos numéricos (ej: 1234567890123)
      const regex = /^\d{13}$/;
      return {
        valido: regex.test(numeroDoc),
        mensaje: regex.test(numeroDoc) ? '' : 'DPI debe tener 13 dígitos (Ej: 1234567890123)'
      };
    } else if (nombreTipo.includes('CEDULA') || nombreTipo.includes('CÉDULA')) {
      // Cédula: E.123456 01 01 (6-8 dígitos con formato)
      const regex = /^[A-Z]\.\d{6}$/;
      return {
        valido: regex.test(numeroDoc),
        mensaje: regex.test(numeroDoc) ? '' : 'Cédula debe tener formato E.123456 (letra, punto, 6 dígitos)'
      };
    } else if (nombreTipo.includes('PASAPORTE')) {
      // Pasaporte: 1 letra + 8 números (ej: G12345678)
      const regex = /^[A-Z]\d{8}$/;
      return {
        valido: regex.test(numeroDoc),
        mensaje: regex.test(numeroDoc) ? '' : 'Pasaporte debe ser 1 letra + 8 dígitos (Ej: G12345678)'
      };
    }

    return { valido: true, mensaje: '' };
  };

  // Función para formatear el input según tipo de documento
  const formatearNumeroDocumento = (tipoDocId, valor) => {
    const tipoDoc = tiposDocumento.find(t => t.id === parseInt(tipoDocId));
    if (!tipoDoc) return valor;

    const nombreTipo = tipoDoc.nombre.toUpperCase();

    if (nombreTipo.includes('DPI')) {
      // Solo números, máximo 13
      return valor.replace(/[^0-9]/g, '').substring(0, 13);
    } else if (nombreTipo.includes('CEDULA') || nombreTipo.includes('CÉDULA')) {
      // Formato: E.123456
      let formatted = valor.toUpperCase().replace(/[^A-Z0-9.]/g, '');
      if (formatted.length > 0 && !formatted.includes('.')) {
        if (formatted.length > 1) {
          formatted = formatted[0] + '.' + formatted.substring(1);
        }
      }
      return formatted.substring(0, 8); // E.123456 = 8 caracteres
    } else if (nombreTipo.includes('PASAPORTE')) {
      // 1 letra + 8 números
      let formatted = valor.toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (formatted.length > 1) {
        formatted = formatted[0] + formatted.substring(1).replace(/[^0-9]/g, '');
      }
      return formatted.substring(0, 9);
    }

    return valor;
  };

  // Función para obtener placeholder según tipo de documento
  const getPlaceholderDocumento = (tipoDocId) => {
    const tipoDoc = tiposDocumento.find(t => t.id === parseInt(tipoDocId));
    if (!tipoDoc) return 'Seleccione tipo de documento primero';

    const nombreTipo = tipoDoc.nombre.toUpperCase();

    if (nombreTipo.includes('DPI')) {
      return 'Ej: 1234567890123';
    } else if (nombreTipo.includes('CEDULA') || nombreTipo.includes('CÉDULA')) {
      return 'Ej: E.123456';
    } else if (nombreTipo.includes('PASAPORTE')) {
      return 'Ej: G12345678';
    }

    return 'Ingrese su número de documento';
  };

  // Función para validar email (solo gmail y hotmail)
  const validarEmail = (email) => {
    if (!email) return { valido: true, mensaje: '' };

    const emailLower = email.toLowerCase().trim();

    // Validar formato básico de email
    const formatoBasico = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formatoBasico.test(emailLower)) {
      return { valido: false, mensaje: 'Formato de email inválido' };
    }

    // Validar que sea gmail o hotmail
    const dominiosPermitidos = /@(gmail\.com|hotmail\.com)$/;
    if (!dominiosPermitidos.test(emailLower)) {
      return {
        valido: false,
        mensaje: 'Solo se permiten correos de Gmail o Hotmail (Ej: usuario@gmail.com, usuario@hotmail.com)'
      };
    }

    return { valido: true, mensaje: '' };
  };

  const validateStep1 = () => {
    return direccionData.departamento_id &&
           direccionData.ciudad_id &&
           direccionData.direccion_cliente.trim() &&
           direccionData.codigo_postal.trim() &&
           direccionData.codigo_postal.length === 5;
  };

  const validateStep2 = () => {
    const emailValido = validarEmail(clienteData.email).valido;
    const emailValid = clienteData.email.trim() &&
                      emailValido &&
                      emailDisponible !== false;

    const documentoValido = validarNumeroDocumento(
      clienteData.tipo_documento_id,
      clienteData.numero_documento
    ).valido;

    const telefonoValido = clienteData.telefono.length === 8;

    return clienteData.tipo_documento_id &&
           clienteData.numero_documento.trim() &&
           documentoValido &&
           clienteData.nombre.trim() &&
           clienteData.apellido.trim() &&
           emailValid &&
           clienteData.telefono.trim() &&
           telefonoValido &&
           clienteData.password &&
           clienteData.confirmPassword &&
           clienteData.password === clienteData.confirmPassword &&
           clienteData.password.length >= 6;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    } else {
      setError('Por favor, completa todos los campos requeridos');
    }
  };

  const handlePrevStep = () => {
    setStep(1);
    setError('');
  };

  const handleSubmit = async () => {
    if (!validateStep2()) {
      setError('Por favor, verifica todos los campos requeridos');
      return;
    }

    if (emailDisponible === false) {
      setError('El correo electrónico ya está registrado');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Paso 1: Registrar la dirección primero
      const direccionPayload = {
        idCiudad: parseInt(direccionData.ciudad_id),
        direccionCliente: direccionData.direccion_cliente.trim(),
        codigoPostal: direccionData.codigo_postal.trim()
      };

      console.log('Registrando dirección:', direccionPayload);
      const direccionResponse = await clienteAPI.registrarDireccion(direccionPayload);
      console.log('Dirección registrada:', direccionResponse);

      // Paso 2: Registrar el cliente con el ID de la dirección
      const clientePayload = {
        idTipoDocumento: parseInt(clienteData.tipo_documento_id),
        numeroDocumento: clienteData.numero_documento.trim(),
        nombreCliente: clienteData.nombre.trim(),
        apellidoCliente: clienteData.apellido.trim(),
        emailCliente: clienteData.email.trim().toLowerCase(),
        contraseña: clienteData.password,
        idDireccion: direccionResponse.idDireccion
      };

      console.log('Registrando cliente:', clientePayload);
      const response = await clienteAPI.registrarCliente(clientePayload);

      setSuccess('¡Cliente registrado exitosamente! ID: ' + response.idCliente);

      // Reset form después de éxito
      setTimeout(() => {
        resetForm();
      }, 3000);

    } catch (err) {
      const mensajeError = err.response?.data?.mensaje || err.response?.data?.message || err.message || 'Error al registrar cliente';
      setError(mensajeError);
      console.error('Error en registro:', err);
      console.error('Detalles del error:', err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setError('');
    setSuccess('');
    setEmailDisponible(null);
    setDireccionData({
      pais_id: 1,
      departamento_id: '',
      ciudad_id: '',
      direccion_cliente: '',
      codigo_postal: ''
    });
    setClienteData({
      tipo_usuario_id: 1,
      tipo_documento_id: '',
      numero_documento: '',
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      password: '',
      confirmPassword: ''
    });
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-8">
            <h2 className="text-xl font-bold text-white text-center mb-6">
              Registro de Cliente
            </h2>
            <div className="flex justify-center">
              <div className="flex items-center space-x-4">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full transition-all ${
                  step >= 1 ? 'bg-white text-indigo-600' : 'bg-indigo-400 text-white'
                }`}>
                  <MapPin size={20} />
                </div>
                <div className={`w-12 h-0.5 transition-all ${step >= 2 ? 'bg-white' : 'bg-indigo-400'}`}></div>
                <div className={`flex items-center justify-center w-12 h-12 rounded-full transition-all ${
                  step >= 2 ? 'bg-white text-indigo-600' : 'bg-indigo-400 text-white'
                }`}>
                  <User size={20} />
                </div>
              </div>
            </div>
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

            {step === 1 && (
              <div className="space-y-5">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">Información de Dirección</h3>
                  <p className="text-sm text-gray-500">Ingresa los datos de tu dirección</p>
                </div>

                {/* País (readonly) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    País
                  </label>
                  <input
                    type="text"
                    value="Guatemala"
                    readOnly
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                  />
                </div>

                {/* Departamento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departamento <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={direccionData.departamento_id}
                      onChange={(e) => handleDireccionChange('departamento_id', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                      disabled={loadingDepartamentos}
                    >
                      <option value="">
                        {loadingDepartamentos ? 'Cargando departamentos...' : 'Seleccionar departamento'}
                      </option>
                      {departamentos.map(dept => (
                        <option key={dept.id} value={dept.id}>
                          {dept.nombre}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Ciudad */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={direccionData.ciudad_id}
                      onChange={(e) => handleDireccionChange('ciudad_id', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                      disabled={!direccionData.departamento_id || loadingCiudades}
                    >
                      <option value="">
                        {loadingCiudades ? 'Cargando ciudades...' :
                         !direccionData.departamento_id ? 'Selecciona primero un departamento' :
                         'Seleccionar ciudad'}
                      </option>
                      {ciudades.map(ciudad => (
                        <option key={ciudad.id} value={ciudad.id}>
                          {ciudad.nombre}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Dirección */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={direccionData.direccion_cliente}
                    onChange={(e) => handleDireccionChange('direccion_cliente', e.target.value)}
                    placeholder="Ej: 15 avenida 12-45, zona 10, Edificio Torre Azul, Apartamento 5A"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                    rows={3}
                  />
                </div>

                {/* Código Postal */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código Postal <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={direccionData.codigo_postal}
                    onChange={(e) => handleDireccionChange('codigo_postal', e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Ej: 01010"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    maxLength={5}
                  />
                  {direccionData.codigo_postal && direccionData.codigo_postal.length !== 5 && (
                    <p className="text-red-600 text-xs mt-1">El código postal debe tener exactamente 5 dígitos</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={!validateStep1()}
                  className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center font-semibold transition-all"
                >
                  Siguiente
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">Información Personal</h3>
                  <p className="text-sm text-gray-500">Ingresa tus datos personales</p>
                </div>

                {/* Tipo de Documento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Documento <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={clienteData.tipo_documento_id}
                      onChange={(e) => handleClienteChange('tipo_documento_id', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                      disabled={loadingTiposDocumento}
                    >
                      <option value="">
                        {loadingTiposDocumento ? 'Cargando tipos de documento...' : 'Seleccionar tipo de documento'}
                      </option>
                      {tiposDocumento.map(tipo => (
                        <option key={tipo.id} value={tipo.id}>
                          {tipo.nombre}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Número de Documento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Documento <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={clienteData.numero_documento}
                    onChange={(e) => {
                      const valorFormateado = formatearNumeroDocumento(clienteData.tipo_documento_id, e.target.value);
                      handleClienteChange('numero_documento', valorFormateado);
                    }}
                    placeholder={getPlaceholderDocumento(clienteData.tipo_documento_id)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    disabled={!clienteData.tipo_documento_id}
                  />
                  {clienteData.numero_documento && !validarNumeroDocumento(clienteData.tipo_documento_id, clienteData.numero_documento).valido && (
                    <p className="text-red-600 text-xs mt-1">
                      {validarNumeroDocumento(clienteData.tipo_documento_id, clienteData.numero_documento).mensaje}
                    </p>
                  )}
                </div>

                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={clienteData.nombre}
                    onChange={(e) => handleClienteChange('nombre', e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    maxLength={50}
                  />
                </div>

                {/* Apellido */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={clienteData.apellido}
                    onChange={(e) => handleClienteChange('apellido', e.target.value)}
                    placeholder="Tu apellido"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    maxLength={50}
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={clienteData.telefono}
                    onChange={(e) => {
                      const soloNumeros = e.target.value.replace(/[^0-9]/g, '');
                      handleClienteChange('telefono', soloNumeros);
                    }}
                    placeholder="Ej: 33124567"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    maxLength={8}
                  />
                  {clienteData.telefono && clienteData.telefono.length !== 8 && (
                    <p className="text-red-600 text-xs mt-1">El teléfono debe tener exactamente 8 dígitos</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correo Electrónico <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={clienteData.email}
                      onChange={(e) => handleClienteChange('email', e.target.value.toLowerCase())}
                      placeholder="usuario@gmail.com"
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 pr-10 ${
                        !validarEmail(clienteData.email).valido ? 'border-red-400' :
                        emailDisponible === false ? 'border-red-400' :
                        emailDisponible === true ? 'border-green-400' : 'border-gray-300'
                      }`}
                    />
                    {validandoEmail && (
                      <div className="absolute right-3 top-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-500 border-t-transparent"></div>
                      </div>
                    )}
                    {!validandoEmail && emailDisponible === true && validarEmail(clienteData.email).valido && (
                      <CheckCircle className="absolute right-3 top-3 h-5 w-5 text-green-500" />
                    )}
                    {!validandoEmail && (emailDisponible === false || !validarEmail(clienteData.email).valido) && clienteData.email && (
                      <AlertCircle className="absolute right-3 top-3 h-5 w-5 text-red-500" />
                    )}
                  </div>
                  {clienteData.email && !validarEmail(clienteData.email).valido && (
                    <p className="text-red-600 text-xs mt-1">{validarEmail(clienteData.email).mensaje}</p>
                  )}
                  {validarEmail(clienteData.email).valido && emailDisponible === false && (
                    <p className="text-red-600 text-xs mt-1">Este correo ya está registrado</p>
                  )}
                </div>

                {/* Contraseña */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={clienteData.password}
                    onChange={(e) => handleClienteChange('password', e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    minLength={6}
                  />
                  {clienteData.password && clienteData.password.length < 6 && (
                    <p className="text-red-600 text-xs mt-1">La contraseña debe tener al menos 6 caracteres</p>
                  )}
                </div>

                {/* Confirmar Contraseña */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Contraseña <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={clienteData.confirmPassword}
                    onChange={(e) => handleClienteChange('confirmPassword', e.target.value)}
                    placeholder="Repite tu contraseña"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                      clienteData.password && clienteData.confirmPassword && clienteData.password !== clienteData.confirmPassword
                        ? 'border-red-400' : 'border-gray-300'
                    }`}
                  />
                  {clienteData.password && clienteData.confirmPassword && clienteData.password !== clienteData.confirmPassword && (
                    <p className="text-red-600 text-xs mt-1">Las contraseñas no coinciden</p>
                  )}
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 flex items-center justify-center font-semibold transition-all"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Anterior
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!validateStep2() || loading || emailDisponible === false}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-400 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center font-semibold transition-all"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    ) : (
                      'Registrarse'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Botón de reset para testing */}
        {success && (
          <div className="mt-6 text-center">
            <button
              onClick={resetForm}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium underline transition-all"
            >
              Crear otro cliente
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClienteRegistroForm;
