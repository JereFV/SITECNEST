$(document).ready(function() {
    // Cargar y mostrar productos dinámicamente desde el archivo JSON
    $.getJSON('productos.json', function(data) {
      const container = $('#contenedor_productos');
      
      data.forEach(producto => {
        const card = 
        `<div class="col-sm-6 col-lg-4 all ${producto.categoria}">         
            <div class="card" style="width: 20rem;">
              <div class="image-container">
                <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                <span class="precio-articulo">₡${producto.precio}</span>         
              </div>       
              <h4>${producto.nombre}</h4>
              <div class="botones-section">
                <a href="#" class="btn btn-primary"><span class="fa fa-shopping-cart">&nbsp;</span>Añadir al carrito</a>
              </div>                                        
            </div>
          </div>`;
        
        container.append(card);
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