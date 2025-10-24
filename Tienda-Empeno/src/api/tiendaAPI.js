import apiService from './apiService';

export const tiendaAPI = {
  // ========== CATÁLOGO ==========

  // Listar todos los productos del catálogo
  listarCatalogo: async () => {
    try {
      const response = await apiService.getPublic('/tienda/catalogo');
      return response;
    } catch (error) {
      console.error('Error al listar catálogo:', error);
      throw error;
    }
  },

  // Ver detalle de un producto
  verDetalleProducto: async (idProducto) => {
    try {
      const response = await apiService.getPublic(`/tienda/producto/${idProducto}`);
      return response;
    } catch (error) {
      console.error('Error al obtener detalle del producto:', error);
      throw error;
    }
  },

  // Ver valoraciones de un producto
  verValoracionesProducto: async (idProducto) => {
    try {
      const response = await apiService.getPublic(`/tienda/producto/${idProducto}/valoraciones`);
      return response;
    } catch (error) {
      console.error('Error al obtener valoraciones:', error);
      throw error;
    }
  },

  // ========== PEDIDOS ==========

  // Crear pedido
  crearPedido: async (pedidoData) => {
    try {
      const response = await apiService.post('/tienda/pedido/crear', pedidoData);
      return response;
    } catch (error) {
      console.error('Error al crear pedido:', error);
      throw error;
    }
  },

  // Pagar pedido
  pagarPedido: async (pagoData) => {
    try {
      const response = await apiService.post('/tienda/pedido/pagar', pagoData);
      return response;
    } catch (error) {
      console.error('Error al pagar pedido:', error);
      throw error;
    }
  },

  // Ver mis pedidos
  verMisPedidos: async () => {
    try {
      const response = await apiService.get('/tienda/mis-pedidos');
      return response;
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
      throw error;
    }
  },

  // Ver detalle de un pedido
  verDetallePedido: async (idPedido) => {
    try {
      const response = await apiService.get(`/tienda/pedido/${idPedido}`);
      return response;
    } catch (error) {
      console.error('Error al obtener detalle del pedido:', error);
      throw error;
    }
  },

  // Ver seguimiento de pedido
  verSeguimientoPedido: async (idPedido) => {
    try {
      const response = await apiService.get(`/tienda/pedido/${idPedido}/seguimiento`);
      return response;
    } catch (error) {
      console.error('Error al obtener seguimiento:', error);
      throw error;
    }
  },

  // ========== VALORACIONES ==========

  // Valorar producto
  valorarProducto: async (valoracionData) => {
    try {
      const response = await apiService.post('/tienda/producto/valorar', valoracionData);
      return response;
    } catch (error) {
      console.error('Error al valorar producto:', error);
      throw error;
    }
  }
};
