import { Prototype } from './Prototype';


export class Persona implements Prototype {
    constructor(
        public nombre: string,
        public edad: number,
        public profesion: string
    ) {}

    
    clone(): Persona {
        return new Persona(this.nombre, this.edad, this.profesion);
    }

    mostrarInfo(): string {
        return `Nombre: ${this.nombre}, Edad: ${this.edad}, Profesión: ${this.profesion}`;
    }
}
