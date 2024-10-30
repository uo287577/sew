/* Miguel Fernández Huerta UO287577 */

/*Dentro del fichero creado en la tarea anterior crea la clase País y añade a dicha clase los atributos
necesarios para representar la siguiente información: nombre del país, nombre de la capital,
nombre del circuito de F1, cantidad de población, tipo de forma de gobierno, coordenadas de la
línea de meta del circuito y religión mayoritaria*/

"use strict";
class País
{
    constructor (nombrePais,nombreCapital,cantidadPoblacion)
    {
        this.nombrePais = nombrePais;
        this.nombreCapital = nombreCapital;
        this.cantidadPoblacion = cantidadPoblacion;
    }

    rellenarInformacionRestante()
    {
        this.nombreCircuito = "Barcelona-Catalunya";
        this.tipoGobierno = "Gobierno autonómico";
        this.coordenadasMetaLatitud = "41.570023°N"
        this.coordenadasMetaLongitud = "2.261216°E";
        this.religionMayoritaria = "Católica";
    }

    getNombrePais()
    {
        return ""+this.nombrePais;
    }

    getNombreCapital()
    {
        return ""+this.nombreCapital;
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
                "<p>"+this.nombreCircuito+"</p>"+
            "</li>"+
            "<li>"+
                "<h4>Cantidad de poblacion:</h4>"+
                "<p>"+this.cantidadPoblacion+"</p>"+
            "</li>"+
            "<li>"+
                "<h4>Forma de gobierno:</h4>"+
                "<p>"+this.tipoGobierno+"</p>"+
            "</li>"+
            "<li>"+
                "<h4>Religión mayoritaria:</h4>"+
                "<p>"+this.religionMayoritaria+"</p>"+
            "</li>"+
        "</ul>";
    }

    escribeCoordenadas()
    {
        document.write(
            "<p>Latitud: "+this.coordenadasMetaLatitud+"</p>"+
            "<p>Longitud: "+this.coordenadasMetaLongitud+"</p>"
        );
    }
}
var pais = new País("España","Barcelona","1.655.956");
pais.rellenarInformacionRestante();
document.write(
    "<section>" +
    "<h3>Información principal</h3>" +
    "<p>Nombre del pais: "+pais.getNombrePais()+"</p>" +
    "<p>Nombre de la capital: "+pais.getNombreCapital()+"</p>" +
    "</section>" +
    "<section>" +
    "<h3>Información secundaria</h3>" +
    pais.getInformacionSecundaria() +
    "</section>" +
    "<section>" +
    "<h3>Coordenadas de la línea de meta del circuito</h3>"
);
pais.escribeCoordenadas();
document.write("</section>");