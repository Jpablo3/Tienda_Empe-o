import apiClient from '../services/axiosConfig';

export const contratosAPI = {
  /**
   * Obtener todos los contratos pendientes del cliente autenticado
   * @returns {Promise} Lista de contratos pendientes (estado 10)
   */
  listarContratosPendientes: async () => {
    try {
      const response = await apiClient.get('/contratos/mis-contratos-pendientes');
      return response.data;
    } catch (error) {
      console.error('Error al listar contratos pendientes:', error);
      throw error;
    }
  },

  /**
   * Obtener detalle completo de un contrato específico
   * @param {number} idContrato - ID del contrato
   * @returns {Promise} Detalle del contrato
   */
  obtenerContrato: async (idContrato) => {
    try {
      const response = await apiClient.get(`/contratos/${idContrato}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener contrato:', error);
      throw error;
    }
  },

  /**
   * Firmar un contrato con firma digital
   * @param {number} idContrato - ID del contrato a firmar
   * @param {string} firmaBase64 - Firma digital en formato Base64
   * @returns {Promise} Contrato firmado
   */
  firmarContrato: async (idContrato, firmaBase64) => {
    try {
      const response = await apiClient.put(`/contratos/${idContrato}/firmar`, {
        firmaCliente: firmaBase64
      });
      return response.data;
    } catch (error) {
      console.error('Error al firmar contrato:', error);
      throw error;
    }
  }
};
