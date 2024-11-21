/* Miguel Fernández Huerta UO287577 */

"use strict"; // para que se haga comprobación de tipos en tiempo de ejecución
class Api
{
    constructor()
    {
        this.cargarImagenDeAyrton();
        this.cargarInformacionDeAyrton();
        this.cargarLaVueltaPerfecta();
        this.cargarHomenaje();
    }

    cargarImagenDeAyrton()
    {
        var imagen = document.createElement("img");
        imagen.setAttribute("src", "multimedia/imagenes/Ayrton_Senna.webp");
        imagen.setAttribute("alt", "Imagen de Ayrton Senna");

        document.querySelector("main").appendChild(imagen);
    }

    cargarInformacionDeAyrton()
    {
        var resumenDeSenna = "" +
        "Ayrton Senna da Silva (1960-1994) fue mucho más que un piloto de automovilismo brasileño; fue una leyenda de la Fórmula 1 y un héroe nacional en Brasil." +
        "Nacido en São Paulo, su pasión por la velocidad comenzó desde muy joven, destacándose en el karting antes de dar el salto a la categoría reina del automovilismo en 1984." +
        "Conquistó tres campeonatos mundiales de Fórmula 1 (1988, 1990 y 1991) al volante de McLaren, ganándose el respeto y la admiración de millones gracias a su habilidad única" + 
        "para conducir bajo la lluvia, su extraordinaria rapidez en las clasificaciones (obtuvo 65 poles position) y su enfoque agresivo y apasionado en las pistas." + 
        "Su rivalidad con Alain Prost se convirtió en una de las más icónicas de la historia del deporte." +
        "Senna perdió la vida de forma trágica durante el Gran Premio de San Marino en 1994, en el circuito de Imola." + 
        "Sin embargo, su legado permanece intacto, no solo por su talento al volante, sino también por su labor humanitaria, que marcó profundamente a su país natal." + 
        "Su memoria sigue inspirando a nuevas generaciones dentro y fuera de las pistas."


        var seccion = document.createElement("section");

        var encabezado = document.createElement("h3");
        var contenido = document.createTextNode("Resumen sobre Ayrton Senna");
        encabezado.appendChild(contenido);

        var parrafo = document.createElement("p");
        contenido = document.createTextNode(resumenDeSenna);
        parrafo.appendChild(contenido);

        seccion.appendChild(encabezado);
        seccion.appendChild(parrafo);

        $("main", document.body).append(seccion);
    }

    cargarLaVueltaPerfecta()
    {
        var seccion = document.createElement("section");

        var encabezado = document.createElement("h3");
        var contenido = document.createTextNode("La vuelta perfecta");
        encabezado.appendChild(contenido);
        seccion.appendChild(encabezado);

        var parrafo = document.createElement("p");
        contenido = document.createTextNode(
            "El Gran Premio de Mónaco de 1988 puede ser considerado como la luz y sombra de Ayrton Senna. " +
            "Muchos recuerdan su actuación el sábado 14 de mayo y una vuelta que se define como perfecta, con la que logró la pole superando a su compañero en McLaren, el francés Alain Prost. " +
            "El brasileño hizo una vuelta en 1:23.998 que endosó 1,4 segundos al registro del francés (1:25.425), en un día que el cuatro veces campeón del mundo aún tiene en la mente. " +
            '"Fue muy especial"'+", dijo Prost a la cadena británica. "+'"Pero, si nos fijamos en los tiempos de clasificación cuando estuvimos juntos, eso no ocurrió una sola vez, sino unas tres o cuatro. Él era mucho más rápido que yo en clasificación, pero un poco menos en condiciones de carrera".');
        parrafo.appendChild(contenido);
        seccion.appendChild(parrafo);

        encabezado = document.createElement("h4");
        contenido = document.createTextNode("Circuito de Mónaco");
        encabezado.appendChild(contenido);
        seccion.appendChild(encabezado);

        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

        var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "m352.8 4.1504c-13.81 0.8243-23.48 12.177-34.76 18.75-15.132 10.842-32.937 19.166-44.42 34.236-3.8081 11.918 7.2143 21.834 7.6992 33.469 2.3799 12.877-3.9727 27.691-17.039 31.797-21.608 7.9502-44.019-3.3155-66.164-0.58398-15.249 1.2564-30.576 4.4208-45.71 1.0769-13.872-2.7824-28.009-3.0697-42.061-3.0837-20.279-0.65526-40.401-4.4655-60.107-8.5499-9.8358 3.4808-9.1748 16.051-15.302 23.046-9.2645 14.858-16.918 30.931-19.749 48.338-10.382 42.601-16.335 87.914-5.9935 131.09 2.9845 6.9487-1.9927 16.823 5.5254 21.516 8.5182 5.6162 19.511 4.4647 29.15 4.5723 6.3627-3.221 3.5124-12.152-0.89324-15.875-6.8457-7.1679-11.759-15.961-14.144-25.596-4.1818-13.935-6.0953-29.779-0.05469-43.404 4.8274-5.2939 10.31-10.783 10.423-18.477 2.5399-11.575 5.598-24.511-0.11424-35.558-6.7172-18.477 1.3628-38.363 12.014-53.545 5.3451-6.2228 10.439-14.267 18.566-16.574 12.2-1.5865 24.011 3.4785 36.021 4.8867 20.127 4.04 40.985 5.4105 60.521 11.713 5.4989 3.2393 13.36 5.9094 18.477 0.5171 10.835-5.0042 22.484 1.5092 33.75 0.85938 45.376 3.648 94.373-5.7234 129.19-36.775 23.603-21.125 44.441-46.111 58.145-74.801 3.2737-6.3889 3.6047-17.129-4.7976-19.494-8.795-2.811-18.662-1.7299-27.287 1.0391-6.7679 3.5504-5.7201 12.534-1.7773 17.836 2.2246 4.0916 6.7494 10.278 2.7715 14.559-5.2639 1.897-12.792-1.8673-11.882-8.136-1.2118-9.6578-5.9329-20.115-0.9949-29.337 1.655-3.8575-0.53501-8.6517-4.8828-9.2363 2.5888 1.5696-3.0196-1.1724-4.1191-0.27539z");

        svg.appendChild(path);

        seccion.appendChild(svg);
        document.querySelector("main").appendChild(seccion);
    }

    cargarHomenaje()
    {
        var seccion = document.createElement("section");

        var encabezado = document.createElement("h3");
        var contenido = document.createTextNode("Homenaje de McLaren");
        
        encabezado.appendChild(contenido);
        seccion.appendChild(encabezado);

        var parrafo = document.createElement("p");
        contenido = document.createTextNode("En honor y homenaje al piloto, en 2018, McLaren creó el hipercoche McLaren Senna.");
        parrafo.appendChild(contenido);
        seccion.appendChild(parrafo);

        parrafo = document.createElement("p");
        contenido = document.createTextNode("Este hiperdeportivo porta un motor V8 de 4.0 litros biturbo que generaba unos 800 caballos de fuerza y 800 Nm de par pesando tan solo unos 1198 kg gracias a su chasis de fibra de carbono, permitiendo hacer el 0 a 100 km/h en unos 2.8 segundos con una velocidad máxima de 335 km/h (208 mph).");
        parrafo.appendChild(contenido);
        seccion.appendChild(parrafo);

        parrafo = document.createElement("p");
        contenido = document.createTextNode("Pero lo que le hace destacar al Mclaren Senna es su desarrollada aerodinámica, ya que a los 250 km/h genera la impresionante carga aerodinámica de 800 kg (7840 Newtons aprox) gracias a su alerón trasero activo, difusor y gran cantidad de conductor aerodinámicos." +
            " Esta enorme cantidad de carga logra que el McLaren Senna pueda tomar curvas muy exigentes mientras mantiene una increíble estabilidad y manejo a altas velocidades, sobre todo en circuito.");
        parrafo.appendChild(contenido);
        seccion.appendChild(parrafo);

        parrafo = document.createElement("p");
        contenido = document.createTextNode("Si todavía piensas que el McLaren Senna es un hiperdeportivo que te vas a encontrar en cualquier esquina estás muy equivocado." +
            " Se fabricaron tan solo unas 500 unidades de este modelo y fueron vendidas en el mercado con un precio de 853.000 euros y, por suerte o desgracia, todas tienen dueño.");
        parrafo.appendChild(contenido);
        seccion.appendChild(parrafo);

        
        // crear boton "cargar modelo 3-d"
        var label ;



        document.querySelector("main").appendChild(seccion);

    }
}