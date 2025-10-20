"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Persona = void 0;
/**
 * Clase Persona que implementa el patrón Prototype
 */
class Persona {
    constructor(nombre, edad, profesion) {
        this.nombre = nombre;
        this.edad = edad;
        this.profesion = profesion;
    }
    /**
     * Método clone: crea una copia del objeto actual
     */
    clone() {
        return new Persona(this.nombre, this.edad, this.profesion);
    }
    mostrarInfo() {
        return `Nombre: ${this.nombre}, Edad: ${this.edad}, Profesión: ${this.profesion}`;
    }
}
exports.Persona = Persona;
