/* Miguel Fernández Huerta UO287577 */

class Memoria
{
    elements = 
    [
        {
            "element": "RedBull",
            "source": "https://upload.wikimedia.org/wikipedia/de/c/c4/Red_Bull_Racing_logo.svg"
        },
        {
            "element": "RedBull",
            "source": "https://upload.wikimedia.org/wikipedia/de/c/c4/Red_Bull_Racing_logo.svg"
        },
        {
            "element": "McLaren",
            "source": "https://upload.wikimedia.org/wikipedia/en/6/66/McLaren_Racing_logo.svg"
        },
        {
            "element": "McLaren",
            "source": "https://upload.wikimedia.org/wikipedia/en/6/66/McLaren_Racing_logo.svg"
        },
        {
            "element": "Alpine",
            "source": "https://upload.wikimedia.org/wikipedia/fr/b/b7/Alpine_F1_Team_2021_Logo.svg"
        },
        {
            "element": "Alpine",
            "source": "https://upload.wikimedia.org/wikipedia/fr/b/b7/Alpine_F1_Team_2021_Logo.svg"
        },
        {
            "element": "AstonMartin",
            "source": "https://upload.wikimedia.org/wikipedia/fr/7/72/Aston_Martin_Aramco_Cognizant_F1.svg"
        },
        {
            "element": "AstonMartin",
            "source": "https://upload.wikimedia.org/wikipedia/fr/7/72/Aston_Martin_Aramco_Cognizant_F1.svg"
        },
        {
            "element": "Ferrari",
            "source": "https://upload.wikimedia.org/wikipedia/de/c/c0/Scuderia_Ferrari_Logo.svg"
        },
        {
            "element": "Ferrari",
            "source": "https://upload.wikimedia.org/wikipedia/de/c/c0/Scuderia_Ferrari_Logo.svg"
        },
        {
            "element": "Mercedes",
            "source": "https://upload.wikimedia.org/wikipedia/commons/f/fb/Mercedes_AMG_Petronas_F1_Logo.svg"
        },
        {
            "element": "Mercedes",
            "source": "https://upload.wikimedia.org/wikipedia/commons/f/fb/Mercedes_AMG_Petronas_F1_Logo.svg"
        }
    ];

    constructor()
    {
        this.hasFlippedCard = false; //  el atributo que indica si ya hay una carta dada la vuelta
        this.lockBoard = false; // el atributo que indica si el tablero se encuentra bloqueado a la interacción del usuario
        this.firstCard = null; // el atributo que indica cuál es la primera carta a la que se ha dado la vuelta en esta interacción
        this.secondCard = null; // el atributo que indica cuál es la segunda carta a la que se ha dado la vuelta en esta interacción
    }

    shuffleElements()
    {
        /* este método coge el objeto de JSON y baraja los elementos,
        para que las tarjetas estén en un orden diferente en cada partida del juego. Se puede
        utilizar cualquier método de ordenación para recorrer y barajar los elementos, como
        por ejemplo el algoritmo Durstenfeld. */
        for(var i = this.elements.length-1; i > 0; i--)
        {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = this.elements[i];
            this.elements[i] = this.elements[j];
            this.elements[j] = temp;
        }
    }

    unflipCards()
    {
        /* este método bloquea el tablero en primer lugar y luego voltea las
        cartas que estén bocarriba y resetea el tablero.
        
        NOTA: para que la ejecución del volteo de las tarjetas y el reseteo del tablero se
        realice con cierto margen temporal después del volteo de la segunda tarjeta se
        puede meter dentro de un delay utilizando el método setTimeout de ECMAScript */

        setTimeout(() =>
        {
            this.lockBoard = true;
            var imagenCarta1 = this.elements[this.firstCard].source;
            var imagenCarta2 = this.elements[this.secondCard].source;

            var carta1 = document.querySelector("article>img[src='"+imagenCarta1+"']");
            var carta2 = document.querySelector("article>img[src='"+imagenCarta2+"']");

            carta1.setAttribute('data-state', 'flip');
            carta2.setAttribute('data-state', 'flip');
            this.resetBoard();
        }, 2500);

    }

    resetBoard()
    {
        /* pone a null las variables firstCard y secondCard y pone a false las
        variables hasFlippedCard y lockBoard */
        this.firstCard = null;
        this.secondCard = null;
        this.hasFlippedCard = false;
        this.lockBoard = false;
    }

    checkForMatch()
    {
        /* comprueba si las cartas volteadas son iguales. Si lo son, llama
        al método disableCards y si no lo son llama al método unflipCards */
        this.elements[this.firstCard].element === this.elements[this.secondCard].element ? disableCards() : unflipCards();
    }

    disableCards()
    {
        /* este método deshabilita las interacciones sobre las tarjetas de
        memoria que ya han sido emparejadas. Para ello modifica el valor del atributo data-state a 
        revealed y después invoca al método resetBoard. */
        var imagenCarta1 = this.elements[this.firstCard].source;
        var imagenCarta2 = this.elements[this.secondCard].source;

        var carta1 = document.querySelector("article>img[src='"+imagenCarta1+"']");
        var carta2 = document.querySelector("article>img[src='"+imagenCarta2+"']");

        carta1.setAttribute('data-state', 'revealed');
        carta2.setAttribute('data-state', 'revealed');

        /*article.onclick = function() {
	        this.setAttribute();
  
            setTimeout(() => {
                this.removeAttribute('data-state');
            }, 2500);
        };*/

        this.resetBoard();
    }

    createElements()
    {
        for(var i = 0; i < this.elements.length; i++)
        {
            var element = this.elements[i];
            var node = document.createElement("article");
            node.setAttribute("data-element", element.element); // el nombre del nodo como atributo
            
            var encabezado = document.createElement("h3"); // creamos el nodo h3
            var contenidoEncabezado = document.createTextNode("Tarjeta de memoria"); // creamos el contenido del nodo h3
            encabezado.appendChild(contenidoEncabezado); // añadimos al nodo h3 su contenido

            node.appendChild(encabezado);

            var imagen = document.createElement("img"); // creamos el nodo imagen
            imagen.setAttribute("src", element.source); // el valor de la direccion de la imagen como atributo
            imagen.setAttribute("alt", element.element); // el texto alternativo de la imagen

            node.appendChild(imagen);

            var seccion = document.querySelector("body>main>section");
            seccion.appendChild(node);
        }
    }
}
var memoria = new Memoria();
memoria.shuffleElements();
memoria.createElements();