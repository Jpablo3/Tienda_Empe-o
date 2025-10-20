import { Persona } from './Persona';

console.log('=== PATRÓN PROTOTYPE - DEMOSTRACIÓN ===\n');

// Crea a la persona original
const persona1 = new Persona('Ricardo Tapia', 27, 'Abogado');
console.log('Persona Original:');
console.log(persona1.mostrarInfo());
console.log();

// Clona a la persona
const persona2 = persona1.clone();
console.log('Persona Clonada:');
console.log(persona2.mostrarInfo());
console.log();

// Modifica a la persona clonada
persona2.nombre = 'Selena Gomez';
persona2.edad = 40;
persona2.profesion = 'Maestra';

// Verificar que son independientes
console.log('Después de modificar el clon:\n');
console.log('Original:', persona1.mostrarInfo());
console.log('Clonado:', persona2.mostrarInfo());
console.log();

// Verificar que son objetos diferentes
console.log('¿Son el mismo objeto?', persona1 === persona2 ? 'SÍ' : 'NO');
