import { GestorVideojuegos } from "./GestorVJ.js";
import { ControladorVista } from "./controladorVista.js";

const contenedor = document.querySelector("#contenedor_Juegos");
const mensajeError = document.querySelector("#mensaje_error");
const formulario = document.querySelector("#formulario_Agregar");
const botonAgregar = document.querySelector("#boton_Agregar");

const gestor = new GestorVideojuegos();
const vista = new ControladorVista(gestor, contenedor, mensajeError);

// Cargar datos desde JSON
async function cargarDatos() {
    try {
        const response = await fetch("VJ.json");
        const data = await response.json();
        data.videoJuegos.forEach(vj => gestor.agregar(vj));
        vista.renderizarLista();
    } catch (error) {
        vista.mostrarError("Error al cargar datos: " + error.message);
    }
}

botonAgregar.addEventListener("click", () => {
    const titulo = formulario.querySelector("input[name='titulo']").value.trim();
    const descripcion = formulario.querySelector("input[name='descripcion']").value.trim();
    const plataforma = formulario.querySelector("input[name='plataforma']").value.trim();
    const editId = botonAgregar.dataset.editId;

    if (!titulo || !descripcion || !plataforma) {
        vista.mostrarError("Todos los campos son obligatorios.");
        return;
    }

    try {
        if (editId) {
            gestor.actualizar(parseInt(editId), { titulo, descripcion, plataforma });
            delete botonAgregar.dataset.editId;
        } else {
            gestor.agregar({ titulo, descripcion, plataforma });
        }

        formulario.reset();
        vista.renderizarLista();
    } catch (error) {
        vista.mostrarError(error.message);
    }
});

cargarDatos();
