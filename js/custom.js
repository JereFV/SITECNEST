let productos = JSON.parse(localStorage.getItem('productos')) || [];
// Carrito de compras almacenado en localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

$(window).on('load', function () {
    getYear();        
});

// nice select
$(document).ready(function() {
    obtenerDatosCarritoNav();
    $('select').niceSelect();
});

document.addEventListener('DOMContentLoaded', function () {
    const inputs = document.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
        input.addEventListener('invalid', function () {
            if (input.validity.valueMissing) {
                input.setCustomValidity('Este campo es obligatorio.');
            }
        });
        input.addEventListener('input', function () {
            input.setCustomValidity(''); // Restablece el mensaje
        });
    });
});

// to get current year
function getYear() {
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    document.querySelector("#displayYear").innerHTML = currentYear;
}

// client section owl carousel
$(".client_owl-carousel").owlCarousel({
    loop: true,
    margin: 0,
    dots: false,
    nav: true,
    navText: [],
    autoplay: true,
    autoplayHoverPause: true,
    navText: [
        '<i class="fa fa-angle-left" aria-hidden="true"></i>',
        '<i class="fa fa-angle-right" aria-hidden="true"></i>'
    ],
    responsive: {
        0: {
            items: 1
        },
        768: {
            items: 2
        },
        1000: {
            items: 2
        }
    }
});

function guardarCategoria(categoria){
    localStorage.setItem("categoria", categoria)
}

function validateForm() {
    // Verifica si el formulario es válido
    if (document.getElementById("formularioContacto").checkValidity()) {
        window.alert('Solicitud de contacto enviada satisfactoriamente.');
        return true; // Permite el envío del formulario
    }
    return false; // Impide el envío del formulario
}

//Calcula la cantidad de productos y el monto total a mostrar en el carrito del nav a partir de la variable localStorage.
function obtenerDatosCarritoNav(){
    // Carrito de compras almacenado en localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    if(cart != []){
        let cantidadProductos = 0;
        let totalCarrito = 0;

        cart.forEach(item => {
            cantidadProductos += Number(item.cantidad);
            if(Number(item.cantidad) > 1)
                totalCarrito += Number(item.precio.replace(/,/g, '')) * item.cantidad;
            else
                totalCarrito += Number(item.precio.replace(/,/g, ''));
        });

        $("#contadorCarritoNav").text(cantidadProductos);
        $("#totalCarritoNav").text(`₡${totalCarrito.toLocaleString('en-US')}`);
    }
}

// Función para agregar productos al carrito
function addToCart(productId, event) {
    //Se valida que al añadir un producto desde la pestaña productos no redirrecione al detalle.
    if(event != null)
        event.stopPropagation();

    const product = productos.find(p => p.codigo == productId);
    const cartItem = cart.find(item => item.codigo == productId);
  
    if (cartItem) {
        cartItem.cantidad++;
    } else {
        cart.push({ ...product, cantidad: 1});
    }
  
    saveCart();
    obtenerDatosCarritoNav();
  
    Swal.fire('Producto agregado', `${product.nombre} ha sido agregado al carrito correctamente.`, 'success');
}
  
// Función para guardar el carrito en localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}