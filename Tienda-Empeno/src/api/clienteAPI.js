import apiService from './apiService';

// Datos mock para desarrollo (eliminar cuando el backend esté listo)
const USAR_DATOS_MOCK = false; // Cambiar a false cuando tu backend esté corriendo

const emailsRegistradosMock = ['test@test.com', 'admin@ejemplo.com'];

// API para manejar operaciones de clientes
export const clienteAPI = {
  // Registrar dirección
  registrarDireccion: async (direccionData) => {
    try {
      return await apiService.post('/clientes/direccion', direccionData);
    } catch (error) {
      console.error('Error al registrar dirección:', error);
      throw error;
    }
  },

  // Registrar un nuevo cliente
  registrarCliente: async (clienteData) => {
    try {
      if (USAR_DATOS_MOCK) {
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simular respuesta exitosa
        return {
          id: Math.floor(Math.random() * 1000),
          mensaje: 'Cliente registrado exitosamente',
          cliente: clienteData
        };
      }
      return await apiService.post('/clientes/registro', clienteData);
    } catch (error) {
      console.error('Error al registrar cliente:', error);
      throw error;
    }
  },

  // Validar disponibilidad de email
  validarEmailDisponibilidad: async (email) => {
    try {
      if (USAR_DATOS_MOCK) {
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 800));

        // Verificar si el email ya está registrado
        return !emailsRegistradosMock.includes(email.toLowerCase());
      }
      const response = await apiService.get('/clientes/validar-email', { email });
      return response.disponible; // Asume que el backend retorna { disponible: true/false }
    } catch (error) {
      console.error('Error al validar email:', error);
      throw error;
    }
  },

  // Login de cliente/admin
  login: async (loginData) => {
    try {
      return await apiService.post('/clientes/login', loginData);
    } catch (error) {
      console.error('Error al hacer login:', error);
      throw error;
    }
  },

  // Obtener cliente por ID
  getClientePorId: async (id) => {
    try {
      return await apiService.get(`/clientes/${id}`);
    } catch (error) {
      console.error('Error al obtener cliente:', error);
      throw error;
    }
  },

  // Obtener perfil completo del cliente autenticado
  obtenerPerfil: async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('No hay sesión activa');
      }
      return await apiService.get(`/clientes/${userId}`);
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      throw error;
    }
  },

  // Actualizar cliente
  actualizarCliente: async (id, clienteData) => {
    try {
      return await apiService.put(`/clientes/${id}`, clienteData);
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      throw error;
    }
  },

  // Obtener todos los clientes (para admin)
  getClientes: async () => {
    try {
      return await apiService.get('/clientes');
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      throw error;
    }
  }
};

export default clienteAPI;
