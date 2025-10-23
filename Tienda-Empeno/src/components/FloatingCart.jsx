import { X, ShoppingCart, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const FloatingCart = () => {
  const navigate = useNavigate();
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, getCartCount, getCartTotal } = useCart();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ'
    }).format(value);
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm animate-fade-in"
      />

      {/* Drawer del carrito */}
      <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out animate-slide-in-right">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ShoppingCart className="w-6 h-6 mr-3" />
              <div>
                <h2 className="text-xl font-bold">Mi Carrito</h2>
                <p className="text-sm text-purple-100">
                  {getCartCount()} {getCartCount() === 1 ? 'artículo' : 'artículos'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Contenido del carrito */}
        <div className="flex flex-col h-[calc(100%-theme(spacing.24)-theme(spacing.32))] overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-600 font-medium mb-2">Tu carrito está vacío</p>
              <p className="text-sm text-gray-500 mb-4">
                Explora nuestro catálogo y encuentra artículos únicos
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/tienda');
                }}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
              >
                Ir al Catálogo
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.idProductoTienda}
                  className="flex gap-4 bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  {/* Imagen */}
                  <div className="w-20 h-20 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                    {item.imagenes && item.imagenes[0] ? (
                      <img
                        src={`http://localhost:8080${item.imagenes[0]}`}
                        alt={item.nombreProducto}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingCart className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2 text-sm">
                      {item.nombreProducto}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">{item.tipoArticulo}</p>
                    <p className="font-bold text-purple-600">
                      {formatCurrency(item.precioVentaTienda)}
                    </p>
                  </div>

                  {/* Botón eliminar */}
                  <button
                    onClick={() => removeFromCart(item.idProductoTienda)}
                    className="flex-shrink-0 text-red-500 hover:bg-red-50 rounded-lg p-2 transition-colors"
                    title="Eliminar del carrito"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer con total y botón */}
        {cart.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-700">Total:</span>
              <span className="text-2xl font-bold text-purple-600">
                {formatCurrency(getCartTotal())}
              </span>
            </div>
            <button
              onClick={() => {
                setIsCartOpen(false);
                navigate('/tienda/checkout');
              }}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
            >
              Proceder al Pago
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default FloatingCart;
