/* Miguel Fernández Huerta UO287577 */

"use strict"; // para que se haga comprobación de tipos en tiempo de ejecución
class País
{
    #nombrePais;
    #nombreCapital;
    #cantidadPoblacion;
    #nombreCircuito;
    #tipoGobierno;
    #coordenadasMetaLatitud;
    #coordenadasMetaLongitud;
    #religionMayoritaria;

    constructor (nombrePais,nombreCapital,cantidadPoblacion)
    {
        this.#nombrePais = nombrePais;
        this.#nombreCapital = nombreCapital;
        this.#cantidadPoblacion = cantidadPoblacion;
    }

    rellenarInformacionRestante()
    {
        this.#nombreCircuito = "Barcelona-Catalunya";
        this.#tipoGobierno = "Gobierno autonómico";
        this.#coordenadasMetaLatitud = "41.570023°N"
        this.#coordenadasMetaLongitud = "2.261216°E";
        this.#religionMayoritaria = "Católica";
    }

    getNombrePais()
    {
        return ""+this.#nombrePais;
    }

    getNombreCapital()
    {
        return ""+this.#nombreCapital;
    }

    getInformacionSecundaria()
    {
        /*Un método que devuelva la información secundaria del país (nombre del circuito,
            población, forma de gobierno y religión mayoritaria) con la estructura de una lista de
            HTML5 dentro de una cadena. */
        return ""+
        "<ul>"+
            "<li>"+
                "<h4>Nombre del circuito:</h4>"+
                "<p>"+this.#nombreCircuito+"</p>"+
            "</li>"+
            "<li>"+
                "<h4>Cantidad de poblacion:</h4>"+
                "<p>"+this.#cantidadPoblacion+"</p>"+
            "</li>"+
            "<li>"+
                "<h4>Forma de gobierno:</h4>"+
                "<p>"+this.#tipoGobierno+"</p>"+
            "</li>"+
            "<li>"+
                "<h4>Religión mayoritaria:</h4>"+
                "<p>"+this.#religionMayoritaria+"</p>"+
            "</li>"+
        "</ul>";
    }

    escribeCoordenadas()
    {
        document.write(
            "<p>Latitud: "+this.#coordenadasMetaLatitud+"</p>"+
            "<p>Longitud: "+this.#coordenadasMetaLongitud+"</p>"
        );
    }

    cargarInformacion()
    {
        this.rellenarInformacionRestante();
        document.write(
    	    "<section>" +
    		    "<h3>Información principal</h3>" +
    		    "<p>Nombre del pais: "+this.getNombrePais()+"</p>" +
    			"<p>Nombre de la capital: "+this.getNombreCapital()+"</p>" +
    		"</section>" +
    		"<section>" +
    			"<h3>Información secundaria</h3>" +
    			this.getInformacionSecundaria() +
    		"</section>" +
    		"<section>" +
    			"<h3>Coordenadas de la línea de meta del circuito</h3>"
			);
			this.escribeCoordenadas();
			document.write("</section>");
			this.getMeteorologia();
    }

    getMeteorologia()
    {
        var meteo = new Object();
        meteo.api_key = "831cab2c404338e9dcc087de107bd37e";
        meteo.lat = 41.564792;
        meteo.lon = 2.261216;
        meteo.units = "metric";
        meteo.mode = "xml";
        meteo.lang = "es";
        meteo.api_link = "https://api.openweathermap.org/data/2.5/forecast?"+
            "lat="+meteo.lat+
            "&lon="+meteo.lon+
            "&units="+meteo.units+
            "&mode="+meteo.mode+
            "&lang="+meteo.lang+
            "&appid="+meteo.api_key;
            
        $.ajax({
            dataType: meteo.mode,
            url: meteo.api_link,
            method: 'GET',
            success: function(xmlRecuperado)
            {
                var registros = $("time",xmlRecuperado); // obtenemos todas las marcas de tiempo
                
                var fechaMarca = registros.attr("from"); // obtengo la fecha del registro i-esimo
                var FechaHora;
                var horaMarca;
                var diaMarca = fechaMarca.split("T")[0].split("-")[2]; // obtenemos el dia del registro
                var horaDelRegistroQueQueremosMostrar = "15";
                var diaProcesado = diaMarca; // esta variable local me va a permitir guardar el día del registro i-esimo para evitar procesar la meteorologia del mismo dia

                // procesamiento del resto de registros
                $.each(registros,function(i,registro)
                {
                    fechaMarca = $(registro).attr("from"); // obtengo la fecha del registro i-esimo
                    FechaHora = fechaMarca.split("T");
                    diaMarca = FechaHora[0].split("-")[2]; // obtenemos el dia del registro i-esimo
                    horaMarca = FechaHora[1].split(":")[0]; // obtenemos la hora del registro

                    if(diaProcesado !== diaMarca && horaMarca === horaDelRegistroQueQueremosMostrar)
                    {
                        // obtenemos la informacion
                        var temperatura = $("temperature", registro);
                        var temperaturaMaxima = temperatura.attr("max");
                        var temperaturaMinima = temperatura.attr("min");
                        var porcentajeHumedad = $("humidity", registro).attr("value") + "%";
                        var iconoTiempo = "https://openweathermap.org/img/wn/"+$("symbol", registro).attr("var")+"@2x.png".replace("@2x","@4x");
                        var cantidadLluvia = $("precipitation", registro).attr("quantity");
                        if(cantidadLluvia == undefined)
                        {
                            cantidadLluvia = "No disponible";
                        }


                        var articulo = document.createElement("article");
                        
                        //--------------------- Imagen ---------------------//
                        var imagen = document.createElement("img");
                        imagen.setAttribute("src", iconoTiempo);
                        imagen.setAttribute("alt","Icono representativo de la meteorología del día");
                        articulo.appendChild(imagen);

                        //--------------------- Temperatura maxima ---------------------//
                        var cabeceraTempMaxima = document.createElement("h3");
                        var contenidoTempMaxima = document.createTextNode("Temperatura maxima");
                        cabeceraTempMaxima.appendChild(contenidoTempMaxima);
                        articulo.appendChild(cabeceraTempMaxima);

                        var parrafoTempMaxima = document.createElement("p");
                        contenidoTempMaxima = document.createTextNode(temperaturaMaxima + "°Celsius");
                        parrafoTempMaxima.appendChild(contenidoTempMaxima);
                        articulo.appendChild(parrafoTempMaxima);

                        //--------------------- Temperatura minima ---------------------//
                        var cabeceraTempMinima = document.createElement("h3");
                        var contenidoTempMinima = document.createTextNode("Temperatura minima");
                        cabeceraTempMinima.appendChild(contenidoTempMinima);
                        articulo.appendChild(cabeceraTempMinima);

                        var parrafoTempMinima = document.createElement("p");
                        contenidoTempMinima = document.createTextNode(temperaturaMinima + "°Celsius");
                        parrafoTempMinima.appendChild(contenidoTempMinima);
                        articulo.appendChild(parrafoTempMinima);

                        //--------------------- Porcentaje de humedad ---------------------//
                        var cabeceraHumedad = document.createElement("h3");
                        var contenidoHumedad = document.createTextNode("Porcentaje de humedad");
                        cabeceraHumedad.appendChild(contenidoHumedad);
                        articulo.appendChild(cabeceraHumedad);

                        var parrafoHumedad = document.createElement("p");
                        contenidoHumedad = document.createTextNode(porcentajeHumedad);
                        parrafoHumedad.appendChild(contenidoHumedad);
                        articulo.appendChild(parrafoHumedad);

                        //--------------------- Cantidad de lluvia ---------------------//
                        var cabeceraLluvia = document.createElement("h3");
                        var contenidoLluvia = document.createTextNode("Cantidad de lluvia");
                        cabeceraLluvia.appendChild(contenidoLluvia);
                        articulo.appendChild(cabeceraLluvia);

                        var parrafoLluvia = document.createElement("p");
                        contenidoLluvia = document.createTextNode(cantidadLluvia);
                        parrafoLluvia.appendChild(contenidoLluvia);
                        articulo.appendChild(parrafoLluvia);

                        document.querySelector("body > main").appendChild(articulo);

                        // actualizamos la variable auxiliar
                        diaProcesado = diaMarca;
                    }


                });
            },
            error: function()
            {
                alert("No ha sido posible cargar la información de meteorología");
            }
        });
    }
}