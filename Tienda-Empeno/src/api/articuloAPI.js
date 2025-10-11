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

      const formData = new FormData();

      // Agregar datos del artículo
      formData.append('idTipoArticulo', articuloData.idTipoArticulo);
      formData.append('nombreArticulo', articuloData.nombreArticulo);
      formData.append('descripcion', articuloData.descripcionArticulo);
      formData.append('estadoArticulo', articuloData.estadoArticulo.toString());
      formData.append('precioArticulo', articuloData.precioSolicitado);

      // Agregar imágenes
      if (articuloData.imagenes && articuloData.imagenes.length > 0) {
        articuloData.imagenes.forEach((imagen) => {
          formData.append('imagenes', imagen);
        });
      }

      // Usar apiService.post directamente, el interceptor agregará el token
      const response = await apiService.post('/articulos/registrar', formData);

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
