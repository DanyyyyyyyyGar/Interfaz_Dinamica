import { GestorVideojuegos } from "./GestorVJ.js";

/**
 * ControladorVista
 * Maneja la vista dinámica de videojuegos y la interacción con el GestorVideojuegos
 */
export class ControladorVista {
    constructor(gestor, contenedor, mensajeError) {
        this.gestor = gestor;              // GestorVideojuegos
        this.contenedor = contenedor;      // Contenedor HTML de tarjetas
        this.mensajeError = mensajeError;  // Elemento HTML para errores
    }

    /**
     * Renderiza toda la lista de videojuegos
     */
    renderizarLista() {
        this.contenedor.innerHTML = "";
        try {
            const lista = this.gestor.obtenerLista();
            lista.forEach(vj => this.crearTarjeta(vj));
        } catch (error) {
            this.mostrarError(error.message);
        }
    }

    /**
     * Crea tarjeta HTML de un videojuego
     * @param {Object} videojuego 
     */
    crearTarjeta(videojuego) {
        const elemento = document.createElement("div");
        elemento.classList.add("elementosListaJuegos");

        elemento.innerHTML = `
            <h2>${videojuego.titulo}</h2>
            <p>${videojuego.descripcion}</p>
            <p><strong>Plataforma:</strong> ${videojuego.plataforma}</p>
            <button class="botonEditar">Editar</button>
            <button class="botonEliminar">Eliminar</button>
        `;

        // Botón Editar
        elemento.querySelector(".botonEditar").addEventListener("click", () => {
            document.querySelector("input[name='titulo']").value = videojuego.titulo;
            document.querySelector("input[name='descripcion']").value = videojuego.descripcion;
            document.querySelector("input[name='plataforma']").value = videojuego.plataforma;
            document.querySelector("#boton_Agregar").dataset.editId = videojuego.id;

            // Hacer scroll hasta el formulario (parte superior)
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Botón Eliminar
        elemento.querySelector(".botonEliminar").addEventListener("click", () => {
            try {
                this.gestor.eliminar(videojuego.id);
                this.renderizarLista();
            } catch (error) {
                this.mostrarError(error.message);
            }
        });

        this.contenedor.appendChild(elemento);
    }

    /**
     * Muestra mensaje de error en la vista
     * @param {string} mensaje 
     */
    mostrarError(mensaje) {
        this.mensajeError.hidden = false;
        this.mensajeError.textContent = mensaje;
        setTimeout(() => this.mensajeError.hidden = true, 3000);
    }
}
