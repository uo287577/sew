/* Miguel Fernández Huerta UO287577 */

"use strict"; // para que se haga comprobación de tipos en tiempo de ejecución
class Circuito
{
    constructor()
    {
        if (window.File && window.FileReader && window.FileList && window.Blob) // Si el navegador soporta el uso de la API File de HTML5...
        {
            // El navegador soporta el uso de la API File de HTML5
        } else
        {
            document.write("<p>¡¡¡ Este navegador NO soporta el API File y este programa puede no funcionar correctamente !!!</p>");
            this.deshabilitarCargaDeFichero();
        }
    }

    deshabilitarCargaDeFichero()
    {
        this.deshabilitarCargaDeFicheroXML();
        this.deshabilitarCargaDeFicheroKML();
        this.deshabilitarCargaDeFicheroSVG();
    }

    deshabilitarCargaDeFicheroXML()
    {
        document.querySelector("section:nth-of-type(1) > label:nth-of-type(1) > input").setAttribute("disabled","true");
    }

    deshabilitarCargaDeFicheroKML()
    {
        document.querySelector("section:nth-of-type(1) > label:nth-of-type(2) > input").setAttribute("disabled","true");
    }

    deshabilitarCargaDeFicheroSVG()
    {
        document.querySelector("section:nth-of-type(1) > label:nth-of-type(3) > input").setAttribute("disabled","true");
    }

    cargarXML(files)
    {
        $("main > p:last-of-type", document.body).remove();

		//Solamente toma un archivo
		//var archivo = document.getElementById("archivoTexto").files[0];
        var archivo = document.querySelector("section:nth-of-type(1) > label:nth-of-type(1) > input").files[0];
		
		//Solamente admite archivos de tipo xml
        var tipoXML = "text/xml"; // Tipo MIME de un XML

        if(archivo.type.match(tipoXML))
        {
            this.deshabilitarCargaDeFicheroXML();

            this.crearCamposXML(archivo);

		    var areaVisualizacion = $("main > section:last-of-type > pre:nth-of-type(1)", document.body); // seleccionamos el elemento de la seccion

		    var lector = new FileReader();
		    lector.onload = function (evento) 
            {
			    //El evento "onload" se lleva a cabo cada vez que se completa con éxito una operación de lectura
			    //La propiedad "result" es donde se almacena el contenido del archivo
			    //Esta propiedad solamente es válida cuando se termina la operación de lectura
			    areaVisualizacion.text(lector.result);
		    }
		    lector.readAsText(archivo);
        } else
        {
            $("main", document.body).append( $("<p>Error : ¡¡¡ Archivo no válido, debe ser un XML !!!</p>") ); /* Creamos elemento y lo insertamos al final del main */
        }
    }

    crearCamposXML(archivo)
    {
        var seccion = $("<section></section>"); // creamos el elemento HTML section

        var encabezado = $("<h3>Archivo XML</h3>");
        seccion.append(encabezado);

        var nombreArchivo = $("<p></p>"); // creamos elemento HTML
        nombreArchivo.text("Nombre del archivo: " + archivo.name);
        seccion.append(nombreArchivo);

        var tamArchivo = $("<p></p>"); // creamos el elemento HTML
        tamArchivo.text("Tamaño del archivo: " + archivo.size + " bytes");
        seccion.append(tamArchivo);

        var tipoArchivo = $("<p></p>"); // creamos el elemento HTML
        tipoArchivo.text("Tipo del archivo: " + archivo.type);
        seccion.append(tipoArchivo);

        var ultimaModificacion = $("<p></p>"); // creamos el elemento HTML
        ultimaModificacion.text("Fecha de la última modificación: " + archivo.lastModifiedDate);
        seccion.append(ultimaModificacion);

        var contenidoArchivo = $("<p></p>"); // creamos el elemento HTML
        contenidoArchivo.text("Contenido del archivo de texto:");
        seccion.append(contenidoArchivo);

        var areaTexto = $("<pre></pre>"); // creamos el elemento HTML
        seccion.append(areaTexto);

        var errorLectura = $("<p></p>"); // creamos el elemento HTML
        seccion.append(errorLectura);

        $("main", document.body).append(seccion); // insertamos la seccion creada al final del main
    }

    cargarKML(files)
    {
        $("main > p:last-of-type", document.body).remove();

		//Solamente toma un archivo
		//var archivo = document.getElementById("archivoTexto").files[0];
        var archivo = document.querySelector("section:nth-of-type(1) > label:nth-of-type(2) > input").files[0];
        var thisAuxiliar = this; // para no perder el this
		
		//Solamente admite archivos de tipo kml
        var tipoDelArchivo = archivo.name.split(".")[1]; 
        var tipoKML = "kml";

        if(tipoDelArchivo.match(tipoKML))
        {
            this.deshabilitarCargaDeFicheroKML();

		    var lector = new FileReader();
		    lector.onload = function (evento) 
            {
			    //El evento "onload" se lleva a cabo cada vez que se completa con éxito una operación de lectura
			    //La propiedad "result" es donde se almacena el contenido del archivo
			    //Esta propiedad solamente es válida cuando se termina la operación de lectura
			    var contenido = lector.result;

                var lineas = contenido.replace(/\r/g, "").trim().split(/<coordinates>.*/)[1].split(/<.coordinates>/)[0];
                var tuplasCoordenadas = lineas.trim().split("\n");
                
                var listaCoordenadas = [];
                $.each(tuplasCoordenadas, (i,tupla) =>
                {
                    var textoCoordenadas = tupla.split(",");
                    var longitud = parseFloat(textoCoordenadas[0]);
                    var latitud = parseFloat(textoCoordenadas[1]);
                    listaCoordenadas.push([longitud, latitud]);
                });

                thisAuxiliar.crearCamposKML(listaCoordenadas);
		    }
		    lector.readAsText(archivo);
        } else
        {
            $("main", document.body).append( $("<p>Error : ¡¡¡ Archivo no válido, debe ser un KML !!!</p>") ); /* Creamos elemento y lo insertamos al final del main */
        }
    }

    crearCamposKML(coordenadas)
    {
        var seccion = document.createElement("section");
        
        var encabezado = document.createElement("h3");
        var contenido = document.createTextNode("Archivo KML");
        encabezado.appendChild(contenido);

        seccion.appendChild(encabezado);

        var contenedor = document.createElement("div");
        seccion.appendChild(contenedor);

        $("main", document.body).append(seccion);


        mapboxgl.accessToken = "pk.eyJ1IjoidW8yODc1NzciLCJhIjoiY20zZWJ4YzRmMDkwcDJscXhjNXM3aW9vMCJ9.jR-t68S8KY-oTEkfHCv01w";
        
        var map = new mapboxgl.Map({
            container: contenedor,
            style: 'mapbox://styles/mapbox/streets-v9',
            zoom: 15,
            attributionControl: false
        });
    
        map.addControl(new mapboxgl.NavigationControl({
            showZoom: true, // Mostrar el control de zoom
            showCompass: false // Ocultar la brújula
          }), 'top-left');

        map.resize();

        // Agregar la polyline al mapa usando las coordenadas extraídas
        map.on('load', () => {
            map.addSource('kmlPolyline', {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    geometry: {
                        type: 'LineString',
                        coordinates: coordenadas
                    }
                }
            });

            map.addLayer({
                id: 'kmlPolylineLayer',
                type: 'line',
                source: 'kmlPolyline',
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': '#FF0000', // Color de la línea
                    'line-width': 3 // Grosor de la línea
                }
            });

            // Ajustar el mapa a los límites de la polyline
            const bounds = coordenadas.reduce((bounds, coord) => {
                return bounds.extend(coord);
            }, new mapboxgl.LngLatBounds(coordenadas[0], coordenadas[0]));

            map.fitBounds(bounds, { padding: 20 });
        });
    }

    cargarSVG(files)
    {
        $("main > p:last-of-type", document.body).remove();
		//Solamente toma un archivo
		//var archivo = document.getElementById("archivoTexto").files[0];
        var archivo = document.querySelector("section:nth-of-type(1) > label:nth-of-type(3) > input").files[0];
		
		//Solamente admite archivos de tipo svg
        var tipoDelArchivo = archivo.name.split(".")[1]; 
        var tipoSVG = "svg";
        
        if(tipoDelArchivo.match(tipoSVG))
        {
            this.deshabilitarCargaDeFicheroSVG();
            this.crearCamposSVG(archivo);

            var seccionCampos = $("main > section:last-of-type", document.body);

		    var lector = new FileReader();
		    lector.onload = function (evento) 
            {
			    //El evento "onload" se lleva a cabo cada vez que se completa con éxito una operación de lectura
			    //La propiedad "result" es donde se almacena el contenido del archivo
			    //Esta propiedad solamente es válida cuando se termina la operación de lectura
                
                var lineas = lector.result.replace(/></g,">\n<").split("\n");
                var atributosSVG = lineas[1].split("xmlns=")[1].split(" ");
                var atributoXMLNS = atributosSVG[0].split('"')[1];
                var atributoVersion = atributosSVG[1].split("version=")[1].split(">")[0].split('"')[1];
                
                var svg = document.createElementNS(atributoXMLNS, "svg");
                var puntos = [];
                $.each(lineas, (i,linea) =>
                {
                    if(i > 2 && i < lineas.length-3) // estas lineas son ya coordenadas
                    {
                        linea = linea.replace(/\t/,"").trim();
                        
                        if(i === 3) // primeras coordenadas
                        {
                            linea = linea.split('"')[1];
                        } else if(i === lineas.length-4) // ultimas coordenadas
                        {
                            linea = linea.split('"')[0];
                            puntos.push(linea);
                            return;
                        }
                        puntos.push(linea + " ");
                    }
                })

                var puntosFormateados = "";
                $.each(puntos, (i, punto) =>
                {
                    var coords = punto.split(",");
                    puntosFormateados += coords[0]+","+coords[1];
                    puntosFormateados = puntosFormateados.trim();
                    if(i < puntos.length-1)
                    {
                        puntosFormateados += " "
                    }
                });

                var polyline = document.createElementNS(atributoXMLNS, "polyline");
                polyline.setAttribute("points", puntosFormateados);
                svg.appendChild(polyline);
                
                seccionCampos.append(svg);
		    }
		    lector.readAsText(archivo);
        } else
        {
            $("main", document.body).append( $("<p>Error : ¡¡¡ Archivo no válido, debe ser un SVG !!!</p>") ); /* Creamos elemento y lo insertamos al final del main */
        }
    }

    crearCamposSVG(archivo)
    {
        var seccion = $("<section></section>"); // creamos el elemento HTML section

        var encabezado = $("<h3>Archivo SVG</h3>");
        seccion.append(encabezado);

        $("main", document.body).append(seccion); // insertamos la seccion creada al final del main
    }
}