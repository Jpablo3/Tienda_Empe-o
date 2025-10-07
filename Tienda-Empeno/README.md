# Tienda Empeño - Frontend

Aplicación React para gestionar una tienda de empeño.

## 🚀 Tecnologías

- React 18
- Vite
- React Router DOM
- Axios

## 📁 Estructura del Proyecto

```
src/
├── api/              # Funciones para consumir APIs específicas
├── services/         # Configuración de axios y servicios generales
├── components/       # Componentes reutilizables
├── pages/            # Páginas/Vistas de la aplicación
├── hooks/            # Custom hooks
├── utils/            # Funciones utilitarias
└── App.jsx           # Componente principal
```

## ⚙️ Configuración

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**
   - Copia `.env.example` a `.env`
   - Configura `VITE_API_URL` con la URL de tu backend

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

## 🔌 Consumir APIs

### Configuración de Axios
La configuración de axios está en `src/services/axiosConfig.js`:
- URL base configurable desde `.env`
- Interceptores para agregar tokens automáticamente
- Manejo de errores de autenticación

### Servicio API Genérico
Usa `src/api/apiService.js` para peticiones HTTP:
```javascript
import apiService from './api/apiService';

// GET
const data = await apiService.get('/endpoint');

// POST
const result = await apiService.post('/endpoint', { datos });

// PUT
const updated = await apiService.put('/endpoint/id', { datos });

// DELETE
await apiService.delete('/endpoint/id');
```

### APIs Específicas
Crea archivos en `src/api/` para endpoints específicos. Ver `src/api/ejemploAPI.js` como referencia.

### Custom Hooks
Usa los hooks personalizados en `src/hooks/useApi.js`:

**Para cargar datos automáticamente:**
```javascript
import { useApi } from './hooks/useApi';
import { ejemploAPI } from './api/ejemploAPI';

function MiComponente() {
  const { data, loading, error } = useApi(() => ejemploAPI.obtenerProductos());

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return <div>{/* Renderizar datos */}</div>;
}
```

**Para peticiones manuales (crear, actualizar, eliminar):**
```javascript
import { useApiMutation } from './hooks/useApi';
import { ejemploAPI } from './api/ejemploAPI';

function MiComponente() {
  const { execute, loading, error } = useApiMutation();

  const handleCrear = async () => {
    try {
      await execute(ejemploAPI.crearProducto, { nombre: 'Producto' });
      alert('Creado exitosamente');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return <button onClick={handleCrear}>Crear</button>;
}
```

## 📝 Próximos Pasos

1. Configura la URL de tu backend en `.env`
2. Crea archivos en `src/api/` para tus endpoints específicos
3. Crea componentes en `src/components/` para tu UI
4. Crea páginas en `src/pages/` para tus vistas
5. Agrega rutas en `src/App.jsx`

## 🛠️ Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción
