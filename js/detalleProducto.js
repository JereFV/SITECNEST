$(document).ready(function () {

    $.getJSON('Json/productos.json', function (data) {

        const productoA = localStorage.getItem('codigo');
        if (!productoA)
            console.log("No se encontro")
        const productoB = data.find(producto => producto.codigo == productoA)
        if (productoB) {
            console.log(localStorage.getItem('codigo'))
            const container = $("#product-product-container")

            const card = `<div id="carouselExampleAutoplaying" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner">
            <div class="carousel-item active">
                <div class="product-main-product">
                    <div class="product-image-gallery">
                        <div class="product-main-image">
                            <img id="main-image" src="${productoB.imagen}" alt="Imagen Producto">
                        </div>
                        <div class="product-thumbnail-images">
                            <img id="thumbnail-1" src="${productoB.imagen2}" alt="Imagen Producto">
                            <img id="thumbnail-2" src="${productoB.imagen3}" alt="Imagen Producto">
                        </div>
                    </div>
                    <div class="product-product-info">
                        <h3 id="product-name"></h3>
                        <p><strong>Precio:</strong> ₡<span id="product-price">${productoB.precio}</span></p>
                        <p><strong>Descripción:</strong> <span id="product-description">${productoB.nombre}</span></p>
                        <p><strong>Stock:</strong> <span id="product-stock">${productoB.stock}</span></p>
                        <p><strong>Opciones de entrega:</strong> <span id="product-delivery">${productoB.opcionEntrega}</span></p>
                        <p><strong>Tiempo de entrega:</strong> <span id="product-delivery">${productoB.tiemposEntrega}</span></p>
                        <p><strong>Gastos de entrega:</strong> <span id="product-delivery">${productoB.gastoEntrega}</span></p>
                        <p><strong>Garantía:</strong> <span id="product-warranty">${productoB.garantia}</span></p>
                        <button class="product-add-to-cart-button" onclick="addToCart(${productoB.codigo})">Agregar al carrito</button>
                    </div>
                </div>
            </div>
            <div class="carousel-item">
                <div class="product-main-product">
                    <div class="product-user-reviews">
                    <div>
                    <h3>${productoB.reseña1Cantidad}</h3>
                    <p>${productoB.reseña1Descripcion}</p>
                    </div>
                    <div>
                    <h3>${productoB.reseña2Cantidad}</h3>
                    <p>${productoB.reseña2Descripcion}</p>
                    </div>
                    <div>
                    <h3>${productoB.reseña3Cantidad}</h3>
                    <p>${productoB.reseña3Descripcion}</p>
                    </div>
                    <div>
                    <h3>${productoB.reseña4Cantidad}</h3>
                    <p>${productoB.reseña4Descripcion}</p>
                    </div>
                    <div>
                    <h3>${productoB.reseña5Cantidad}</h3>
                    <p>${productoB.reseña5Descripcion}</p>
                    </div>
                    <div>
                    <h3>${productoB.reseña6Cantidad}</h3>
                    <p>${productoB.reseña6Descripcion}</p>
                    </div>
                    </div>
                </div>
            </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying"
            data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying"
            data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
        </button>
    </div>
    <h3 style="margin-top: 60px;">Productos relacionados</h3>
    <div class="product-related-products" id="related-products">    
    <div><img src="${productoB.productoRelacionado1}" alt=""></div>
    <div><img src="${productoB.productoRelacionado2}" alt=""></div>
    <div><img src="${productoB.productoRelacionado3}" alt=""></div>
    <div><img src="${productoB.productoRelacionado4}" alt=""></div>
    </div>`

            container.append(card);
        } else {
            console.log("Fracaso")
        }
    }).fail(function () {
        Swal.fire({
            title: 'Error',
            text: 'Ha ocurrido un error al intentar cargar el listado de productos. Por favor contacte al administrador del sistema.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    });

})