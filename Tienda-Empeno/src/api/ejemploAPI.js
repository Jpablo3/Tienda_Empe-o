import apiService from './apiService';

// Ejemplo de funciones para consumir endpoints específicos de tu backend
// Puedes crear archivos separados por módulo (productos, usuarios, ventas, etc.)

export const ejemploAPI = {
  // Ejemplo: Obtener todos los productos
  obtenerProductos: async () => {
    return await apiService.get('/productos');
  },

  // Ejemplo: Obtener un producto por ID
  obtenerProductoPorId: async (id) => {
    return await apiService.get(`/productos/${id}`);
  },

  // Ejemplo: Crear un nuevo producto
  crearProducto: async (productoData) => {
    return await apiService.post('/productos', productoData);
  },

  // Ejemplo: Actualizar un producto
  actualizarProducto: async (id, productoData) => {
    return await apiService.put(`/productos/${id}`, productoData);
  },

  // Ejemplo: Eliminar un producto
  eliminarProducto: async (id) => {
    return await apiService.delete(`/productos/${id}`);
  },

  // Ejemplo: Login
  login: async (credenciales) => {
    return await apiService.post('/auth/login', credenciales);
  },
};

export default ejemploAPI;
