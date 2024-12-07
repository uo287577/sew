/* Miguel Fernández Huerta UO287577 */

"use strict"; // para que se haga comprobación de tipos en tiempo de ejecución
class Api
{
    constructor()
    {
        this.#prepararListeners();
        this.generarSVGMonaco();
        navigator.geolocation.getCurrentPosition(this.calcularDistancia.bind(this), this.errorGeolocalizacion.bind(this));
    }

    #prepararListeners()
    {
        document.querySelector("body > main > section:nth-of-type(3) > label > input").onchange = this.cargarHomenaje.bind(this, this.files);
    }

    generarSVGMonaco()
    {
        var seccion = document.querySelector("main > section:nth-of-type(2)");

        var encabezado = document.createElement("h4");
        var contenido = document.createTextNode("Circuito de Mónaco");
        encabezado.appendChild(contenido);
        seccion.appendChild(encabezado);

        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

        var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M 352.804985 4.150418 C 338.985876 4.966894 329.321084 16.329515 318.042632 22.912351 C 302.901696 33.730654 285.099938 42.065511 273.615486 57.136292 C 269.804503 69.04323 280.842623 78.977018 281.323287 90.611798 C 283.709444 103.488301 277.340637 118.303933 264.276859 122.403322 C 242.664118 130.346951 220.261712 119.086389 198.116806 121.807975 C 182.872871 123.083719 167.543102 126.247562 152.402166 122.896609 C 138.548725 120.106984 124.403452 119.834825 110.344011 119.817816 C 90.070264 119.154429 69.951015 115.344209 50.243766 111.26183 C 40.390141 114.731852 41.076804 127.319186 34.931164 134.31026 C 25.67837 149.159913 18.022069 165.234279 15.189581 182.652428 C 4.803791 225.245246 -1.153017 270.55965 9.198439 313.747815 C 12.185427 320.687859 7.189948 330.553607 14.726083 335.265353 C 23.240713 340.861613 34.227333 339.70494 43.857793 339.824009 C 50.226599 336.609136 47.376944 327.678932 42.982296 323.936752 C 36.132825 316.792589 31.206013 307.998465 28.837023 298.353845 C 24.648374 284.405718 22.742882 268.56949 28.768356 254.944551 C 33.609336 249.671479 39.085479 244.160267 39.188479 236.471788 C 41.746302 224.888038 44.801955 211.960505 39.085479 200.904063 C 32.373341 182.448309 40.44164 162.546713 51.102095 147.356862 C 56.440906 141.148244 61.539384 133.102556 69.659183 130.806218 C 81.864632 129.207287 93.675248 134.27624 105.674698 135.671053 C 125.811112 139.719412 146.668524 141.097215 166.221274 147.390882 C 171.714585 150.622765 179.576885 153.293321 184.675363 147.901179 C 195.52465 142.917275 207.163601 149.432071 218.442053 148.768685 C 263.813361 152.425816 312.806821 143.053354 347.620673 112.010266 C 371.241906 90.883956 392.064985 65.896397 405.763927 37.183666 C 409.042746 30.821959 409.368912 20.071695 400.974447 17.707318 C 392.167985 14.883672 382.31436 15.972307 373.696729 18.744922 C 366.915925 22.299994 367.963087 31.281227 371.911404 36.571309 C 374.125894 40.670698 378.657875 46.862306 374.675225 51.131794 C 369.422247 53.036904 361.886113 49.260703 362.795942 43.001056 C 361.577114 33.339426 356.856301 22.895341 361.80028 13.658959 C 363.448273 9.797709 361.268115 5.017924 356.924967 4.422577 C 359.517123 6.004499 353.903647 3.248893 352.804985 4.150418 Z M 352.804985 4.150418 ");

        svg.appendChild(path);

        seccion.appendChild(svg);
    }

    calcularDistancia(posicion)
    {
        var latUsuario = posicion.coords.latitude;
        var lonUsuario = posicion.coords.longitude;

        var latMonaco = 43.734722222222;
        var lonMonaco = 7.4205555555556;


        // Convertir las coordenadas de grados a radianes
        var lat1_rad = latUsuario * (Math.PI / 180);
        var lon1_rad = lonUsuario * (Math.PI / 180);
        var lat2_rad = latMonaco * (Math.PI / 180);
        var lon2_rad = lonMonaco * (Math.PI / 180);
    
        // Calcular la diferencia de latitudes y longitudes
        var delta_lat = lat2_rad - lat1_rad;
        var delta_lon = lon2_rad - lon1_rad;
    
        // Aplicar la fórmula de Haversine
        var a = Math.pow(Math.sin(delta_lat / 2), 2) + Math.cos(lat1_rad) * Math.cos(lat2_rad) * Math.pow(Math.sin(delta_lon / 2), 2);
        var c = 2 * Math.atan2( Math.sqrt(a), Math.sqrt(1 - a) )
    
        // Radio de la Tierra en kilómetros (aproximadamente 6371 km)
        var R = 6371
    
        // Calcular la distancia
        var distancia = Math.round(R * c);
    
        // Retornar la distancia
        var parrafo = document.querySelector("main > section:nth-of-type(2) > p:last-of-type");
        parrafo.innerHTML = parrafo.textContent + distancia + " kilómetros";
    }

    errorGeolocalizacion()
    {
        document.querySelector("main > section:nth-of-type(2) > p:last-of-type").innerHTML = "No disponible";
    }

    cargarHomenaje(files)
    {
        $("main > p:last-of-type", document.body).remove();

		//Solamente toma un archivo
		//var archivo = document.getElementById("archivoTexto").files[0];
        var archivo = document.querySelector("section:nth-of-type(3) > label > input").files[0];
		
		var nombreFicheroPermitido = "Homenaje.txt";

        if(archivo.name.match(nombreFicheroPermitido))
        {
            this.eliminarCargaFichero();

            var seccion = document.querySelector("section:nth-of-type(3)");

            var thisAuxiliar = this;

		    var lector = new FileReader();
		    lector.onload = function (evento) 
            {
			    //El evento "onload" se lleva a cabo cada vez que se completa con éxito una operación de lectura
			    //La propiedad "result" es donde se almacena el contenido del archivo
			    //Esta propiedad solamente es válida cuando se termina la operación de lectura
			    var lineas = lector.result.split("\n");

                var encabezado = document.createElement("h3");
                var contenido = document.createTextNode(lineas[0]);
                encabezado.appendChild(contenido);
                seccion.appendChild(encabezado);

                thisAuxiliar.cargarImagenMcLarenSenna(seccion);

                $.each(lineas[1].split("@"), (i, linea) =>
                {
                    var parrafo = document.createElement("p");
                    contenido = document.createTextNode(linea);
                    parrafo.appendChild(contenido);
                    seccion.appendChild(parrafo);
                })
		    }
		    lector.readAsText(archivo);

        } else
        {
            $("main", document.body).append( $('<p>Error : ¡¡¡ El fichero cargado no es el "Homenaje.txt" !!!</p>') ); /* Creamos elemento y lo insertamos al final del main */
        }
    }

    cargarImagenMcLarenSenna(seccion)
    {
        var nombreImagenACargar = "McLaren_Senna";
        var picture = document.createElement("picture");
            
        var source = document.createElement("source");
        source.setAttribute("media","(max-width: 465px)");
        source.setAttribute("srcset","multimedia/imagenes/" + nombreImagenACargar + "-465w.webp");
        picture.appendChild(source);

        source = document.createElement("source");
        source.setAttribute("media","(max-width: 799px)");
        source.setAttribute("srcset","multimedia/imagenes/" + nombreImagenACargar + "-799w.webp");
        picture.appendChild(source);

        source = document.createElement("source");
        source.setAttribute("media","(min-width: 800px)");
        source.setAttribute("srcset","multimedia/imagenes/" + nombreImagenACargar + ".webp");
        picture.appendChild(source);

        var img = document.createElement("img");
        img.setAttribute("src","multimedia/imagenes/" + nombreImagenACargar + ".webp");
        img.setAttribute("alt","Imagen del McLaren Senna");
        picture.appendChild(img);

        seccion.appendChild(picture);
    }

    eliminarCargaFichero()
    {
        var seccion = document.querySelector("section:nth-of-type(3)");
        var encabezado = seccion.querySelector("h3:nth-of-type(1)");
        var label = seccion.querySelector("label");

        label.removeChild(label.firstChild); // texto
        label.removeChild(label.firstChild); // input
        
        seccion.removeChild(encabezado);
        seccion.removeChild(label);
    }
}