/* Miguel Fernández Huerta UO287577 */

"use strict";
class Memoria
{
    #elements =
    [
        {
            "element": "RedBull",
            "source": "multimedia/imagenes/Red_Bull_Racing_logo.svg"
        },
        {
            "element": "RedBull",
            "source": "multimedia/imagenes/Red_Bull_Racing_logo.svg"
        },
        {
            "element": "McLaren",
            "source": "multimedia/imagenes/McLaren_Racing_logo.svg"
        },
        {
            "element": "McLaren",
            "source": "multimedia/imagenes/McLaren_Racing_logo.svg"
        },
        {
            "element": "Alpine",
            "source": "multimedia/imagenes/Alpine_F1_Team_2021_Logo.svg"
        },
        {
            "element": "Alpine",
            "source": "multimedia/imagenes/Alpine_F1_Team_2021_Logo.svg"
        },
        {
            "element": "AstonMartin",
            "source": "multimedia/imagenes/Aston_Martin_Aramco_Cognizant_F1.svg"
        },
        {
            "element": "AstonMartin",
            "source": "multimedia/imagenes/Aston_Martin_Aramco_Cognizant_F1.svg"
        },
        {
            "element": "Ferrari",
            "source": "multimedia/imagenes/Scuderia_Ferrari_Logo.svg"
        },
        {
            "element": "Ferrari",
            "source": "multimedia/imagenes/Scuderia_Ferrari_Logo.svg"
        },
        {
            "element": "Mercedes",
            "source": "multimedia/imagenes/Mercedes_AMG_Petronas_F1_Logo.svg"
        },
        {
            "element": "Mercedes",
            "source": "multimedia/imagenes/Mercedes_AMG_Petronas_F1_Logo.svg"
        },
        {
            "element": "Lotus",
            "source": "multimedia/imagenes/Lotus_f1_team_logo.svg"
        },
        {
            "element": "Lotus",
            "source": "multimedia/imagenes/Lotus_f1_team_logo.svg"
        },
        {
            "element": "Renault",
            "source": "multimedia/imagenes/Renault_f1_team_logo.svg"
        },
        {
            "element": "Renault",
            "source": "multimedia/imagenes/Renault_f1_team_logo.svg"
        },
        {
            "element": "Minardi",
            "source": "multimedia/imagenes/Minardi_f1_team_logo.svg"
        },
        {
            "element": "Minardi",
            "source": "multimedia/imagenes/Minardi_f1_team_logo.svg"
        }
    ];

    #numeroCartas;
    #numeroParejasMaximo;
    #numeroMaximoDeCartasEnTablero;
    
    #cartasElegidas;
    #listaCartasConParejaElegidas;
    
    #hasFlippedCard;
    #lockBoard;
    #firstCard;
    #secondCard;

    constructor()
    {
        this.#numeroMaximoDeCartasEnTablero = 12;
        this.#numeroCartas = this.#elements.length;
        this.#numeroParejasMaximo = this.#numeroMaximoDeCartasEnTablero / 2;
        
        this.#cartasElegidas = new Map(); // almacenará los primeros ("numeroMaximoDeCartasEnTablero" / 2) nombres de escuderías tras barajar las cartas 
        this.#listaCartasConParejaElegidas = []; // almacenará las "numeroMaximoDeCartasEnTablero" cartas finales a generar en el tablero

        this.#hasFlippedCard = false; //  el atributo que indica si ya hay una carta dada la vuelta
        this.#lockBoard = false; // el atributo que indica si el tablero se encuentra bloqueado a la interacción del usuario
        this.#firstCard = null; // el atributo que indica cuál es la primera carta a la que se ha dado la vuelta en esta interacción
        this.#secondCard = null; // el atributo que indica cuál es la segunda carta a la que se ha dado la vuelta en esta interacción

        this.shuffleElements();
        this.createElements();
        this.addEventListeners();
    }

    shuffleElements()
    {
        /* Este método coge el objeto de JSON y baraja los elementos,
        para que las tarjetas estén en un orden diferente en cada partida del juego. Se puede
        utilizar cualquier método de ordenación para recorrer y barajar los elementos, como
        por ejemplo el algoritmo Durstenfeld. */
        for(var i = this.#numeroCartas-1; i > 0; i--)
        {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = this.#elements[i];
            this.#elements[i] = this.#elements[j];
            this.#elements[j] = temp;
        }

        // Escogemos las 6 primeras cartas (sin incluir pareja) barajadas anteriormente
        var indice = 0;
        while(this.#cartasElegidas.size < this.#numeroParejasMaximo)
        {
            var elemento = this.#elements[indice];

            if(!this.#cartasElegidas.has(elemento.element)) // carta no presente en las cartas unicas elegidas
            {
                this.#cartasElegidas.set(elemento.element, elemento.source);
            }

            indice++;
        }

        // Creamos una pareja para cada carta elegida
        this.#cartasElegidas.forEach((valor, clave) =>
        {
            this.#listaCartasConParejaElegidas.push([clave, valor]);
            this.#listaCartasConParejaElegidas.push([clave, valor]);
        });

        // Barajamos la lista final de cartas a generar
        for(var i = this.#listaCartasConParejaElegidas.length-1; i > 0; i--)
        {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = this.#listaCartasConParejaElegidas[i];
            this.#listaCartasConParejaElegidas[i] = this.#listaCartasConParejaElegidas[j];
            this.#listaCartasConParejaElegidas[j] = temp;
        }

    }

    unflipCards()
    {
        /* Este método bloquea el tablero en primer lugar y luego voltea las
        cartas que estén bocarriba y resetea el tablero.
        
        NOTA: para que la ejecución del volteo de las tarjetas y el reseteo del tablero se
        realice con cierto margen temporal después del volteo de la segunda tarjeta se
        puede meter dentro de un delay utilizando el método setTimeout de ECMAScript */

        this.#lockBoard = true;
        this.#firstCard.setAttribute('data-state', 'flip');
        this.#secondCard.setAttribute('data-state', 'flip');
        setTimeout(() =>
        {
            this.#firstCard.removeAttribute('data-state');
            this.#secondCard.removeAttribute('data-state');
            this.resetBoard();

        }, 1000);
    }

    resetBoard()
    {
        /* Pone a null las variables firstCard y secondCard y pone a false las
        variables hasFlippedCard y lockBoard */
        this.#firstCard = null;
        this.#secondCard = null;
        this.#hasFlippedCard = false;
        this.#lockBoard = false;
    }

    checkForMatch()
    {
        /* Comprueba si las cartas volteadas son iguales. Si lo son, llama
        al método disableCards y si no lo son llama al método unflipCards */

        this.#firstCard.getAttribute("data-element") === this.#secondCard.getAttribute("data-element") ? 
            this.disableCards() : this.unflipCards();
    }

    disableCards()
    {
        /* Este método deshabilita las interacciones sobre las tarjetas de
        memoria que ya han sido emparejadas. Para ello modifica el valor del atributo data-state a 
        revealed y después invoca al método resetBoard. */

        this.#firstCard.setAttribute('data-state', 'revealed');
        this.#secondCard.setAttribute('data-state', 'revealed');

        this.resetBoard();
    }

    createElements()
    {
        var main = document.querySelector("body>main");

        var seccion = document.createElement("section"); // creamos la sección que contendrá todo el el juego de memoria
        
        var encabezado = document.createElement("h2"); // creamos el encabezado h2
        var textoEncabezado = document.createTextNode("Juego de memoria"); // creamos el texto del encabezado h2
        encabezado.appendChild(textoEncabezado); // insertamos al encabezado h2 su contenido

        seccion.appendChild(encabezado); // insertamos el encabezado h2 en el bloque section

        for(var i = 0; i < this.#listaCartasConParejaElegidas.length; i++)
        {
            var element = this.#listaCartasConParejaElegidas[i];
            var carta = document.createElement("article");
            carta.setAttribute("data-element", element[0]); // el nombre del nodo como atributo
                
            encabezado = document.createElement("h3"); // creamos el nodo h3
            textoEncabezado = document.createTextNode("Hazme clic"); // creamos el texto del nodo h3
            encabezado.appendChild(textoEncabezado); // insertamos al nodo h3 su contenido
    
            carta.appendChild(encabezado);
    
            var imagen = document.createElement("img"); // creamos el nodo imagen
            imagen.setAttribute("src", element[1]); // el valor de la direccion de la imagen como atributo
            imagen.setAttribute("alt", element[0]); // el texto alternativo de la imagen
    
            carta.appendChild(imagen);
    
            seccion.appendChild(carta);
        }

        main.appendChild(seccion);
    }

    addEventListeners()
    {
        /* Recorre todas las tarjetas creadas en la
        tarea anterior y que provoque una llamada al método flipCard de la clase Memoria cuando se
        lance dicho evento.
        
        NOTA: El método flipCard se debe invocar utilizando la característica bind de JavaScript
        de la siguiente manera: this.flipCard.bind(card, this) */
        
        var cartas = document.querySelectorAll("article");
        for(var i = 0; i < cartas.length; i++)
        {
            var carta = cartas[i];
            carta.onclick = this.flipCard.bind(carta, this);
        }
    }

    flipCard(game)
    {
        /* Se encarga de dar la vuelta a una carta cuando ésta es pulsada.
        Este método recibe como parámetro una variable game que representa el juego. */

        /* En primer lugar se deben realizar tres comprobaciones:
                1. Si la tarjeta pulsada por el usuario ya estaba revelada y formaba parte de una pareja ya descubierta (atributo data-state a revealed), 
                    el método retorna y no hace nada más.
                
                2. Si la propiedad lockBoard del juego estaba al valor true:
                    El método retorna y no hace nada más.

                3. Si la tarjeta pulsada por el usuario coincide con la tarjeta pulsada anteriormente como
                primer elemento de la pareja actual (variable firstCard del juego)
                    el método retorna y no hace nada más.
        */
       
        var carta = this; // en ese momento el this es la carta del for each que hizo la llamada al flipCard

        if(carta.getAttribute('data-state') === 'revealed' || game.#lockBoard || carta === game.#firstCard)
        {
            return;
        }

        /* Si el método continúa su ejecución normal después de las tres comprobaciones anteriores
        porque ninguna de ellas se cumple, se deben realizar las siguientes acciones:
        
            1. Modificar el atributo data-state de la tarjeta al valor flip para que la tarjeta se dé la vuelta y se vea la imagen.

            2. Comprobar si el juego ya tenía una tarjeta volteada a través de la variable flippedCard
                a. En caso negativo, poner la variable flippedCard a verdadero y asignar a la variable firstCard el valor de la tarjeta actual (this).
                
                b. En caso afirmativo, asignar a la variable secondCard el valor de la tarjeta actual(this) e invocar al método checkForMatch.  */

        carta.setAttribute('data-state','flip');

        if(!game.#hasFlippedCard)
        {
            game.#hasFlippedCard = true;
            game.#firstCard = carta;
        } else
        {
            game.#secondCard = carta;
            game.checkForMatch(game.#firstCard,game.#secondCard);
        }
    }
}