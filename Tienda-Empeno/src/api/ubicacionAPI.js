import apiService from './apiService';

// Datos mock para desarrollo (eliminar cuando el backend esté listo)
const USAR_DATOS_MOCK = false; // Cambiar a false cuando tu backend esté corriendo

const departamentosMock = [
  { id: 1, nombre: 'Guatemala' },
  { id: 2, nombre: 'Sacatepéquez' },
  { id: 3, nombre: 'Chimaltenango' },
  { id: 4, nombre: 'Escuintla' },
  { id: 5, nombre: 'Santa Rosa' },
  { id: 6, nombre: 'Sololá' },
  { id: 7, nombre: 'Totonicapán' },
  { id: 8, nombre: 'Quetzaltenango' },
  { id: 9, nombre: 'Retalhuleu' },
  { id: 10, nombre: 'San Marcos' }
];

const ciudadesMock = {
  1: [
    { id: 1, nombre: 'Guatemala City', departamento_id: 1 },
    { id: 2, nombre: 'Villa Nueva', departamento_id: 1 },
    { id: 3, nombre: 'Mixco', departamento_id: 1 },
    { id: 4, nombre: 'Petapa', departamento_id: 1 },
    { id: 5, nombre: 'San José Pinula', departamento_id: 1 }
  ],
  2: [
    { id: 7, nombre: 'Antigua Guatemala', departamento_id: 2 },
    { id: 8, nombre: 'Jocotenango', departamento_id: 2 },
    { id: 9, nombre: 'Ciudad Vieja', departamento_id: 2 }
  ],
  3: [
    { id: 11, nombre: 'Chimaltenango', departamento_id: 3 },
    { id: 12, nombre: 'San José Poaquil', departamento_id: 3 },
    { id: 13, nombre: 'Tecpán Guatemala', departamento_id: 3 }
  ],
  4: [
    { id: 15, nombre: 'Escuintla', departamento_id: 4 },
    { id: 16, nombre: 'Santa Lucía Cotzumalguapa', departamento_id: 4 },
    { id: 17, nombre: 'Tiquisate', departamento_id: 4 }
  ]
};

// API para manejar ubicaciones (departamentos, ciudades, países)
export const ubicacionAPI = {
  // Obtener todos los departamentos
  getDepartamentos: async () => {
    try {
      if (USAR_DATOS_MOCK) {
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 500));
        return departamentosMock;
      }
      return await apiService.get('/departamentos');
    } catch (error) {
      console.error('Error al obtener departamentos:', error);
      throw error;
    }
  },

  // Obtener ciudades por departamento
  getCiudadesByDepartamento: async (departamentoId) => {
    try {
      if (USAR_DATOS_MOCK) {
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 300));
        return ciudadesMock[departamentoId] || [];
      }
      return await apiService.get(`/ciudades/departamento/${departamentoId}`);
    } catch (error) {
      console.error('Error al obtener ciudades:', error);
      throw error;
    }
  },

  // Obtener todos los países (si lo necesitas)
  getPaises: async () => {
    try {
      return await apiService.get('/paises');
    } catch (error) {
      console.error('Error al obtener países:', error);
      throw error;
    }
  }
};

export default ubicacionAPI;
