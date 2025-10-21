import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, DollarSign, Package } from 'lucide-react';
import { articuloAPI } from '../api/articuloAPI';
import { compraArticulosAPI } from '../api/compraArticulosAPI';
import Header from '../components/Header';

const VenderArticulo = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tipoArticulo: '',
    estadoArticulo: 5,
    nombre: '',
    descripcion: '',
    precio: '',
    imagenes: []
  });

  const [tiposArticulo, setTiposArticulo] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingTipos, setLoadingTipos] = useState(true);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Cargar tipos de artículos al montar el componente
  useEffect(() => {
    const cargarTiposArticulos = async () => {
      try {
        setLoadingTipos(true);
        const response = await articuloAPI.getTiposArticulosActivos();
        // El backend devuelve directamente el array
        if (Array.isArray(response)) {
          setTiposArticulo(response);
        } else if (response.success && response.data) {
          setTiposArticulo(response.data);
        }
      } catch (error) {
        console.error('Error al cargar tipos de artículos:', error);
        setError('Error al cargar los tipos de artículos');
      } finally {
        setLoadingTipos(false);
      }
    };

    cargarTiposArticulos();
  }, []);

  const getEstadoLabel = (valor) => {
    if (valor <= 3) return 'Usado - Requiere reparación';
    if (valor <= 5) return 'Usado - Funcional';
    if (valor <= 7) return 'Buen estado';
    if (valor <= 9) return 'Muy buen estado';
    return 'Excelente - Como nuevo';
  };

  const getEstadoColor = (valor) => {
    // Degradado de rojo (1) a verde (10)
    const porcentaje = (valor - 1) / 9;
    const rojo = Math.round(220 - (porcentaje * 220));
    const verde = Math.round(porcentaje * 180);
    return `rgb(${rojo}, ${verde}, 60)`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEstadoChange = (e) => {
    setFormData(prev => ({
      ...prev,
      estadoArticulo: parseInt(e.target.value)
    }));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);

    if (previewImages.length + files.length > 10) {
      alert('Máximo 10 imágenes permitidas');
      return;
    }

    // Validar tipo de archivos
    const invalidFiles = files.filter(file => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      alert('Por favor selecciona solo archivos de imagen');
      return;
    }

    // Crear previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...newPreviews]);
    setFormData(prev => ({
      ...prev,
      imagenes: [...prev.imagenes, ...files]
    }));
  };

  const removeImage = (index) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, i) => i !== index)
    }));
  };

  // Drag & Drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);

    if (previewImages.length + files.length > 10) {
      alert('Máximo 10 imágenes permitidas');
      return;
    }

    // Validar tipo de archivos
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    if (validFiles.length !== files.length) {
      alert('Algunos archivos no son imágenes y fueron omitidos');
    }

    if (validFiles.length === 0) return;

    // Crear previews
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...newPreviews]);
    setFormData(prev => ({
      ...prev,
      imagenes: [...prev.imagenes, ...validFiles]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!formData.tipoArticulo) {
      setError('Por favor selecciona el tipo de artículo');
      return;
    }
    if (!formData.nombre.trim()) {
      setError('Por favor ingresa el nombre del artículo');
      return;
    }
    if (!formData.descripcion.trim()) {
      setError('Por favor ingresa la descripción del artículo');
      return;
    }
    if (!formData.precio) {
      setError('Por favor ingresa el precio');
      return;
    }
    if (formData.imagenes.length < 3) {
      setError('Por favor agrega mínimo 3 imágenes del artículo');
      return;
    }

    // Verificar si hay sesión activa
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Debes iniciar sesión para vender un artículo');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      return;
    }

    try {
      setLoading(true);

      // Preparar datos para envío
      const articuloData = {
        idTipoArticulo: parseInt(formData.tipoArticulo),
        nombreArticulo: formData.nombre,
        descripcion: formData.descripcion,
        estadoArticulo: formData.estadoArticulo.toString(),
        precioArticulo: parseFloat(formData.precio),
        imagenes: formData.imagenes // Enviar archivos directamente
      };

      const response = await compraArticulosAPI.registrarArticuloVender(articuloData);

      if (response.success || response) {
        setError('');
        setLoading(false);

        // Mostrar mensaje de éxito en verde
        const successMsg = document.createElement('div');
        successMsg.className = 'fixed top-20 left-1/2 -translate-x-1/2 bg-green-500 text-white px-8 py-4 rounded-lg shadow-lg text-xl font-bold z-50 animate-bounce';
        successMsg.textContent = '¡Artículo registrado para venta exitosamente!';
        document.body.appendChild(successMsg);

        // Limpiar formulario
        setFormData({
          tipoArticulo: '',
          estadoArticulo: 5,
          nombre: '',
          descripcion: '',
          precio: '',
          imagenes: []
        });
        setPreviewImages([]);

        // Remover mensaje y redirigir después de 3 segundos
        setTimeout(() => {
          document.body.removeChild(successMsg);
          navigate('/');
        }, 3000);
        return;
      }
    } catch (error) {
      console.error('Error al registrar artículo para venta:', error);
      if (error.response?.status === 401) {
        setError('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else if (error.response?.status === 403) {
        setError('No tienes permisos para vender artículos');
      } else {
        setError(error.response?.data?.message || 'Error al registrar el artículo. Por favor intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      {/* Header */}
      <Header />

      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full mb-4">
            <DollarSign className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Vender Artículo
          </h1>
          <p className="text-gray-600">Completa los datos de tu artículo para ponerlo a la venta</p>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loadingTipos ? (
          <div className="text-center py-8">
            <p className="text-xl text-gray-700">Cargando tipos de artículos...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Card Principal */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-purple-100">
              {/* Tipo de Artículo - Dropdown estilo moderno */}
              <div className="mb-8">
                <label className="flex items-center text-lg font-semibold text-gray-800 mb-3">
                  <Package className="w-5 h-5 mr-2 text-purple-600" />
                  Tipo de Artículo
                </label>
                <select
                  name="tipoArticulo"
                  value={formData.tipoArticulo}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl text-gray-800 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  <option value="">Selecciona una categoría</option>
                  {tiposArticulo.map(tipo => (
                    <option key={tipo.idTipoArticulo} value={tipo.idTipoArticulo}>
                      {tipo.nombreTipoArticulo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Columna Izquierda - Detalles */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nombre del Artículo
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Ej: MacBook Pro 2023"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Descripción
                    </label>
                    <textarea
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleChange}
                      placeholder="Describe las características y condición de tu artículo..."
                      rows="5"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Precio de Venta (GTQ)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg font-bold">Q</span>
                      <input
                        type="number"
                        name="precio"
                        value={formData.precio}
                        onChange={handleChange}
                        placeholder="0.00"
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Columna Derecha - Estado e Imagen */}
                <div className="space-y-6">
                  {/* Estado del Artículo - Estilo circular */}
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border-2 border-purple-200">
                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                      Estado del Artículo
                    </label>

                    <div className="flex items-center justify-center mb-4">
                      <div
                        className="w-32 h-32 rounded-full flex flex-col items-center justify-center shadow-lg transition-all duration-300"
                        style={{ backgroundColor: getEstadoColor(formData.estadoArticulo) }}
                      >
                        <span className="text-4xl font-bold text-white">{formData.estadoArticulo}</span>
                        <span className="text-xs text-white/90 mt-1">de 10</span>
                      </div>
                    </div>

                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={formData.estadoArticulo}
                      onChange={handleEstadoChange}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer mb-2"
                      style={{
                        background: `linear-gradient(to right,
                          rgb(220, 60, 60) 0%,
                          rgb(220, 120, 60) 25%,
                          rgb(200, 180, 60) 50%,
                          rgb(120, 200, 60) 75%,
                          rgb(40, 180, 60) 100%)`
                      }}
                    />

                    <p className="text-center text-sm font-medium text-gray-700 mt-3">
                      {getEstadoLabel(formData.estadoArticulo)}
                    </p>
                  </div>

                  {/* Imágenes */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Imágenes del Artículo (mínimo 3)
                    </label>

                    <div
                      className={`border-3 border-dashed rounded-2xl p-6 text-center transition-all ${
                        isDragging
                          ? 'border-purple-500 bg-purple-100'
                          : 'border-purple-300 bg-gradient-to-br from-purple-50/50 to-blue-50/50 hover:border-purple-400'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageSelect}
                        className="hidden"
                        id="imageInput"
                      />
                      <label htmlFor="imageInput" className="cursor-pointer">
                        <Upload className="w-12 h-12 text-purple-400 mx-auto mb-2" />
                        <p className="text-gray-600 text-sm font-medium">
                          {isDragging ? 'Suelta las imágenes aquí' : 'Arrastra imágenes o haz clic para seleccionar'}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          PNG, JPG - Mínimo 3, máximo 10
                        </p>
                      </label>

                      {previewImages.length > 0 && (
                        <div className="mt-4 grid grid-cols-3 gap-2">
                          {previewImages.map((img, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={img}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg shadow-md"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
                              >
                                <X className="w-3 h-3 text-white" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <p className="text-xs text-gray-500 mt-3">
                        {previewImages.length} / 10 imágenes
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Botón Enviar */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-16 py-5 rounded-2xl text-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registrando...
                  </span>
                ) : (
                  'Solicitar Venta'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default VenderArticulo;
