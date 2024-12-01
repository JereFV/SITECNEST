// Carrito de compras almacenado en localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

$(document).ready(() => {
    displayCart();
})

// Función para mostrar el carrito de compras
function displayCart() {
    let total = 0;
    let botonPagar = document.getElementById("Pagar");
    const content = $(".cart_product-list");

    content.empty();

    if (cart.length === 0) {
        content.append('<h1 class="text-center">El carrito de Compras se encuentra vacío.</h1>');
        //Inhabilita el botón de pagar al no haber elementos en el carrito.
        botonPagar.disabled = true;

        //Devuelve los datos de la factura a sus valores predeterminados.
        $("#subtotalFactura").text("₡0");
        $("#impuestosFactura").text("₡0");
        $("#totalFactura").text("₡0");

        return;
    }

    cart.forEach(item => {
        const subtotal = Number(item.precio.replace(/,/g, '')) * item.cantidad;
        total += subtotal;

        const product = 
        `<div class="cart_product-item">
            <img src="${item.imagen}" alt="I${item.nombre}" class="cart_product-img">
            <div class="cart_product-details">
                <div class="cart_product-name">${item.nombre}</div>
                <button type="button" class="btn btn-danger btn-sm" onclick="removeFromCart(${item.codigo})">Eliminar</button>
            </div>
            <div>
                <div class="cart_product-price">Precio: ₡${item.precio}</div>
                <div class="cart_product-quantity">                      
                    <label for="prueba">Cantidad: </label>                                                   
                    <input type="number" min="1" class="form-control" value="${item.cantidad}" onchange="updateQuantity(${item.codigo}, this.value)">                
                </div>
                <div class="cart_product-price">Subtotal: ₡${subtotal.toLocaleString('en-US')}</div>
            </div>
        </div>`

        content.append(product);
    });

    let impuestos = total * 0.05;
    //Habilita el botón de pagar al haber elementos en el carrito.
    botonPagar.disabled = false;

    //Calcula los montos de la factura.
    $("#subtotalFactura").text(`₡${total.toLocaleString('en-US')}`);
    $("#impuestosFactura").text(`₡${impuestos.toLocaleString('en-US')}`);
    $("#totalFactura").text(`₡${(total + impuestos).toLocaleString('en-US')}`);
}

// Función para guardar el carrito en localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    //updateCartIndicator();
}

// Función para actualizar la cantidad de productos
function updateQuantity(productId, quantity) {
    const cartItem = cart.find(item => item.codigo == productId);
    if (cartItem) {
        cartItem.cantidad = parseInt(quantity);
        saveCart();
        displayCart();
        obtenerDatosCarritoNav();
    }
}

// Función para eliminar un producto del carrito
function removeFromCart(productId) {
    Swal
    .fire({
        title: "Confirmación",
        text: "¿Está seguro que desea eliminar el producto del carrito?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
    })
    .then(resultado => {
        if (resultado.value) {
            cart = cart.filter(item => item.codigo != productId);
            saveCart();
            displayCart();
            obtenerDatosCarritoNav();
            Swal.fire('Producto eliminado', 'El producto ha sido eliminado del carrito', 'info');
        }
    });   
}

function pagar(){
    // Obtener la fecha actual en formato YYYY-MM-DD
    const today = new Date();
    const todayString = today.toISOString().split("T")[0]; // Convertir a formato de fecha

    Swal.fire({
        title: 'Pantalla de Pago',
        html: `
            <select class="swal2-input" show-tick" id="lista" data-style="btn-warning" data-live-search="true" >
                <option value="-1">Seleccione el Tipo de envío</option>
                <option value="1">Envío Postal</option>
                <option value="2">Recogida en tienda</option>
            </select>
            <input id="card-number" type="text" class="swal2-input" placeholder="Número de tarjeta" maxlength="16" oninput="this.value=this.value.replace(/[^0-9]/g,'')">
            <input id="expiry-date" type="date" class="swal2-input" placeholder="Fecha de Vencimiento" min="${todayString}">
            <input id="card-name" type="text" class="swal2-input" placeholder="Nombre en la tarjeta">
        `,
        focusConfirm: false,
        preConfirm: () => {
            const cardNumber = document.getElementById('card-number').value;
            const expiryDate = document.getElementById('expiry-date').value;
            const cardName = document.getElementById('card-name').value;

            const selectedDate = new Date(expiryDate);
            const cardNumberLength = cardNumber.length;

            if (!cardNumber || !expiryDate || !cardName) {
                Swal.showValidationMessage('Por favor completa todos los campos');
                return false;
            }

            if (cardNumberLength < 13 || cardNumberLength > 16) {
                Swal.showValidationMessage('El número de tarjeta debe tener entre 13 y 16 dígitos');
                return false;
            }

            if (selectedDate < today) {
                Swal.showValidationMessage('La fecha de vencimiento no puede ser anterior al día actual');
                return false;
            }

            return { cardNumber, expiryDate, cardName };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // Simular el pago
            Swal.fire('¡Pago realizado!', 'Gracias por tu compra', 'success');
            cart = [];
            saveCart();
            displayProducts();
        }
    });
}