import { videoJuego } from "./definiciones.js";

const formulario = document.querySelector('#formulario_Agregar');
const contenedor_Elemento = document.querySelector('#contenedor_Juegos');
let videojuegos = [];

const obtener_Datos_Formulario = (event) => {
    const datos_Formulario = new FormData(formulario);
    const datos = Object.fromEntries(datos_Formulario.entries());

    try {
        if (!datos.titulo || !datos.descripcion || !datos.plataforma) {
            throw new Error('No se han ingresado los datos en el formulario');
        }

        const nuevoJuego = new videoJuego(
            videojuegos.length + 1,
            datos.titulo,
            datos.descripcion,
            datos.plataforma
        );

        videojuegos.push(nuevoJuego);
        crearElementoVista(nuevoJuego.titulo, nuevoJuego.descripcion, nuevoJuego.plataforma);
    } catch (error) {
        document.querySelector("#mensaje_error").hidden = false;
        document.querySelector("#mensaje_error").textContent = error.message;
        console.log(error);
    }

    console.log(videojuegos);
};

export const crearElementoVista = (titulo_videojuego, descripcion_videojuego, plataforma_videojuego) => {
    const elemento = document.createElement('div');
    elemento.classList.add('elementosListaJuegos');

    elemento.innerHTML = `
        <h2>${titulo_videojuego}</h2>
        <p>${descripcion_videojuego}</p>
        <p><strong>Plataforma:</strong> ${plataforma_videojuego}</p>
        <button class="botonEditar">Editar</button>
        <button class="botonEliminar">Eliminar</button>
    `;

    contenedor_Elemento.appendChild(elemento);
}

document.querySelector("#boton_Agregar").addEventListener('click', () => {
    obtener_Datos_Formulario();
});
