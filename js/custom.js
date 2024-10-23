// isotope js
$(window).on('load', function () {
    getYear();

    $('.filters_menu li ').click(function () {
        $('.filters_menu li').removeClass('active');
        $(this).addClass('active');

        var data = $(this).attr('data-filter');
        $grid.isotope({
            filter: data
        })
    });

    var $grid = $(".grid").isotope({
        itemSelector: ".all",
        percentPosition: false,
        masonry: {
            columnWidth: ".all"
        }
    })

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

// nice select
$(document).ready(function() {
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
