export class GestorVideojuegos {
    constructor() {
        this.lista = [];
    }

    obtenerLista() {
        if (!this.lista || this.lista.length === 0) {
            throw new Error("La lista de videojuegos está vacía o no inicializada.");
        }
        return this.lista;
    }

    obtenerPorId(id) {
        if (!id) throw new Error("ID inválido.");
        const videojuego = this.lista.find(vj => vj.id === id);
        if (!videojuego) throw new Error(`No se encontró un videojuego con el ID ${id}.`);
        return videojuego;
    }

    agregar(videojuego) {
        if (!videojuego || !videojuego.titulo || !videojuego.descripcion || !videojuego.plataforma) {
            throw new Error("Todos los campos del videojuego son obligatorios.");
        }
        videojuego.id = this.lista.length ? this.lista[this.lista.length - 1].id + 1 : 1;
        this.lista.push(videojuego);
    }

    actualizar(id, nuevosDatos) {
        const index = this.lista.findIndex(vj => vj.id === id);
        if (index === -1) throw new Error(`No se encontró un videojuego con el ID ${id}.`);
        if (!nuevosDatos.titulo || !nuevosDatos.descripcion || !nuevosDatos.plataforma) {
            throw new Error("Todos los campos son obligatorios para actualizar.");
        }
        this.lista[index] = { id, ...nuevosDatos };
    }

    eliminar(id) {
        const index = this.lista.findIndex(vj => vj.id === id);
        if (index === -1) throw new Error(`No se encontró un videojuego con el ID ${id}.`);
        this.lista.splice(index, 1);
    }
}
