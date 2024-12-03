//Variables para almacenar los datos digitados en el modal del pago.
let nombreCliente = "";
let tipoEnvio = "";

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
            <select class="swal2-input" show-tick" id="tipo-Envio" data-style="btn-warning" data-live-search="true" >
                <option value="-1">Seleccione el Tipo de envío</option>
                <option value="1">Envío Postal</option>
                <option value="2">Recogida en tienda</option>
            </select>
            <div style="position: relative;">
                <input id="card-number" type="text" class="swal2-input" 
                       placeholder="Número de tarjeta" maxlength="16" 
                       oninput="this.value=this.value.replace(/[^0-9]/g,'')">
                <span id="card-icon" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%);"></span>
            </div>
            <input id="expiry-date" type="date" class="swal2-input" placeholder="Fecha de Vencimiento" min="${todayString}">
            <input id="card-name" type="text" class="swal2-input" placeholder="Nombre en la tarjeta">
        `,
        focusConfirm: false,
        preConfirm: () => {
            const cardNumber = document.getElementById('card-number').value;
            const expiryDate = document.getElementById('expiry-date').value;
            const cardName = document.getElementById('card-name').value;
            const deliveryType = document.getElementById('tipo-Envio').value;            
            const cardNumberLength = cardNumber.length;

            if (!cardNumber || !expiryDate || !cardName || deliveryType == -1) {
                Swal.showValidationMessage('Por favor completar todos los campos.');
                return false;
            }

            if(cardNumber.slice(0, 1) != 4 && cardNumber.slice(0, 1) != 5){
                Swal.showValidationMessage('Debe digitar un número de tarjeta de marca Visa o Mastercard únicamente.');
                return false;
            }

            if (cardNumberLength < 13 || cardNumberLength > 16) {
                Swal.showValidationMessage('El número de tarjeta debe tener entre 13 y 16 dígitos');
                return false;
            }
            
            nombreCliente = cardName;
            tipoEnvio = $("#tipo-Envio option:selected").text();
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // Simular el pago
            Swal.fire('¡Pago realizado satisfactoriamente!', 'Muchas gracias por su compra, le será entregada a la brevedad.', 'success');
            generarFactura();
            cart = [];
            saveCart();
            displayCart();
            obtenerDatosCarritoNav();       
        }
    });

    //Agregar evento de entrada para el número de tarjeta
    const inputCardNumber = document.getElementById('card-number');
    const cardIcon = document.getElementById('card-icon');

    const cardBrands = {
        '4': 'VISA',
        '5': 'MasterCard',       
    };
    
    inputCardNumber.addEventListener('input', () => {
        //Obtiene el primer digíto.
        const bin = inputCardNumber.value.slice(0, 1);
        const brand = cardBrands[bin];
    
        if (brand === 'VISA') {
            cardIcon.innerHTML = `<img src="https://logodownload.org/wp-content/uploads/2016/10/visa-logo.png" alt="Visa" width="30">`;
        } else if (brand === 'MasterCard') {
            cardIcon.innerHTML = `<img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg" alt="MasterCard" width="30">`;
        } else {
            cardIcon.innerHTML = '';
        }
    });
}

// Función para generar un PDF del contenido del carrito
function generarFactura() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    // Generar la fecha y hora actual en el formato especificado
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Asegurar que el mes tenga dos dígitos
    const day = String(now.getDate()).padStart(2, '0'); // Asegurar que el día tenga dos dígitos
    const hours = String(now.getHours()).padStart(2, '0'); // Asegurar que la hora tenga dos dígitos
    const minutes = String(now.getMinutes()).padStart(2, '0'); // Asegurar que los minutos tengan dos dígitos
    const seconds = String(now.getSeconds()).padStart(2, '0'); // Asegurar que los segundos tengan dos dígitos
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0'); // Asegurar que los milisegundos tengan tres dígitos

    const invoiceNumber = `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;

    doc.setFontSize(28);
    doc.setTextColor(0, 123, 255); // Color azul
    doc.setFont("arial", "bold"); // Establecer fuente en negrita
    doc.text("Factura de Compra SITECNEST", 105, 20, null, null, 'center'); // Centrado horizontalmente
    doc.setTextColor(0, 0, 0); // Color negro
    doc.setFont("arial", "normal"); // Establecer fuente normal
    doc.setFontSize(14);

    // Datos generales de la factura
    doc.text(`Número de Factura: ${invoiceNumber}`, 14, 35); // Centrado horizontalmente
    doc.text(`Nombre del Cliente: ${nombreCliente}`, 14, 45); // Posición vertical después del número de factura
    doc.text(`Tipo de envío: ${tipoEnvio}`, 14, 55);

    //Configuración de la tabla
    let y = 75; // posición vertical inicial tabla 
    let total = 0;
    // Definir el ancho de la tabla y la altura de las filas
    const tableWidth = 180;
    const rowHeight = 10;

    //Título de la tabla
    doc.setFont("arial", "bold"); // Establecer fuente normal
    doc.setFontSize(18);
    doc.text(`Detalle de Compra`, 14, 70);

    // Cabecera de la tabla
    doc.setFillColor(0, 123, 255); // Color azul
    doc.rect(14, y, tableWidth, rowHeight, 'F'); // Fondo de la cabecera
    doc.setTextColor(255, 255, 255); // Texto blanco
    doc.setFont("arial", "bold"); // Establecer fuente normal
    doc.setFontSize(14);
    doc.text("Producto", 15, y + 7);
    doc.text("Precio", 83, y + 7);
    doc.text("Cantidad", 120, y + 7);
    doc.text("Subtotal", 150, y + 7);
    doc.setTextColor(0, 0, 0); // Restablecer el color del texto a negro
    doc.setFont("arial", "normal"); // Establecer fuente normal
    y += rowHeight;

    // Detalles de los productos
    cart.forEach(item => {
        const subtotal = Number(item.precio.replace(/,/g, '')) * item.cantidad;
        doc.rect(14, y, tableWidth, rowHeight); // Bordes de la fila
        doc.text(item.nombre, 15, y + 7);
        doc.text(`CRC ${item.precio.toLocaleString('en-US')}`, 80, y + 7);
        doc.text(String(item.cantidad), 120, y + 7);
        doc.text(`CRC ${subtotal.toLocaleString('en-US')}`, 150, y + 7);
        y += rowHeight; // Incremento para la siguiente línea
        total += subtotal;
    });
    
    let impuestos = total * 0.05;
    //Título de la tabla
    doc.setFont("arial", "bold"); // Establecer fuente normal
    doc.setFontSize(18);
    doc.text(`Resumen de Factura`, 14, y += 15);
    

    // Valores totales de la factura.
    doc.setFillColor(211, 211, 211); // Color gris
    doc.rect(14, y +=7, tableWidth, rowHeight, 'F');
    doc.setTextColor(0, 0, 0); // Texto negro
    doc.setFont("arial", "normal"); // Establecer fuente normal
    doc.setFontSize(14);
    doc.text("Subtotal:", 15, y +=7,);
    doc.text(`CRC ${total.toLocaleString('en-US')}`, 150, y,);
    doc.setFillColor(211, 211, 211); // Color gris
    doc.rect(14, y +=7, tableWidth, rowHeight, 'F');
    doc.text("Envío:", 15, y +=7,);
    doc.text("CRC 0", 150, y,);
    doc.setFillColor(211, 211, 211); // Color gris
    doc.rect(14, y +=7, tableWidth, rowHeight, 'F');
    doc.text("Impuestos:", 15, y +=7,);
    doc.text(`CRC ${impuestos.toLocaleString('en-US')}`, 150, y,);
    doc.setFillColor(211, 211, 211); // Color gris
    doc.rect(14, y +=7, tableWidth, rowHeight, 'F');
    doc.text("Total:", 15, y +=7,);
    doc.text(`CRC ${(total + impuestos).toLocaleString('en-US')}`, 150, y,);
    
    // Agregar número de página
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i); // Establecer la página actual
        doc.text(`Página ${i} de ${pageCount}`, 190, 285, null, null, 'right'); // Añadir número de página
    }

    doc.output('dataurlnewwindow');
}