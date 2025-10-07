import axios from 'axios';

/**
 * ═══════════════════════════════════════════════════════════════════
 * CONFIGURACIÓN CENTRALIZADA DE AXIOS
 * ═══════════════════════════════════════════════════════════════════
 * Este archivo configura una instancia de Axios con configuraciones
 * globales para todas las peticiones HTTP de la aplicación.
 *
 * ¿QUÉ HACE?
 * - Centraliza la URL base del backend
 * - Agrega automáticamente tokens de autenticación
 * - Maneja errores de forma global
 * - Configura timeouts y headers por defecto
 *
 * ¿QUÉ PUEDES IMPLEMENTAR AQUÍ?
 * - Refresh tokens automático cuando el token expire
 * - Logger de peticiones para debugging
 * - Encriptación de datos sensibles antes de enviar
 * - Manejo de errores de red (sin conexión)
 * - Rate limiting / throttling de peticiones
 * - Retry automático en caso de fallos
 * ═══════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────
// CREACIÓN DE INSTANCIA DE AXIOS
// ─────────────────────────────────────────────────────────────────
// Crea una instancia personalizada de axios con configuración base
const axiosInstance = axios.create({
  // URL base del backend (se obtiene de variables de entorno)
  // Cambia VITE_API_URL en el archivo .env según tu backend
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',

  // Timeout máximo para las peticiones (10 segundos)
  // Si una petición tarda más, se cancela automáticamente
  timeout: 10000,

  // Headers por defecto que se envían en TODAS las peticiones
  headers: {
    'Content-Type': 'application/json', // Todas las peticiones envían JSON
  },
});

// ─────────────────────────────────────────────────────────────────
// INTERCEPTOR DE REQUEST (PETICIONES SALIENTES)
// ─────────────────────────────────────────────────────────────────
// Se ejecuta ANTES de enviar cada petición al servidor
// Útil para agregar headers, tokens, logging, etc.
axiosInstance.interceptors.request.use(
  (config) => {
    // Obtener el token de autenticación del localStorage
    // (se guarda cuando el usuario hace login)
    const token = localStorage.getItem('token');

    // Si existe un token, agregarlo al header Authorization
    // El backend validará este token en cada petición protegida
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // AQUÍ PUEDES IMPLEMENTAR:
    // - Agregar idioma del usuario: config.headers['Accept-Language'] = 'es';
    // - Agregar ID de dispositivo para analytics
    // - Encriptar el body de la petición antes de enviar
    // - Console.log para debugging en desarrollo

    return config;
  },
  (error) => {
    // Si hay error en la configuración de la petición
    // (muy raro, pero puede pasar)
    return Promise.reject(error);
  }
);

// ─────────────────────────────────────────────────────────────────
// INTERCEPTOR DE RESPONSE (RESPUESTAS ENTRANTES)
// ─────────────────────────────────────────────────────────────────
// Se ejecuta DESPUÉS de recibir la respuesta del servidor
// Útil para manejar errores globales, refresh tokens, logging, etc.
axiosInstance.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa (status 200-299), retornarla tal cual

    // AQUÍ PUEDES IMPLEMENTAR:
    // - Desencriptar respuestas encriptadas
    // - Guardar logs de respuestas exitosas
    // - Extraer y guardar nuevos tokens del header

    return response;
  },
  (error) => {
    // ─── MANEJO DE ERRORES GLOBALES ───

    // Si el usuario no está autenticado (401 Unauthorized)
    if (error.response?.status === 401) {
      // Eliminar el token inválido/expirado
      localStorage.removeItem('token');

      // Redirigir a la página de login
      window.location.href = '/login';

      // AQUÍ PUEDES IMPLEMENTAR:
      // - Intentar refresh token antes de redirigir
      // - Mostrar un toast/notificación al usuario
      // - Guardar la URL actual para redirigir después del login
    }

    // OTROS ERRORES QUE PUEDES MANEJAR:
    // - 403 Forbidden: Usuario sin permisos
    // - 404 Not Found: Recurso no encontrado
    // - 500 Server Error: Error del servidor
    // - Network Error: Sin conexión a internet
    // - Timeout: Petición tardó demasiado

    // Ejemplo de manejo de más errores:
    // if (error.response?.status === 403) {
    //   alert('No tienes permisos para esta acción');
    // }
    // if (error.response?.status === 500) {
    //   console.error('Error del servidor:', error);
    // }
    // if (error.code === 'ECONNABORTED') {
    //   alert('La petición tardó demasiado');
    // }

    return Promise.reject(error);
  }
);

// Exportar la instancia configurada para usarla en otros archivos
export default axiosInstance;
