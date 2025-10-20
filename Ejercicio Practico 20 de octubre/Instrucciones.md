## Archivos

- `Prototype.ts` - Interfaz que define el método clone()
- `Persona.ts` - Clase que implementa el patrón Prototype
- `main.ts` - Programa de prueba

## Instalación

```bash
npm install
```

## Ejecución

```bash
npm run dev
```
## ¿Qué hace?

El patrón Prototype permite copiar objetos existentes sin depender de sus clases. El programa:

1. Crea una persona
2. La clona usando el método clone()
3. Modifica el clon
4. Verifica que el original no cambió
