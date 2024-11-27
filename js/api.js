/* Miguel Fernández Huerta UO287577 */

"use strict"; // para que se haga comprobación de tipos en tiempo de ejecución
class Api
{
    constructor()
    {
        this.generarSVGMonaco();
        navigator.geolocation.getCurrentPosition(this.calcularDistancia.bind(this), this.errorGeolocalizacion.bind(this));
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
        path.setAttribute("d", "m352.8 4.1504c-13.81 0.8243-23.48 12.177-34.76 18.75-15.132 10.842-32.937 19.166-44.42 34.236-3.8081 11.918 7.2143 21.834 7.6992 33.469 2.3799 12.877-3.9727 27.691-17.039 31.797-21.608 7.9502-44.019-3.3155-66.164-0.58398-15.249 1.2564-30.576 4.4208-45.71 1.0769-13.872-2.7824-28.009-3.0697-42.061-3.0837-20.279-0.65526-40.401-4.4655-60.107-8.5499-9.8358 3.4808-9.1748 16.051-15.302 23.046-9.2645 14.858-16.918 30.931-19.749 48.338-10.382 42.601-16.335 87.914-5.9935 131.09 2.9845 6.9487-1.9927 16.823 5.5254 21.516 8.5182 5.6162 19.511 4.4647 29.15 4.5723 6.3627-3.221 3.5124-12.152-0.89324-15.875-6.8457-7.1679-11.759-15.961-14.144-25.596-4.1818-13.935-6.0953-29.779-0.05469-43.404 4.8274-5.2939 10.31-10.783 10.423-18.477 2.5399-11.575 5.598-24.511-0.11424-35.558-6.7172-18.477 1.3628-38.363 12.014-53.545 5.3451-6.2228 10.439-14.267 18.566-16.574 12.2-1.5865 24.011 3.4785 36.021 4.8867 20.127 4.04 40.985 5.4105 60.521 11.713 5.4989 3.2393 13.36 5.9094 18.477 0.5171 10.835-5.0042 22.484 1.5092 33.75 0.85938 45.376 3.648 94.373-5.7234 129.19-36.775 23.603-21.125 44.441-46.111 58.145-74.801 3.2737-6.3889 3.6047-17.129-4.7976-19.494-8.795-2.811-18.662-1.7299-27.287 1.0391-6.7679 3.5504-5.7201 12.534-1.7773 17.836 2.2246 4.0916 6.7494 10.278 2.7715 14.559-5.2639 1.897-12.792-1.8673-11.882-8.136-1.2118-9.6578-5.9329-20.115-0.9949-29.337 1.655-3.8575-0.53501-8.6517-4.8828-9.2363 2.5888 1.5696-3.0196-1.1724-4.1191-0.27539z");

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