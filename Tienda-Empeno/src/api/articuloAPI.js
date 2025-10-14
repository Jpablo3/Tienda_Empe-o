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

      // Crear FormData para enviar archivos
      const formData = new FormData();

      // Agregar las imágenes primero
      if (articuloData.imagenes && articuloData.imagenes.length > 0) {
        articuloData.imagenes.forEach((imagen) => {
          formData.append('imagenes', imagen);
        });
      }

      // Log para debugging
      console.log('Datos del artículo a enviar:', {
        idTipoArticulo: articuloData.idTipoArticulo,
        nombreArticulo: articuloData.nombreArticulo,
        descripcion: articuloData.descripcionArticulo,
        estadoArticulo: articuloData.estadoArticulo,
        precioArticulo: articuloData.precioSolicitado,
        cantidadImagenes: articuloData.imagenes?.length || 0
      });

      // Construir URL con query params (porque el backend usa @RequestParam)
      const params = new URLSearchParams({
        idTipoArticulo: articuloData.idTipoArticulo.toString(),
        nombreArticulo: articuloData.nombreArticulo,
        descripcion: articuloData.descripcionArticulo,
        estadoArticulo: articuloData.estadoArticulo.toString(),
        precioArticulo: articuloData.precioSolicitado.toString()
      });

      // Enviar FormData con params en la URL
      const response = await apiService.post(
        `/articulos/registrar?${params.toString()}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      return response;
    } catch (error) {
      console.error('Error completo al registrar artículo:', error);
      console.error('Error.response:', error.response);
      console.error('Error.response.data:', error.response?.data);
      console.error('Error.message:', error.message);
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
