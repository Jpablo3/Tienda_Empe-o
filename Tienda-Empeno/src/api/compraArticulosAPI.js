import apiService from './apiService';

export const compraArticulosAPI = {
  registrarArticuloVender: async (articuloData) => {
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
      console.log('Datos del artículo a vender:', {
        idTipoArticulo: articuloData.idTipoArticulo,
        nombreArticulo: articuloData.nombreArticulo,
        descripcion: articuloData.descripcion,
        estadoArticulo: articuloData.estadoArticulo,
        precioArticulo: articuloData.precioArticulo,
        cantidadImagenes: articuloData.imagenes?.length || 0
      });

      // Construir URL con query params
      const params = new URLSearchParams({
        idTipoArticulo: articuloData.idTipoArticulo.toString(),
        nombreArticulo: articuloData.nombreArticulo,
        descripcion: articuloData.descripcion,
        estadoArticulo: articuloData.estadoArticulo.toString(),
        precioArticulo: articuloData.precioArticulo.toString()
      });

      // Enviar FormData con params en la URL
      const response = await apiService.post(
        `/compras/registrar-articulo-vender?${params.toString()}`,
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
