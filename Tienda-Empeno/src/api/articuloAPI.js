import apiService from './apiService';

export const articuloAPI = {
  getTiposArticulosActivos: async () => {
    try {
      return await apiService.get('/articulos/tipos-activos');
    } catch (error) {
      console.error('Error al obtener tipos de artículos:', error);
      throw error;
    }
  },

  registrarArticulo: async (articuloData) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No hay sesión activa. Por favor inicia sesión.');
      }

      // Por ahora enviar como JSON en lugar de FormData
      // hasta que el backend esté configurado para recibir multipart/form-data
      const payload = {
        idTipoArticulo: articuloData.idTipoArticulo,
        nombreArticulo: articuloData.nombreArticulo,
        descripcion: articuloData.descripcionArticulo,
        estadoArticulo: articuloData.estadoArticulo.toString(),
        precioArticulo: articuloData.precioSolicitado,
        urlImagen: 'https://via.placeholder.com/400' // Placeholder temporal
      };

      const response = await apiService.post('/articulos/registrar', payload);

      return response;
    } catch (error) {
      console.error('Error al registrar artículo:', error);
      throw error;
    }
  },

  obtenerArticulosPorCliente: async (idCliente) => {
    try {
      return await apiService.get(`/articulos/cliente/${idCliente}`);
    } catch (error) {
      console.error('Error al obtener artículos del cliente:', error);
      throw error;
    }
  },

  obtenerArticuloPorId: async (idArticulo) => {
    try {
      return await apiService.get(`/articulos/${idArticulo}`);
    } catch (error) {
      console.error('Error al obtener artículo:', error);
      throw error;
    }
  },

  obtenerImagenesArticulo: async (idArticulo) => {
    try {
      return await apiService.get(`/articulos/${idArticulo}/imagenes`);
    } catch (error) {
      console.error('Error al obtener imágenes del artículo:', error);
      throw error;
    }
  }
};
