export async function convertir_de_JSON_a_Objeto(direccion_archivo) {
    const datos = await fetch(direccion_archivo);
    const objeto = await datos.json();
    return objeto;
}

export function convertir_de_Objeto_a_JSON(objeto) {
    return JSON.stringify(objeto, null, 2);
}
