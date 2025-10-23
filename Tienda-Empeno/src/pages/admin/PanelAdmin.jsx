import { useNavigate } from 'react-router-dom';
import { DollarSign, ShoppingCart, Store } from 'lucide-react';
import HeaderAdmin from '../../components/HeaderAdmin';

const PanelAdmin = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      <HeaderAdmin />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
            Panel de Administración
          </h2>
          <p className="text-gray-600 text-lg">
            Gestiona préstamos, compras y tienda
          </p>
        </div>

        {/* Botones Principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Botón Préstamos */}
          <button
            onClick={() => navigate('/admin/prestamos')}
            className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative p-12 flex flex-col items-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-6 group-hover:bg-white transition-all duration-300 shadow-lg">
                <DollarSign className="w-12 h-12 text-white group-hover:text-purple-600 transition-colors duration-300" />
              </div>

              <h3 className="text-2xl font-bold text-gray-800 group-hover:text-white transition-colors duration-300 mb-2">
                Préstamos
              </h3>

              <p className="text-gray-600 group-hover:text-purple-100 transition-colors duration-300 text-center">
                Gestiona artículos solicitados para empeño
              </p>

              <div className="mt-6 px-6 py-2 bg-purple-100 group-hover:bg-white/20 rounded-full transition-colors duration-300">
                <span className="text-sm font-semibold text-purple-700 group-hover:text-white">
                  Ver Artículos →
                </span>
              </div>
            </div>
          </button>

          {/* Botón Compras */}
          <button
            onClick={() => navigate('/admin/compras')}
            className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative p-12 flex flex-col items-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:bg-white transition-all duration-300 shadow-lg">
                <ShoppingCart className="w-12 h-12 text-white group-hover:text-blue-600 transition-colors duration-300" />
              </div>

              <h3 className="text-2xl font-bold text-gray-800 group-hover:text-white transition-colors duration-300 mb-2">
                Compras
              </h3>

              <p className="text-gray-600 group-hover:text-blue-100 transition-colors duration-300 text-center">
                Gestiona artículos pendientes de compra
              </p>

              <div className="mt-6 px-6 py-2 bg-blue-100 group-hover:bg-white/20 rounded-full transition-colors duration-300">
                <span className="text-sm font-semibold text-blue-700 group-hover:text-white">
                  Ver Artículos →
                </span>
              </div>
            </div>
          </button>

          {/* Botón Tienda */}
          <button
            onClick={() => navigate('/admin/tienda')}
            className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative p-12 flex flex-col items-center">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mb-6 group-hover:bg-white transition-all duration-300 shadow-lg">
                <Store className="w-12 h-12 text-white group-hover:text-emerald-600 transition-colors duration-300" />
              </div>

              <h3 className="text-2xl font-bold text-gray-800 group-hover:text-white transition-colors duration-300 mb-2">
                Tienda
              </h3>

              <p className="text-gray-600 group-hover:text-emerald-100 transition-colors duration-300 text-center">
                Prepara artículos para venta en tienda
              </p>

              <div className="mt-6 px-6 py-2 bg-emerald-100 group-hover:bg-white/20 rounded-full transition-colors duration-300">
                <span className="text-sm font-semibold text-emerald-700 group-hover:text-white">
                  Ver Artículos →
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Información Adicional */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            Instrucciones:
          </h4>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3"></span>
              <span><strong>Préstamos:</strong> Revisa y evalúa solicitudes de préstamo sobre artículos empeñados</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
              <span><strong>Compras:</strong> Evalúa artículos que los clientes desean vender a la tienda</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3"></span>
              <span><strong>Tienda:</strong> Prepara artículos aprobados para publicar en la tienda virtual</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PanelAdmin;
