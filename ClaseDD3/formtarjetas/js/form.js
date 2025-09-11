const elementos = document.querySelector("#elementos");
 
 
function creartarjeta(producto){
 
        //elementos.innerHTML = "";
        const cont = new Image();
        cont.url = producto.Imagen;
        cont.classList.add("img");
        elementos.appendChild(cont);
        const titulo = document.createElement("h1");
        titulo.textContent = producto.Nombre;
        elementos.appendChild(titulo);
        const descripcion = document.createElement("p");
        descripcion.textContent = producto.Descripcion;
        elementos.appendChild(descripcion);
}
