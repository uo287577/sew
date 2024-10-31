/* Miguel Fernández Huerta UO287577 */

"use strict";
class Semáforo
{
    levels = [0.2, 0.5, 0.8]; /* Array con las dificultades del juego */
    lights = 4; /* Entero que representa el número de luces del semáforo */
    unload_moment = null; /* Flecha que almacena el momento en el que se inicia la secuencia de apagado del semaforo */
    clic_moment = null; /* Flecha que almacena el momento en el que el usuario pulsa el botón que determina su tiempo de reacción */

    constructor()
    {
        this.difficulty = this.levels[Math.floor(Math.random() * this.levels.length)]; /* Elige una dificutad del array de dificultades de forma aleatoria */
        this.createStructure();
    }

    createStructure()
    {
        /* Método encargado de crear en el documento HTML las luces del semáforo y el resto
        de elementos que se utilizarán en el juego a través de ECMAScript */

        /* Este método debe añadir dentro de la etiqueta main del documento los siguientes elementos: 
            -Un encabezado para el título del juego
            -Tantos bloques div para luces del semáforo como número de luces tenga la variable lights
            -Dos botones: 
                -Uno para arrancar el semáforo
                -Otro que se pulse para obtener el tiempo de reacción. */
        var main = document.querySelector("body>main");
        var seccion = document.createElement("section"); // creamos el elemento sección que contendrá todo el juego del semáforo
        
        var encabezado = document.createElement("h2"); // creamos el elemento encabezado h2
        var contenidoEncabezado = document.createTextNode("Juego del semáforo"); // creamos el contenido del elemento h2

        encabezado.appendChild(contenidoEncabezado); // insertamos el contenido del encabezado
        seccion.appendChild(encabezado); // insertamos el encabezado en el section del documento

        for(var i = 0; i < this.lights; i++) // crearemos tantos bloques div como luces tenga el semáforo (variable lights) 
        {
            var bloqueDiv = document.createElement("div"); // creamos el bloque div i-ésimo
            seccion.appendChild(bloqueDiv); // insertamos el bloque div creado en el section del documento html
        }

        var botonArrancar = document.createElement("button"); // creamos el elemento button que arrancará el semáforo
        var textoBotonArrancar = document.createTextNode("Arranque"); // creamos el texto que tendrá el botón de arranque del semáforo
        botonArrancar.appendChild(textoBotonArrancar); // insertamos el texto del botón de arranque del semáforo en dicho botón
        botonArrancar.setAttribute("type","button");
        botonArrancar.onclick = this.initSequence.bind(this);
        seccion.appendChild(botonArrancar); // insertamos el botón de arrancar el semáforo en el section del documento html

        var botonParar = document.createElement("button"); // creamos el elemento button que detendrá el semáforo (y luego se obtendrá y mostrará el tiempo de reacción obtenido)
        var textoBotonParar = document.createTextNode("Reacción"); // creamos el texto que tendrá el botón de detención del semáforo
        botonParar.appendChild(textoBotonParar); // insertamos el texto del botón de detención del semáforo en dicho botón
        botonParar.setAttribute("type","button");
        botonParar.onclick = this.stopReaction.bind(this);
        botonParar.setAttribute("disabled","true");
        seccion.appendChild(botonParar); // insertamos el botón de parar el semáforo en el section del documento html

        main.appendChild(seccion); // insertamos la sección con todo el juego del semáforo en el main del documento html
    }

    initSequence()
    {
        var seccion = document.querySelector("body>main>section");
        var parrafoReaccion = document.querySelector("body>main>section>p:last-child");
        if(parrafoReaccion)
        {
            seccion.removeChild(parrafoReaccion);
        }

        document.querySelector("body>main").classList.add("load"); // añadimos a la etiqueta main la clase load
        document.querySelector("body>main>section>button:first-of-type").setAttribute("disabled","true"); // asignamos el valor true al atributo disabled del botón de arranque del semáforo

        setTimeout(() =>
        {
            this.unload_moment = new Date().getTime();
            this.endSequence();
        }, this.difficulty*100 + 1500);
    }

    endSequence()
    {
        /* Habilita el segundo botón del juego, para que el usuario pueda pulsarlo y registrar su tiempo de reacción.
        Dentro de este método también se debe añadir la clase unload a la etiqueta main del documento para que se ejecute el apagado de las luces del semáforo. */
        document.querySelector("body>main").classList.remove("load");
        document.querySelector("body>main>section>button:nth-of-type(2)").removeAttribute("disabled");
        document.querySelector("body>main").classList.add("unload"); // añadimos a la etiqueta main la clase unload
        
    }

    stopReaction()
    {
        /* Realiza las siguientes acciones, por orden:
            -Primero, obtener la fecha actual y guardarla en la variable clic_moment.
            
            -Segundo, calcular la diferencia entre los valores de las variables unload_moment y clic_moment en milisegundos, 
            siendo esta diferencia el tiempo de reacción del usuario.
            
            -Tercero, crear un párrafo donde informar el usuario de su tiempo de reacción y mostrarlo por pantalla.
            
            -Cuarto, quitar las clases load y unload de la etiqueta main.
            
            -Quinto, deshabilitar el botón "Reacción" y habilitar el botón "Arranque" */
            this.clic_moment = new Date().getTime();
            var diferencia = ((this.clic_moment - this.unload_moment)/1000).toFixed(3);

            var parrafo = document.createElement("p");
            var rellenoParrafo = document.createTextNode("Tiempo de reacción: " + diferencia + " milisegundos");
            parrafo.appendChild(rellenoParrafo);

            var seccion = document.querySelector("body>main>section");
            seccion.appendChild(parrafo);

            var main = document.querySelector("body>main");
            main.classList.remove("load");
            main.classList.remove("unload");

            document.querySelector("body>main>section>button:first-of-type").removeAttribute("disabled"); 
            document.querySelector("body>main>section>button:nth-of-type(2)").setAttribute("disabled","true");
    }
}

var semaforo = new Semáforo();