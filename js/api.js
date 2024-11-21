/* Miguel Fernández Huerta UO287577 */

"use strict"; // para que se haga comprobación de tipos en tiempo de ejecución
class Api
{
    constructor()
    {
        this.cargarLaVueltaPerfecta();
    }

    cargarLaVueltaPerfecta()
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

    cargarModelo3D(files)
    {
        if (files.length === 0) {
            alert("No se seleccionó ningún archivo.");
            return;
        }
    
        const file = files[0];
    
        if (!file.name.endsWith(".glb")) {
            alert("Por favor, selecciona un archivo .glb");
            return;
        }
    
        const seccion = document.createElement("section");
        seccion.setAttribute("id", "modelo-3d");
        document.querySelector("main").appendChild(seccion);
    
        // Configuración del renderizador Three.js
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, seccion.clientWidth / 400, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(seccion.clientWidth, 400); // Ajusta el tamaño según el contenedor
        seccion.appendChild(renderer.domElement);
    
        const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
        light.position.set(0, 200, 0);
        scene.add(light);
    
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(1, 1, 1).normalize();
        scene.add(directionalLight);
    
        // Configuración inicial de la cámara
        camera.position.z = 5;
    
        // Cargar modelo GLB
        const reader = new FileReader();
        reader.onload = function (event) {
            const loader = new THREE.GLTFLoader();
            const arrayBuffer = event.target.result;
    
            loader.parse(arrayBuffer, "", (gltf) => {
                const model = gltf.scene;
                scene.add(model);
                animate();
            }, (error) => {
                console.error("Error al cargar el modelo:", error);
            });
        };
        reader.readAsArrayBuffer(file);
    
        // Animación
        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }
    }
}