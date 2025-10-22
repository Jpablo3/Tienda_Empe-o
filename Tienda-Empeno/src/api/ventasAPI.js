import apiClient from '../services/axiosConfig';

export const ventasAPI = {
  /**
   * Obtener todas las solicitudes de venta del cliente autenticado
   * @returns {Promise} Lista de ventas (pendientes, aprobadas y rechazadas)
   */
  listarMisVentas: async () => {
    try {
      const response = await apiClient.get('/compras/mis-solicitudes');
      return response.data;
    } catch (error) {
      console.error('Error al obtener mis ventas:', error);
      throw error;
    }
  }
};
