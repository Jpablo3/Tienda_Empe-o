import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X } from 'lucide-react';
import { articuloAPI } from '../api/articuloAPI';

const EmpenarArticulo = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tipoArticulo: '',
    estadoArticulo: 5,
    nombre: '',
    descripcion: '',
    precioSolicitado: '',
    imagenes: []
  });

  const [tiposArticulo, setTiposArticulo] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingTipos, setLoadingTipos] = useState(true);
  const [error, setError] = useState('');

  // Verificar sesión al montar el componente
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Guardar la ruta actual para regresar después del login
      localStorage.setItem('redirectAfterLogin', '/empenar');
      navigate('/login');
    }
  }, [navigate]);

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
    if (!formData.precioSolicitado) {
      setError('Por favor ingresa el precio solicitado');
      return;
    }
    if (formData.imagenes.length < 3) {
      setError('Por favor agrega mínimo 3 imágenes');
      return;
    }

    // Verificar si hay sesión activa
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Debes iniciar sesión para empeñar un artículo');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      return;
    }

    try {
      setLoading(true);

      const articuloData = {
        idTipoArticulo: parseInt(formData.tipoArticulo),
        nombreArticulo: formData.nombre,
        descripcionArticulo: formData.descripcion,
        estadoArticulo: formData.estadoArticulo,
        precioSolicitado: parseFloat(formData.precioSolicitado),
        imagenes: formData.imagenes
      };

      const response = await articuloAPI.registrarArticulo(articuloData);

      if (response.success || response) {
        setError('');
        setLoading(false);

        // Mostrar mensaje de éxito en verde
        const successMsg = document.createElement('div');
        successMsg.className = 'fixed top-20 left-1/2 -translate-x-1/2 bg-green-500 text-white px-8 py-4 rounded-lg shadow-lg text-xl font-bold z-50 animate-bounce';
        successMsg.textContent = 'El artículo se ha registrado exitosamente';
        document.body.appendChild(successMsg);

        // Limpiar formulario
        setFormData({
          tipoArticulo: '',
          estadoArticulo: 5,
          nombre: '',
          descripcion: '',
          precioSolicitado: '',
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
      console.error('Error al registrar artículo:', error);
      if (error.response?.status === 401) {
        setError('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else if (error.response?.status === 403) {
        setError('No tienes permisos para empeñar artículos');
      } else {
        setError(error.response?.data?.message || 'Error al registrar el artículo. Por favor intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Empeñar Artículo
        </h1>

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-white px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loadingTipos ? (
          <div className="text-white text-center py-8">
            <p className="text-xl">Cargando tipos de artículos...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tipo de Artículo */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">Tipo de Artículo</h2>
              <div className="space-y-3">
                {tiposArticulo.length === 0 ? (
                  <p className="text-white">No hay tipos de artículos disponibles</p>
                ) : (
                  tiposArticulo.map(tipo => (
                    <label key={tipo.idTipoArticulo} className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="tipoArticulo"
                        value={tipo.idTipoArticulo}
                        checked={formData.tipoArticulo === tipo.idTipoArticulo.toString()}
                        onChange={handleChange}
                        className="w-5 h-5 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-white text-lg group-hover:text-purple-300 transition-colors">
                        {tipo.nombreTipoArticulo}
                      </span>
                    </label>
                  ))
                )}
              </div>
            </div>

          {/* Estado del Artículo */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Estado del Artículo</h2>
            <div className="space-y-4">
              <div className="relative pt-8">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.estadoArticulo}
                  onChange={handleEstadoChange}
                  className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right,
                      rgb(220, 60, 60) 0%,
                      rgb(220, 120, 60) 25%,
                      rgb(200, 180, 60) 50%,
                      rgb(120, 200, 60) 75%,
                      rgb(40, 180, 60) 100%)`
                  }}
                />
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg"
                  style={{
                    backgroundColor: getEstadoColor(formData.estadoArticulo),
                    left: `${((formData.estadoArticulo - 1) / 9) * 100}%`
                  }}
                >
                  {formData.estadoArticulo}
                </div>
              </div>
              <div className="flex justify-between text-white text-sm mt-8">
                <span>Malo (1)</span>
                <span>Excelente (10)</span>
              </div>
            </div>
          </div>

          {/* Detalles */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Detalles</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: iPhone 12"
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-white mb-2">Descripción</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Describe detalles..."
                  rows="4"
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Precio e Imágenes */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Precio e Imágenes</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2">Precio Solicitado</label>
                <input
                  type="number"
                  name="precioSolicitado"
                  value={formData.precioSolicitado}
                  onChange={handleChange}
                  placeholder="Ej: 500"
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-white mb-2">Imágenes (mínimo 3)</label>
                <div className="border-2 border-dashed border-purple-400 rounded-lg p-6 text-center bg-white/5">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                    id="imageInput"
                  />
                  <label htmlFor="imageInput" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-purple-300 mx-auto mb-2" />
                    <p className="text-white text-sm">
                      Arrastra y suelta imágenes aquí o haz clic para seleccionar (mínimo 3)
                    </p>
                  </label>

                  {previewImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {previewImages.map((img, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={img}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => document.getElementById('imageInput').click()}
                    className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                  >
                    Seleccionar Imágenes
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Botón Confirmar */}
          <div className="md:col-span-2 flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-12 py-4 rounded-xl text-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Registrando...' : 'Confirmar Empeño'}
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
};

export default EmpenarArticulo;
