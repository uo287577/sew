/* Miguel Fernández Huerta UO287577 */

"use strict"; // para que se haga comprobación de tipos en tiempo de ejecución
class Viajes
{
    #mensaje;
    #longitud;
    #latitud;
    #precision;
    #altitud;
    #precisionAltitud;
    #rumbo;
    #velocidad;
    #permisoConcedido;

    constructor()
    {
        this.#prepararListeners();
        navigator.geolocation.getCurrentPosition(this.getPosicion.bind(this), this.verErrores.bind(this));
    }

    #prepararListeners()
    {
        document.querySelector("body > main > input").onclick = this.cargarMapaEstatico.bind(this);
    }

    getPosicion(posicion)
    {
        this.#mensaje = "Se ha realizado correctamente la petición de geolocalización";
        this.#longitud         = posicion.coords.longitude; 
        this.#latitud          = posicion.coords.latitude;  
        this.#precision        = posicion.coords.accuracy;
        this.#altitud          = posicion.coords.altitude;
        this.#precisionAltitud = posicion.coords.altitudeAccuracy;
        this.#rumbo            = posicion.coords.heading;
        this.#velocidad        = posicion.coords.speed;
        
        this.#permisoConcedido = true;
    }
    
    verErrores(error)
    {
        switch(error.code) {
        case error.PERMISSION_DENIED:
            this.#mensaje = "El usuario no permite la petición de geolocalización"
            break;
        case error.POSITION_UNAVAILABLE:
            this.#mensaje = "Información de geolocalización no disponible"
            break;
        case error.TIMEOUT:
            this.#mensaje = "La petición de geolocalización ha caducado"
            break;
        case error.UNKNOWN_ERROR:
            this.#mensaje = "Se ha producido un error desconocido"
            break;
        }

        this.#permisoConcedido = false;
    }

    cargarMapaEstatico()
    {
        if(this.#permisoConcedido)
        {
            var seccion = document.createElement("section");

            var encabezadoMapaEstatico = document.createElement("h3");
            var textoEncabezadoMapaEstatico = document.createTextNode("Mapa estático con la ubicación del usuario");
            encabezadoMapaEstatico.appendChild(textoEncabezadoMapaEstatico);
            seccion.appendChild(encabezadoMapaEstatico);

            var mapaEstatico = document.createElement("img");
    
            var api_token = "sk.eyJ1IjoidW8yODc1NzciLCJhIjoiY20zZWMyaWxqMGF6MzJrcXVwaDM3aGRidCJ9.TnDDAka6FTuDbdG2YolY2g";
            var zoom = 15; // zoom: 1 (el mundo), 5 (continentes), 10 (ciudad), 15 (calles), 20 (edificios)
            var tamMapa = "600x500"; // se define el tamaño en pixeles
            var colorPin = "ff0000";
    
            var api_url = "https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/"
            +"pin-s+"+colorPin
            +"("+this.#longitud+","+this.#latitud+")/"
            +this.#longitud+","
            +this.#latitud+","
            +zoom+",0/"
            +tamMapa
            +"?access_token="+api_token;
    
            mapaEstatico.setAttribute("src", api_url);
            mapaEstatico.setAttribute("alt", "Mapa geográfico de tu ubicación actual");
    
            seccion.appendChild(mapaEstatico);
            document.querySelector("main").appendChild(seccion);
        } else
        {
            var parrafoPermisoNoConcedido = document.createElement("p");
            var textoPermisoNoConcedido = document.createTextNode("Permiso de ubicación denegado, no se ha podido cargar el mapa estático");
            parrafoPermisoNoConcedido.appendChild(textoPermisoNoConcedido);
            document.querySelector("main").appendChild(parrafoPermisoNoConcedido);
        }

        document.querySelector("main > input:nth-of-type(1)").remove();

        this.cargarMapaDinamico();
    }

    cargarMapaDinamico()
    {
        var contenedor = document.createElement("div");
        document.querySelector("main").appendChild(contenedor);


        mapboxgl.accessToken = "pk.eyJ1IjoidW8yODc1NzciLCJhIjoiY20zZWJ4YzRmMDkwcDJscXhjNXM3aW9vMCJ9.jR-t68S8KY-oTEkfHCv01w";
        
        var map = new mapboxgl.Map({
            container: contenedor,
            style: 'mapbox://styles/mapbox/streets-v9',
            zoom: 15,
            center: [this.#longitud, this.#latitud],
            attributionControl: false
        });
    
        map.addControl(new mapboxgl.NavigationControl({
            showZoom: true, // Mostrar el control de zoom
            showCompass: false // Ocultar la brújula
          }), 'top-left');

        new mapboxgl.Marker({color: 'red'})
        .setLngLat([this.#longitud, this.#latitud])
        .addTo(map);
          
        map.resize();
    }

    crearCarrusel()
    {
        const slides = document.querySelectorAll("article img");

        /* var linkContenido = "";
        slides.forEach((slide, i) =>
        {
            linkContenido = slide.getAttribute("src");
            linkContenido = linkContenido.replace("_m","_b");
            slide.setAttribute("src", linkContenido);
        }); */


        // select next slide button
        const nextSlide = document.querySelector("article button:nth-of-type(1)");

        // current slide counter
        let curSlide = 3;
        // maximum number of slides
        let maxSlide = slides.length - 1;

        // add event listener and navigation functionality
        nextSlide.addEventListener("click", function ()
        {
            // check if current slide is the last and reset current slide
            if (curSlide === maxSlide)
            {
                curSlide = 0;
            } else
            {
                curSlide++;
            }

            //   move slide by -100%
            slides.forEach((slide, indx) =>
            {
  	            var trans = 100 * (indx - curSlide);
                $(slide).css('transform', 'translateX(' + trans + '%)')
            });
        });

        // select next slide button
        const prevSlide = document.querySelector("article button:nth-of-type(2)");

        // add event listener and navigation functionality
        prevSlide.addEventListener("click", function ()
        {
            // check if current slide is the first and reset current slide to last
            if (curSlide === 0)
            {
                curSlide = maxSlide;
            } else
            {
                curSlide--;
            }

            //   move slide by 100%
            slides.forEach((slide, indx) =>
            {
  	            var trans = 100 * (indx - curSlide);
                $(slide).css('transform', 'translateX(' + trans + '%)')
            });
        });
    }
}