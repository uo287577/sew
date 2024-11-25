<!DOCTYPE HTML>

<html lang="es">
<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <title>F1 Desktop viajes</title>
	
	<meta name ="author" content="Miguel Fernández Huerta" />
	<meta name="description" content="Documento que recoge información acerca de los viajes de la F1" />
	<meta name ="keywords" content ="Viajes,viajes,Viaje,viaje" />
	<meta name ="viewport" content ="width=device-width, initial-scale=1.0" />

	<!-- añadir el elemento link de enlace a la hoja de estilo dentro del <head> del documento html -->
	<link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
	<link rel="stylesheet" type="text/css" href="estilo/layout.css" />
	<link rel="icon" href="multimedia/imagenes/favicon.ico" />
	<link rel="stylesheet" href="https://api.mapbox.com/mapbox-gl-js/v2.11.0/mapbox-gl.css" />

	<script src="js/viajes.js"></script>
	<script src="https://api.mapbox.com/mapbox-gl-js/v3.7.0/mapbox-gl.js" defer></script>
</head>

<body>
	<header>
    	<!-- Datos con el contenidos que aparece en el navegador -->
    	<h1><a href="index.html" title="Enlace a la página principal">F1 Desktop</a></h1>
		<nav>
			<a href="index.html" title="Inicio F1 Desktop">Inicio</a>
			<a href="piloto.html" title="Pestaña del piloto">Piloto</a>
			<a href="noticias.html" title="Pestaña de noticias">Noticias</a>
			<a href="calendario.html" title="Pestaña de calendario">Calendario</a>
			<a href="meteorologia.html" title="Pestaña de metereologia">Metereologia</a>
			<a href="circuito.html" title="Pestaña de circuito">Circuito</a>
			<a href="viajes.html" title="Pestaña de viajes" class="active">Viajes</a>
			<a href="juegos.html" title="Pestaña de juegos">Juegos</a>
		</nav>
	</header>

	<!-- Migas -->
	<p>Estás en: Inicio >> Viajes</p>

	<main>
	    <h2>Viajes de la F1</h2>
		<input type="button" value="Obtener mapa estático" onclick="viajes.cargarMapaEstatico();" />

		<script>
			var viajes = new Viajes();
		</script>
	</main>

</body>
</html>