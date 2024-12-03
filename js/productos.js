$(document).ready(function() {
    // Cargar y mostrar productos dinámicamente desde el archivo JSON
    $.getJSON('Json/productos.json', function(data) {
      //Almacenado del json en una variable
      //productos = data;
      localStorage.setItem('productos', JSON.stringify(data));
      const container = $('#contenedor_productos');
      
      data.forEach(producto => {
      //const card = document.createElement('div');
      // card.classList.add('card', producto.codigo);
      const card =
        `<a href="UProducto.html"><div class="col-sm-6 col-lg-4 all ${producto.categoria}" id='productoCargado${producto.codigo}'>         
            <div class="card" style="width: 20rem;">
              <div class="image-container">
                <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                <span class="precio-articulo">₡${producto.precio}</span>         
              </div>       
              <h4>${producto.nombre}</h4>
              <div class="botones-section">
                <a href="#" class="btn btn-primary annadirCarrito" onclick="addToCart(${producto.codigo}, event)"><span class="fa fa-shopping-cart">&nbsp;</span>Añadir al carrito</a>
              </div>                                        
            </div>
          </div></a>`;

      container.append(card);

      const divProducto = $('#productoCargado' + producto.codigo);
      divProducto.on('click', function (event) {
        event.preventDefault(); // Evitar redirección       
        localStorage.setItem("codigo", this.id.substring(15));
        // Opcionalmente, redirigir manualmente si lo necesitas       
        window.location.href = "UProducto.html";
      });
    });

      //Se asegura que las imagenes de los productos estén cargadas previo a la configuración del filtrado.
      container.imagesLoaded(function () {
        //Configuración inicial del filtrado, mostrando inicialmente todos los productos.
        var $grid = $(".grid").isotope({
            itemSelector: ".all",
            percentPosition: false,
            masonry: {
                columnWidth: ".all"
            }
        });
    
        //Configuración de función de filtrado usando la librería isotope.
        $('.filters_menu li').click(function () {
            $('.filters_menu li').removeClass('active');
            $(this).addClass('active');

            var data = $(this).attr('data-filter');
            $grid.isotope({
                filter: data
            })
        });

        //Permite el filtrado por categoria al desplazarse entre vistas.
        var categoria = localStorage.getItem("categoria")
        if(categoria)
        {
            $('.filters_menu li').removeClass('active');
            $('.filters_menu li[data-filter=".' + categoria + '"]').addClass('active');

            $grid.isotope({
                filter: "." + categoria
            })

            localStorage.removeItem("categoria")
        }
      });
      
    }).fail(function() {
      Swal.fire({
        title: 'Error',
        text: 'Ha ocurrido un error al intentar cargar el listado de productos. Por favor contacte al administrador del sistema.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }); 
});