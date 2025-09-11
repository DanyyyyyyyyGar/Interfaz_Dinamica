var titulo = document.getElementById("titulo");
let yagg = document.querySelector("#img2");
const partebaja = document.querySelector("#img3");
const corona = document.querySelector("#img1");

window.addEventListener("scroll", (event)=>{
    console.log(event);
    titulo.style.right=window.scrollY*2+"px";
    yagg.style.left=window.scrollY*5+"px";
    partebaja.style.bottom=window.scrollY*1+"px";
    corona.style.top=window.scrollY*3+"px";
})