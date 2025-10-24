import apiService from './apiService';

export const adminAPI = {
  // ========== COMPRAS ==========

  // Listar artículos pendientes de compra
  listarArticulosPendientesCompra: async () => {
    try {
      const response = await apiService.get('/compras/articulos-pendientes');
      return response;
    } catch (error) {
      console.error('Error al listar artículos pendientes de compra:', error);
      throw error;
    }
  },

  // Crear solicitud de compra
  crearSolicitudCompra: async (idArticulo) => {
    try {
      const response = await apiService.post(`/compras/crear/${idArticulo}`);
      return response;
    } catch (error) {
      console.error('Error al crear solicitud de compra:', error);
      throw error;
    }
  },

  // Evaluar compra (aprobar/rechazar)
  evaluarCompra: async (idCompra, evaluacionData) => {
    try {
      const response = await apiService.put(`/compras/${idCompra}/evaluar`, evaluacionData);
      return response;
    } catch (error) {
      console.error('Error al evaluar compra:', error);
      throw error;
    }
  },

  // Listar todas las compras
  listarTodasLasCompras: async () => {
    try {
      const response = await apiService.get('/compras/todas');
      return response;
    } catch (error) {
      console.error('Error al listar todas las compras:', error);
      throw error;
    }
  },

  // ========== TIENDA ==========

  // Listar artículos para preparar (estado 9)
  listarArticulosParaPreparar: async () => {
    try {
      const response = await apiService.get('/tienda/admin/articulos-preparar');
      return response;
    } catch (error) {
      console.error('Error al listar artículos para preparar:', error);
      throw error;
    }
  },

  // Preparar producto para la tienda
  prepararProductoParaTienda: async (productoData) => {
    try {
      const response = await apiService.post('/tienda/admin/preparar-producto', productoData);
      return response;
    } catch (error) {
      console.error('Error al preparar producto para tienda:', error);
      throw error;
    }
  },

  // ========== PROMOCIONES ==========

  // Crear promoción
  crearPromocion: async (promocionData) => {
    try {
      const response = await apiService.post('/promociones/crear', promocionData);
      return response;
    } catch (error) {
      console.error('Error al crear promoción:', error);
      throw error;
    }
  },

  // Listar todas las promociones
  listarTodasPromociones: async () => {
    try {
      const response = await apiService.get('/promociones/admin/todas');
      return response;
    } catch (error) {
      console.error('Error al listar promociones:', error);
      throw error;
    }
  },

  // Actualizar promoción
  actualizarPromocion: async (idPromocion, promocionData) => {
    try {
      const response = await apiService.put(`/promociones/${idPromocion}`, promocionData);
      return response;
    } catch (error) {
      console.error('Error al actualizar promoción:', error);
      throw error;
    }
  },

  // Desactivar promoción
  desactivarPromocion: async (idPromocion) => {
    try {
      const response = await apiService.put(`/promociones/${idPromocion}/desactivar`);
      return response;
    } catch (error) {
      console.error('Error al desactivar promoción:', error);
      throw error;
    }
  },

  // Eliminar promoción
  eliminarPromocion: async (idPromocion) => {
    try {
      const response = await apiService.delete(`/promociones/${idPromocion}`);
      return response;
    } catch (error) {
      console.error('Error al eliminar promoción:', error);
      throw error;
    }
  }
};
