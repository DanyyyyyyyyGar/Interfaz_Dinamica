// API pública que funciona en navegador
const url = "https://jsonplaceholder.typicode.com/users";

// Datos a enviar en POST (simulado)
const datos_a_enviar = {
    name: 'Juan Pérez',
    username: 'juanp',
    email: 'juan@example.com'
};

// Función GET
async function peticionFetchGet(url) {
    try {
        const respuesta = await fetch(url);
        if (!respuesta.ok) {
            throw new Error('Error Http: ' + respuesta.status);
        }
        const datos = await respuesta.json();
        return datos;
    } catch (error) {
        return error;
    }
}

// Función POST
async function peticionFetchPost(url, datos) {
    try {
        const respuesta = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        if (!respuesta.ok) {
            throw new Error('Error Http: ' + respuesta.status);
        }
        const resultado = await respuesta.json();
        return resultado;
    } catch (error) {
        return error;
    }
}

// Ejecutar GET
peticionFetchGet(url)
    .then(datos => console.log("GET usuarios:", datos))
    .catch(error => console.log(error));

// Ejecutar POST
peticionFetchPost("https://jsonplaceholder.typicode.com/users", datos_a_enviar)
    .then(datos => console.log("POST usuario:", datos))
    .catch(error => console.log(error));
