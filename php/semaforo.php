<?php 
	class Record
	{
		protected $server;
		protected $user;
		protected $pass;
		protected $dbname;

		protected $db;

		public function __construct()
		{
			$this -> server = "localhost";
			$this -> user = "DBUSER2024";
			$this -> pass = "DBPSWD2024";
			$this -> dbname = "records";

			$this -> db = new mysqli($this -> server, $this -> user, $this -> pass, $this -> dbname);
		
			if ($this -> db -> connect_errno)
			{
				exit("<p> Error de conexión: " . $this -> db -> connect_error . "</p");
			}
		}

		public function grabarRecord($nombre, $apellidos, $nivel, $tiempo)
		{
			$query = "INSERT INTO registro (nombre, apellidos, nivel, tiempo) VALUES (?, ?, ?, ?)";
			$queryPre = $this -> db -> prepare($query);
        	$queryPre -> bind_param("ssss", $nombre, $apellidos, $nivel, $tiempo);
        	$queryPre -> execute();
			$queryPre -> close();
		}

		public function mostrarTabla10MejoresRecords($nivel)
		{
			$query = "SELECT nombre, apellidos, tiempo FROM registro WHERE nivel = ? ORDER BY tiempo LIMIT 10";
			$queryPre = $this -> db -> prepare($query);
			$queryPre -> bind_param("s", $nivel);
			$queryPre -> execute();
			$result = $queryPre -> get_result();

			echo "<section>";
			echo "<h2>Ranking</h2>";
			echo "<ol>";
			while($row = $result -> fetch_array())
			{
				echo "<li>" . $row["nombre"] . " " . $row["apellidos"] . ": " . $row["tiempo"] . "</li>";
			}
			echo "</ol>";
			echo "</section>";

			$result -> free();
			$queryPre -> close();
			$this -> db -> close();
		}
	}
?>

<!DOCTYPE HTML>

<html lang="es">
<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <title>F1 Desktop juegos</title>
	
	<meta name ="author" content="Miguel Fernández Huerta" />
	<meta name="description" content="Documento con un juego de reflejos" />
	<meta name ="keywords" content ="Semaforo,semaforo,juego,Juego,juegos,Juegos" />
	<meta name ="viewport" content ="width=device-width, initial-scale=1.0" />

	<!-- añadir el elemento link de enlace a la hoja de estilo dentro del <head> del documento html -->
	<link rel="stylesheet" type="text/css" href="../estilo/estilo.css" />
	<link rel="stylesheet" type="text/css" href="../estilo/layout.css" />
    <link rel="stylesheet" type="text/css" href="../estilo/semaforo_grid.css" />
	<link rel="icon" href="../multimedia/imagenes/favicon.ico" />

	<script src="../js/semaforo.js"></script>
	<script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
</head>

<body>
	<header>
    	<!-- Datos con el contenidos que aparece en el navegador -->
    	<h1><a href="../index.html" title="Enlace a la página principal">F1 Desktop</a></h1>
		<nav>
			<a href="../index.html" title="Inicio F1 Desktop">Inicio</a>
			<a href="../piloto.html" title="Pestaña del piloto">Piloto</a>
			<a href="../noticias.html" title="Pestaña de noticias">Noticias</a>
			<a href="../calendario.html" title="Pestaña de calendario">Calendario</a>
			<a href="../meteorologia.html" title="Pestaña de metereologia">Metereologia</a>
			<a href="../circuito.html" title="Pestaña de circuito">Circuito</a>
			<a href="./viajes.php" title="Pestaña de viajes">Viajes</a>
			<a href="../juegos.html" title="Pestaña de juegos" class="active">Juegos</a>
		</nav>
	</header>

	<!-- Migas -->
	<p>Estás en: Inicio >> Juegos >> Juego del semáforo</p>

	<main>
    	<nav>
			<a href="../memoria.html" title="Juego de memoria">Juego de memoria</a>
            <a href="./semaforo.php" title="Juego del semáforo">Juego del semáforo</a>
			<a href="../api.html" title="Ayrton Senna: Leyenda de la Fórmula 1">Ayrton Senna: Leyenda de la Fórmula 1</a>
		</nav>
        <script>
			var semaforo = new Semáforo();
		</script>
	
	<?php
		if(count($_POST) > 0) // Solo se ejecutará si se han enviado los datos desde el formulario al pulsar el boton Guardar
		{			
			$errorFormulario = false;
			$errorNombre = "";
			$errorApellidos = "";
	
			$formularioPOST  = $_POST;
			$formularioNombre = $_POST["nombre"];
			$formularioApellidos = $_POST["apellidos"];
			$formularioNivel = $_POST["nivel"];
			$formularioTiempo = $_POST["tiempo"];
	
			if($formularioNombre == "") // Comprueba que el nombre no está en blanco
			{
				$errorNombre = " * El nombre es obligatorio ";
				$errorFormulario = true;
			}
			
			if($formularioApellidos == "") // Comprueba que los apellidos no están en blanco
			{
				$errorApellidos = " * Los apellidos son obligatorios";
				$errorFormulario = true;
			}
	
			echo "
			<section>
				<h2>Sube tu puntuación al ranking!</h2>
				<form action='#' method='post' name='formulario'>
					
					<p>Introduzca su nombre: <input type='text' name='nombre' value='' > </p>
					<span>" . $errorNombre . "</span>
	
					<p>Introduzca sus apellidos: <input type='text' name='apellidos' value='' > </p>
					<span>" . $errorApellidos . "</span>
	
					<p>Nivel del juego: <input type='text' name='nivel' value=" . $formularioNivel . " readonly> </p>
	
					<p>Tiempo de reacción: <input type='text' name='tiempo' value='" . $formularioTiempo . "' readonly> </p>

					<input type='submit' value='Guardar' >
				</form>
			</section>
			";
	
			// Información sobre el POST enviado
			if($formularioPOST)
			{
				if ($errorFormulario == true)
				{
					echo "<h4>Formulario NO PROCESADO en el servidor</h4>";
				} else
				{
					// insertar
					$record = new Record();
					$record -> grabarRecord($formularioNombre, $formularioApellidos, $formularioNivel, $formularioTiempo);
						
					// mostrar los 10 mejores records
					$record -> mostrarTabla10MejoresRecords($formularioNivel);
				}
			}
		}
	?>
	</main>

</body>
</html>