import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, User, DollarSign, Star, Mail } from 'lucide-react';
import HeaderAdmin from '../../components/HeaderAdmin';
import { adminAPI } from '../../api/adminAPI';

const ArticulosCompras = () => {
  const navigate = useNavigate();
  const [articulos, setArticulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarArticulos();
  }, []);

  const cargarArticulos = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await adminAPI.listarArticulosPendientesCompra();

      // El backend puede devolver un array directamente o dentro de .data
      const articulosData = Array.isArray(response) ? response : response.data || [];
      setArticulos(articulosData);
    } catch (error) {
      console.error('Error al cargar artículos:', error);
      setError('Error al cargar los artículos pendientes de compra');

      if (error.response?.status === 401 || error.response?.status === 403) {
        setTimeout(() => navigate('/login'), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluar = (articulo) => {
    // Por ahora solo mostramos un alert, luego crearemos un modal de evaluación
    alert(`Evaluar artículo para compra: ${articulo.nombreArticulo}\nID: ${articulo.idArticulo}`);
  };

  const getEstadoColor = (estado) => {
    const valor = parseInt(estado);
    const porcentaje = (valor - 1) / 9;
    const rojo = Math.round(220 - (porcentaje * 220));
    const verde = Math.round(porcentaje * 180);
    return `rgb(${rojo}, ${verde}, 60)`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <HeaderAdmin />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Botón Volver */}
        <button
          onClick={() => navigate('/admin')}
          className="mb-6 flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver al Panel</span>
        </button>

        {/* Título */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Artículos Pendientes de Compra
          </h1>
          <p className="text-gray-600">
            Revisa y evalúa los artículos que los clientes desean vender
          </p>
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Cargando artículos...</p>
          </div>
        ) : articulos.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No hay artículos pendientes
            </h3>
            <p className="text-gray-500">
              No hay artículos pendientes de compra en este momento
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articulos.map((articulo) => (
              <div
                key={articulo.idArticulo}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Imagen del Artículo */}
                {articulo.urlImagen ? (
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={`http://localhost:8080${articulo.urlImagen}`}
                      alt={articulo.nombreArticulo}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100"><svg class="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg></div>';
                      }}
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                    <Package className="w-16 h-16 text-blue-400" />
                  </div>
                )}

                {/* Contenido */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 truncate">
                    {articulo.nombreArticulo}
                  </h3>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {articulo.descripcion}
                  </p>

                  {/* Información del Cliente */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">{articulo.nombreCliente}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600 text-xs">{articulo.emailCliente}</span>
                    </div>
                  </div>

                  {/* Precio del Artículo */}
                  <div className="flex items-center space-x-2 mb-3">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-lg font-bold text-green-600">
                      ${parseFloat(articulo.precioArticulo).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  {/* Estado del Artículo */}
                  <div className="flex items-center space-x-2 mb-4">
                    <Star className="w-4 h-4" style={{ color: getEstadoColor(articulo.estadoArticulo) }} />
                    <span className="text-sm font-medium" style={{ color: getEstadoColor(articulo.estadoArticulo) }}>
                      Estado: {articulo.estadoArticulo}/10
                    </span>
                  </div>

                  {/* Tipo de Artículo */}
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                      {articulo.tipoArticulo}
                    </span>
                  </div>

                  {/* Botón Evaluar */}
                  <button
                    onClick={() => handleEvaluar(articulo)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    Evaluar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticulosCompras;
