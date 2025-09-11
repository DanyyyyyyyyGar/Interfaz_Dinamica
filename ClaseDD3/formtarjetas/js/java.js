const formulario_producto_nuevo = document.querySelector("formulario_producto_nuevo");
let productos = []; //declarando un arreglo vacio
let src_imagen_producto = "";
 
class Producto{
    constructor(id, nombre, descripcion, precio, imagen){
        this.Imagen = imagen;
        this.Id = id;
        this.Nombre = nombre;
        this.Descripcion = descripcion;
        this.Precio = precio;
    }
    ObternerDatos(){
        console.log(this.Id);
        console.log(this.Imagen);
        console.log(this.Nombre);
        console.log(this.Descripcion);
        console.log(this.Precio);
    }
}
//cada elemento guardado en el formulario lo convierte en objeto
function AgregarProducto(event){
    //console.log(document.querySelector('#nombre_producto').value);
    // Ensure formulario_producto_nuevo contains the correct ID of your form element
 // Replace 'your-form-id' with the actual ID of your HTML form

// Get the form element
let formularioElement = document.querySelector(`#formulario_producto_nuevo`);

// Check if the element exists and is a form element before creating FormData
if (formularioElement && formularioElement.tagName === 'FORM') {
  let datosFormulario = new FormData(formularioElement);
  console.log(datosFormulario); // Note: lectorFormulario is not defined in the provided snippet
  const datos = Object.fromEntries(datosFormulario.entries());
  console.log(datos);
  if(datos.nombre != "" && datos.Descripcion !="" && datos.Precio != null){
      // Your code to handle form data
        productos.push(new Producto(productos.length+1, datos.Nombre, datos.Descripcion, datos.Precio, datos.Imagen));
        //imprimir el arreglo por medio de un foreach
         productos.forEach(producto => {
        producto.ObternerDatos();
        //llamar al metodo para crear la tarjeta
        creartarjeta(producto);
    });
    }
    }

    /*let datosFormulario = new FormData(document.getElementById(formulario_producto_nuevo)); //recibe el formulario por medio del id
    console.log(lectorFormulario);
    const datos = Object.fromEntries(datosFormulario.entries());//toma los form y main para ascociarlos
    console.log(datos);
    if(datos.nombre != "" && datos.Descripcion !="" && datos.Precio != null){
 
        productos.push(new Producto(productos.length+1,src_imagen_producto, datos.Imagen, datos.Nombre, datos.Descripcion, datos.Precio));
        //imprimir el arreglo por medio de un foreach
         productos.forEach(producto => {
        producto.ObternerDatos();
    });
    }*/

    /*const json = JSON.stringify(datos);
    console.log(datos);*/
    //console.log(formulario_producto_nuevo);
}


function ObtenerImagen(event){
    const file = event.target.files[0];
    console.log(file)
    //console.log(event.target);
    if(file.type === "image/jpeg" || file.type === "image/png"){
        console.log(file.name);
        const lector = new FileReader();
        lector.onload = (event) =>{
            src_imagen_producto = event.target.result;
            //console.log(event.target.result);
            document.querySelector("#imagen-file").src = event.target.result;
        }
        lector.readAsDataURL(file);
    }
}
 