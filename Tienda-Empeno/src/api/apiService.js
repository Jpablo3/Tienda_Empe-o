import axiosInstance from '../services/axiosConfig';

/**
 * ═══════════════════════════════════════════════════════════════════
 * SERVICIO GENÉRICO DE API
 * ═══════════════════════════════════════════════════════════════════
 * Wrapper (envoltorio) para todas las peticiones HTTP de la aplicación.
 * Simplifica el uso de axios y centraliza el manejo de errores.
 *
 * ¿QUÉ HACE?
 * - Proporciona métodos simples para GET, POST, PUT, DELETE, PATCH
 * - Extrae automáticamente response.data (no tienes que hacerlo manualmente)
 * - Maneja errores de forma consistente
 *
 * ¿CÓMO USARLO?
 * import apiService from './api/apiService';
 * const productos = await apiService.get('/productos');
 * const nuevoProducto = await apiService.post('/productos', { nombre: 'X' });
 *
 * ¿QUÉ PUEDES IMPLEMENTAR AQUÍ?
 * - Método para subir archivos (uploadFile)
 * - Método para descargar archivos (downloadFile)
 * - Caché de respuestas para evitar peticiones duplicadas
 * - Queue de peticiones cuando hay problemas de red
 * - Métricas de performance (cuánto tarda cada petición)
 * ═══════════════════════════════════════════════════════════════════
 */

const apiService = {
  /**
   * ────────────────────────────────────────────────────────
   * GET - Obtener datos del servidor
   * ────────────────────────────────────────────────────────
   * Usado para: Listar, buscar, filtrar datos
   *
   * @param {string} endpoint - Ruta del endpoint (ej: '/productos')
   * @param {object} params - Parámetros de query (ej: { page: 1, limit: 10 })
   * @returns {Promise} - Los datos del servidor (ya extraído de response.data)
   *
   * EJEMPLO DE USO:
   * const productos = await apiService.get('/productos');
   * const producto = await apiService.get('/productos/5');
   * const filtrados = await apiService.get('/productos', { categoria: 'joyas' });
   */
  get: async (endpoint, params = {}) => {
    try {
      // Hace la petición GET con los parámetros de query
      const response = await axiosInstance.get(endpoint, { params });

      // Retorna solo los datos (sin headers ni status)
      return response.data;
    } catch (error) {
      // Log del error para debugging
      console.error('Error en GET:', error);

      // Re-lanza el error para que el componente lo maneje
      throw error;
    }
  },

  /**
   * ────────────────────────────────────────────────────────
   * POST - Crear nuevos recursos en el servidor
   * ────────────────────────────────────────────────────────
   * Usado para: Crear registros, login, registro de usuarios
   *
   * @param {string} endpoint - Ruta del endpoint (ej: '/productos')
   * @param {object} data - Datos a enviar en el body (ej: { nombre: 'Anillo' })
   * @returns {Promise} - Respuesta del servidor (generalmente el recurso creado)
   *
   * EJEMPLO DE USO:
   * const nuevoProducto = await apiService.post('/productos', {
   *   nombre: 'Reloj',
   *   precio: 500
   * });
   * const login = await apiService.post('/auth/login', {
   *   email: 'user@email.com',
   *   password: '123456'
   * });
   */
  post: async (endpoint, data) => {
    try {
      // Hace la petición POST enviando los datos en el body
      const response = await axiosInstance.post(endpoint, data);
      return response.data;
    } catch (error) {
      console.error('Error en POST:', error);
      throw error;
    }
  },

  /**
   * ────────────────────────────────────────────────────────
   * PUT - Actualizar recursos completos en el servidor
   * ────────────────────────────────────────────────────────
   * Usado para: Actualizar TODO el registro (reemplaza todos los campos)
   *
   * @param {string} endpoint - Ruta del endpoint (ej: '/productos/5')
   * @param {object} data - Datos completos del recurso actualizado
   * @returns {Promise} - Recurso actualizado
   *
   * EJEMPLO DE USO:
   * const productoActualizado = await apiService.put('/productos/5', {
   *   nombre: 'Reloj Actualizado',
   *   precio: 600,
   *   stock: 10
   * });
   *
   * DIFERENCIA CON PATCH:
   * PUT → Reemplaza TODO el recurso (debes enviar todos los campos)
   * PATCH → Actualiza solo campos específicos
   */
  put: async (endpoint, data) => {
    try {
      const response = await axiosInstance.put(endpoint, data);
      return response.data;
    } catch (error) {
      console.error('Error en PUT:', error);
      throw error;
    }
  },

  /**
   * ────────────────────────────────────────────────────────
   * DELETE - Eliminar recursos del servidor
   * ────────────────────────────────────────────────────────
   * Usado para: Borrar registros, cancelar operaciones
   *
   * @param {string} endpoint - Ruta del endpoint (ej: '/productos/5')
   * @returns {Promise} - Confirmación de eliminación
   *
   * EJEMPLO DE USO:
   * await apiService.delete('/productos/5');
   * await apiService.delete('/usuarios/10');
   */
  delete: async (endpoint) => {
    try {
      const response = await axiosInstance.delete(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error en DELETE:', error);
      throw error;
    }
  },

  /**
   * ────────────────────────────────────────────────────────
   * PATCH - Actualizar campos específicos de un recurso
   * ────────────────────────────────────────────────────────
   * Usado para: Actualizar solo algunos campos (no todo el registro)
   *
   * @param {string} endpoint - Ruta del endpoint (ej: '/productos/5')
   * @param {object} data - Solo los campos a actualizar
   * @returns {Promise} - Recurso actualizado
   *
   * EJEMPLO DE USO:
   * // Solo actualiza el precio (no necesitas enviar nombre, stock, etc.)
   * const productoActualizado = await apiService.patch('/productos/5', {
   *   precio: 550
   * });
   *
   * DIFERENCIA CON PUT:
   * PUT → Reemplaza TODO el recurso
   * PATCH → Actualiza solo los campos enviados
   */
  patch: async (endpoint, data) => {
    try {
      const response = await axiosInstance.patch(endpoint, data);
      return response.data;
    } catch (error) {
      console.error('Error en PATCH:', error);
      throw error;
    }
  },

  // ═══════════════════════════════════════════════════════════════════
  // MÉTODOS ADICIONALES QUE PUEDES IMPLEMENTAR
  // ═══════════════════════════════════════════════════════════════════

  /**
   * SUBIR ARCHIVOS (ejemplo)
   * uploadFile: async (endpoint, file) => {
   *   const formData = new FormData();
   *   formData.append('file', file);
   *   const response = await axiosInstance.post(endpoint, formData, {
   *     headers: { 'Content-Type': 'multipart/form-data' }
   *   });
   *   return response.data;
   * },
   */

  /**
   * DESCARGAR ARCHIVOS (ejemplo)
   * downloadFile: async (endpoint, filename) => {
   *   const response = await axiosInstance.get(endpoint, {
   *     responseType: 'blob'
   *   });
   *   const url = window.URL.createObjectURL(new Blob([response.data]));
   *   const link = document.createElement('a');
   *   link.href = url;
   *   link.setAttribute('download', filename);
   *   document.body.appendChild(link);
   *   link.click();
   *   link.remove();
   * },
   */

  /**
   * PETICIÓN CON RETRY AUTOMÁTICO (ejemplo)
   * getWithRetry: async (endpoint, maxRetries = 3) => {
   *   for (let i = 0; i < maxRetries; i++) {
   *     try {
   *       return await apiService.get(endpoint);
   *     } catch (error) {
   *       if (i === maxRetries - 1) throw error;
   *       await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
   *     }
   *   }
   * },
   */
};

export default apiService;
