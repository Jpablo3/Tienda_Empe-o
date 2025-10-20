import { Prototype } from './Prototype';

/**
 * Clase Persona que implementa el patrón Prototype
 */
export class Persona implements Prototype {
    constructor(
        public nombre: string,
        public edad: number,
        public profesion: string
    ) {}

    /**
     * Método clone: crea una copia del objeto actual
     */
    clone(): Persona {
        return new Persona(this.nombre, this.edad, this.profesion);
    }

    mostrarInfo(): string {
        return `Nombre: ${this.nombre}, Edad: ${this.edad}, Profesión: ${this.profesion}`;
    }
}
