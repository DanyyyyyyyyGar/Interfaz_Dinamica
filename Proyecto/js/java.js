 let indice = 0;
    const contenedor = document.getElementById("contenedor");
    const total = contenedor.children.length;

    function mover(direccion) {
      indice = (indice + direccion + total) % total;
      contenedor.style.transform = `translateX(-${indice * 100}%)`;
    }