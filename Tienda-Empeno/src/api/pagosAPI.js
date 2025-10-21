import apiClient from '../services/axiosConfig';

export const pagosAPI = {
  /**
   * Realizar un pago con tarjeta de crédito/débito
   * @param {Object} datosPago - Datos del pago
   * @param {number} datosPago.idPrestamo - ID del préstamo
   * @param {string} datosPago.numeroTarjeta - Número de tarjeta (16 dígitos)
   * @param {string} datosPago.fechaExpiracion - Fecha MM/YY
   * @param {string} datosPago.cvv - CVV de la tarjeta
   * @param {string} datosPago.nombreTitular - Nombre del titular
   * @returns {Promise} Factura generada
   */
  pagarConTarjeta: async (datosPago) => {
    try {
      const response = await apiClient.post('/pagos/tarjeta', {
        idPrestamo: datosPago.idPrestamo,
        numeroTarjeta: datosPago.numeroTarjeta,
        fechaExpiracion: datosPago.fechaExpiracion,
        cvv: datosPago.cvv,
        nombreTitular: datosPago.nombreTitular
      });
      return response.data;
    } catch (error) {
      console.error('Error al pagar con tarjeta:', error);
      throw error;
    }
  },

  /**
   * Solicitar pago en efectivo (genera cobranza)
   * @param {number} idPrestamo - ID del préstamo
   * @returns {Promise} Cobranza generada
   */
  pagarEnEfectivo: async (idPrestamo) => {
    try {
      const response = await apiClient.post('/pagos/efectivo', {
        idPrestamo
      });
      return response.data;
    } catch (error) {
      console.error('Error al solicitar pago en efectivo:', error);
      throw error;
    }
  },

  /**
   * Obtener historial de cobranzas del cliente
   * @returns {Promise} Lista de cobranzas
   */
  listarCobranzas: async () => {
    try {
      const response = await apiClient.get('/pagos/mis-cobranzas');
      return response.data;
    } catch (error) {
      console.error('Error al listar cobranzas:', error);
      throw error;
    }
  }
};
