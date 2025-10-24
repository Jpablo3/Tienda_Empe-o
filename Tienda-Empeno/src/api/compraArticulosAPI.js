import apiService from './apiService';

export const compraArticulosAPI = {
  registrarArticuloVender: async (articuloData) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No hay sesión activa. Por favor inicia sesión.');
      }

      // Crear FormData para enviar archivos Y datos
      const formData = new FormData();

      // Agregar los datos del artículo como campos del FormData
      formData.append('idTipoArticulo', articuloData.idTipoArticulo.toString());
      formData.append('nombreArticulo', articuloData.nombreArticulo);
      formData.append('descripcion', articuloData.descripcion);
      formData.append('estadoArticulo', articuloData.estadoArticulo.toString());
      formData.append('precioArticulo', articuloData.precioArticulo.toString());

      // Agregar las imágenes
      if (articuloData.imagenes && articuloData.imagenes.length > 0) {
        articuloData.imagenes.forEach((imagen) => {
          formData.append('imagenes', imagen);
        });
      }

      // Log para debugging
      console.log('Datos del artículo a vender:', {
        idTipoArticulo: articuloData.idTipoArticulo,
        nombreArticulo: articuloData.nombreArticulo,
        descripcion: articuloData.descripcion,
        estadoArticulo: articuloData.estadoArticulo,
        precioArticulo: articuloData.precioArticulo,
        cantidadImagenes: articuloData.imagenes?.length || 0
      });

      // Enviar FormData (sin params en la URL, todo va en el FormData)
      const response = await apiService.post(
        `/compras/registrar-articulo-vender`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      return response;
    } catch (error) {
      console.error('Error completo al registrar artículo para venta:', error);
      console.error('Error.response:', error.response);
      console.error('Error.response.data:', error.response?.data);
      console.error('Error.message:', error.message);
      throw error;
    }
  }
};
