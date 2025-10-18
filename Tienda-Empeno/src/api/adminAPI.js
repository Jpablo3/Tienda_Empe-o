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
  }
};
