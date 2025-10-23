import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error al cargar carrito:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Agregar producto al carrito
  const addToCart = (producto) => {
    setCart(prevCart => {
      // Verificar si el producto ya está en el carrito
      const existingItem = prevCart.find(item => item.idProductoTienda === producto.idProductoTienda);

      if (existingItem) {
        // Si ya existe, no hacer nada (artículos únicos)
        return prevCart;
      }

      // Agregar nuevo producto
      return [...prevCart, { ...producto, cantidad: 1 }];
    });
    setIsCartOpen(true); // Abrir el carrito al agregar
  };

  // Remover producto del carrito
  const removeFromCart = (idProductoTienda) => {
    setCart(prevCart => prevCart.filter(item => item.idProductoTienda !== idProductoTienda));
  };

  // Limpiar todo el carrito
  const clearCart = () => {
    setCart([]);
  };

  // Obtener cantidad total de items
  const getCartCount = () => {
    return cart.length;
  };

  // Obtener total del carrito
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + parseFloat(item.precioVentaTienda), 0);
  };

  // Verificar si un producto está en el carrito
  const isInCart = (idProductoTienda) => {
    return cart.some(item => item.idProductoTienda === idProductoTienda);
  };

  const value = {
    cart,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    clearCart,
    getCartCount,
    getCartTotal,
    isInCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
