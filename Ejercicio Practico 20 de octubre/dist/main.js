"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Persona_1 = require("./Persona");
console.log('=== PATRÓN PROTOTYPE - DEMOSTRACIÓN ===\n');
// Crear persona original
const persona1 = new Persona_1.Persona('Juan Pérez', 25, 'Ingeniero');
console.log('Persona Original:');
console.log(persona1.mostrarInfo());
console.log();
// Clonar la persona
const persona2 = persona1.clone();
console.log('Persona Clonada:');
console.log(persona2.mostrarInfo());
console.log();
// Modificar el clon
persona2.nombre = 'María López';
persona2.edad = 30;
persona2.profesion = 'Doctora';
// Verificar que son independientes
console.log('Después de modificar el clon:\n');
console.log('Original:', persona1.mostrarInfo());
console.log('Clonado:', persona2.mostrarInfo());
console.log();
// Verificar que son objetos diferentes
console.log('¿Son el mismo objeto?', persona1 === persona2 ? 'SÍ' : 'NO');
