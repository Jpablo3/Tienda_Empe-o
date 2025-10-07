import { useState, useEffect } from 'react';

// Hook personalizado para manejar llamadas a la API
export const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiFunction();
        setData(result);
      } catch (err) {
        setError(err.message || 'Error al obtener los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error };
};

// Hook para realizar peticiones manuales
export const useApiMutation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (apiFunction, ...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunction(...args);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message || 'Error en la operación');
      setLoading(false);
      throw err;
    }
  };

  return { execute, loading, error };
};
