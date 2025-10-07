import apiService from './apiService';

export const tipoDocumentoAPI = {
  // Obtener todos los tipos de documento
  getTiposDocumento: async () => {
    try {
      return await apiService.get('/tipos-documento');
    } catch (error) {
      console.error('Error al obtener tipos de documento:', error);
      throw error;
    }
  }
};

export default tipoDocumentoAPI;
