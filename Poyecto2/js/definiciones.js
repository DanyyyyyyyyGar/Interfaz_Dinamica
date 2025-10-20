export class videoJuego {
    constructor(id, titulo, descripcion, plataforma) {
        this.id = id;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.plataforma = plataforma;
    }

    mostrarDatos() {
        console.log(
            "Juego:", this.titulo,
            "ID:", this.id,
            "Descripción:", this.descripcion,
            "Plataforma:", this.plataforma
        );
    }
}
