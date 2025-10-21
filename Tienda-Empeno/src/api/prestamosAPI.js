import apiService from './apiService';

export const prestamosAPI = {
  // Listar artículos solicitados (estado = 1)
  listarArticulosSolicitados: async () => {
    try {
      const response = await apiService.get('/prestamos/articulos-solicitados');
      return response;
    } catch (error) {
      console.error('Error al listar artículos solicitados:', error);
      throw error;
    }
  },

  // Crear préstamo (iniciar evaluación)
  crearPrestamo: async (prestamoData) => {
    try {
      const response = await apiService.post('/prestamos/crear', prestamoData);
      return response;
    } catch (error) {
      console.error('Error al crear préstamo:', error);
      throw error;
    }
  },

  // Evaluar préstamo (aprobar/rechazar)
  evaluarPrestamo: async (idPrestamo, evaluacionData) => {
    try {
      const response = await apiService.put(`/prestamos/${idPrestamo}/evaluar`, evaluacionData);
      return response;
    } catch (error) {
      console.error('Error al evaluar préstamo:', error);
      throw error;
    }
  },

  // Listar todos los préstamos
  listarPrestamos: async () => {
    try {
      const response = await apiService.get('/prestamos');
      return response;
    } catch (error) {
      console.error('Error al listar préstamos:', error);
      throw error;
    }
  },

  // Obtener préstamo por ID
  obtenerPrestamoPorId: async (idPrestamo) => {
    try {
      const response = await apiService.get(`/prestamos/${idPrestamo}`);
      return response;
    } catch (error) {
      console.error('Error al obtener préstamo:', error);
      throw error;
    }
  },

  // Listar préstamos activos del cliente (estado 5)
  listarMisPrestamosActivos: async () => {
    try {
      // Este endpoint necesita ser creado en el backend
      // Por ahora retornará error, pero la estructura está lista
      const response = await apiService.get('/prestamos/mis-prestamos-activos');
      return response;
    } catch (error) {
      console.error('Error al listar préstamos activos:', error);
      throw error;
    }
  }
};
