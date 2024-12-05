<?php 
	class Era
	{
		protected $server;
		protected $user;
		protected $pass;
        protected $dbname;

		protected $db;

        protected static $nombresEras = array("Motores Atmosféricos", "Aspiración Mixta", "Motores V10 y V12", "Motores V8", "Motores Híbridos");
        protected static $nombresFicheros = array("motores_atmosfericos.csv", "aspiracion_mixta.csv", "motores_v10_y_v12.csv", "motores_v8.csv", "motores_hibridos.csv");

		public function __construct()
		{
			$this -> server = "localhost";
			$this -> user = "DBUSER2024";
			$this -> pass = "DBPSWD2024";
            $this -> dbname = "eras";

			$this -> db = new mysqli($this -> server, $this -> user, $this -> pass);
		
			if ($this -> db -> connect_errno)
			{
				exit("<p> Error de conexión: " . $this -> db -> connect_error . "</p");
			}
		}

        public function crearBBDD()
        {
            // procesa el fichero eras.sql que contiene las instrucciones sql de creación de la base de datos y de sus tablas en sus estados iniciales
            $fichero = fopen("./" . $this -> dbname . ".sql", "r");

            $lineaCrearBBDD = 0;
            while(!feof($fichero))
            {
                $query = fgets($fichero);
                $queryPre = $this -> db -> prepare($query);

                if($queryPre -> execute() === FALSE)
                {
                    echo "<p>ERROR en la Base de Datos 'eras'. Error: " . $this -> db -> error . "</p>";
                    
                    $queryPre -> close();
                    $this -> cerrarConexion();
                    fclose($fichero);
                    exit();
                }

                if($lineaCrearBBDD == 0)
                {
                    $this -> db -> select_db($this -> dbname);
                    $lineaCrearBBDD++;
                }

                $queryPre -> close();
            }
            echo "<p>La base de datos ha sido creada e inicializada correctamente</p>";
            fclose($fichero);
        }

        public function importarEra($ficheroCSV, $nombreTabla)
        {
            if($this -> isTablaYaImportada($nombreTabla))
            {
                $this -> mostrarTablaTiemposEra($nombreTabla);
                return;
            }
            

            $this -> db -> select_db($this -> dbname);
            $fichero = fopen("./".$ficheroCSV, "r");

            if($fichero !== FALSE)
            {
                while(!feof($fichero))
                {
                    $campos = fgetcsv($fichero);

                    $query = "INSERT INTO `" . $nombreTabla . "`(`Circuito`, `Piloto`, `Coche`, `Tiempo`) VALUES (?,?,?,?)";
                    $queryPre = $this -> db -> prepare($query);
        	        $queryPre -> bind_param("ssss", $campos[0], $campos[1], $campos[2], $campos[3]);
    
                    if($queryPre -> execute() === 0)
                    {
                        echo "<p>ERROR en la importación de datos. Error: " . $this -> db -> error . "</p>";
                        
                        $queryPre -> close();
                        $this -> db -> close();
                        fclose($fichero);
                        exit();
                    }

                    $queryPre -> close();
                }
                echo "<p>Los datos han sido importados a la base de datos correctamente</p>";
                fclose($fichero);

                $this -> mostrarTablaTiemposEra($nombreTabla);
            }
        }

        private function isTablaYaImportada($nombreTabla)
        {
            $this->db->select_db($this->dbname);

            $query = "SELECT * FROM `" . $nombreTabla . "`";
            $queryPre = $this -> db -> prepare($query);
            $queryPre -> execute();
            $resultados = $queryPre -> get_result();

            $res = $resultados -> num_rows === 0 ? false : true;

            $resultados -> free();
			$queryPre -> close();
            return $res;
        }

        private function mostrarTablaTiemposEra($nombreTabla)
        {
            $seccion = "<section>";
            $encabezadoTabla = '<h3>Mejores tiempos de la era de los ' . strtolower($nombreTabla) . '</h3>';
            $seccion .= $encabezadoTabla;

            $tabla = "<table>";

            $fila1 = "<tr>";
            $fila1 .= '<th scope="col" id="circuito">Circuito</th>';
            $fila1 .= '<th scope="col" id="piloto">Piloto</th>';
            $fila1 .= '<th scope="col" id="coche">Coche</th>';
            $fila1 .= '<th scope="col" id="tiempo">Tiempo</th>';
            $fila1 .= "</tr>";
            $tabla .= $fila1;

            
            $query = "SELECT * FROM `" . $nombreTabla . "`";
            $queryPre = $this -> db -> prepare($query);
            $queryPre -> execute();
            $resultados = $queryPre -> get_result(); // obtenemos el conjunto de los resultados de la query en un array
            $resultados -> data_seek(0); // se posiciona al inicio del resultado de busqueda
            
            while($fila = $resultados -> fetch_assoc())
            {
                $filaDatos = "<tr>";
                
                $columnas = '<td headers="circuito">' . $fila["Circuito"] . '</td>'; 
                $columnas .= '<td headers="piloto">' . $fila["Piloto"] . '</td>';
                $columnas .= '<td headers="coche">' . $fila["Coche"] . '</td>';
                $columnas .= '<td headers="tiempo">' . $fila["Tiempo"] . '</td>';

                $filaDatos .= $columnas;
                $filaDatos .= "</tr>";

                $tabla .= $filaDatos;
            }

            $tabla .= "</table>";

            $seccion .= $tabla;
            $seccion .= "</section>";

            $resultados -> free();
			$queryPre -> close();
            
            echo $seccion;
        }

        public function exportarEra($nombreTabla)
        {
            $this -> db -> select_db($this -> dbname);

            $query = "SELECT * FROM `" . $nombreTabla . "`";
            $queryPre = $this -> db -> prepare($query);
            $queryPre -> execute();
            $resultados = $queryPre -> get_result(); // obtenemos el conjunto de los resultados de la query en un array
            $resultados -> data_seek(0); // se posiciona al inicio del resultado de busqueda

            $file = fopen($nombreTabla."_exported.csv", "w");

            $lineaInicial = "Circuito,Piloto,Coche,Tiempo" . "\n";

            fwrite($file, $lineaInicial);
            
            
            while ($fila = $resultados -> fetch_row())
            {
                $columnas = $fila[0] . "," . $fila[1] . "," . $fila[2] . "," . $fila[3] . "\n";

                fwrite($file, $columnas);
            }
        
            fclose($file);
            $resultados -> free();
            $queryPre -> close();
            echo "Datos exportados a " . $nombreTabla."_exported.csv" . ".";
        }

        public function getNombreEra($numeroEra)
        {
            if($numeroEra >= 0 && $numeroEra < count(self::$nombresEras)) return self::$nombresEras[$numeroEra];
        }

        public function getNombreFicheroCorrespondienteALaEra($numeroEra)
        {
            if($numeroEra >= 0 && $numeroEra < count(self::$nombresFicheros)) return self::$nombresFicheros[$numeroEra];
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
	<meta name="description" content="Documento que recoge información acerca de las diferentes eras de la F1" />
	<meta name ="keywords" content ="Eras,eras,Era,era" />
	<meta name ="viewport" content ="width=device-width, initial-scale=1.0" />

	<!-- añadir el elemento link de enlace a la hoja de estilo dentro del <head> del documento html -->
	<link rel="stylesheet" type="text/css" href="../estilo/estilo.css" />
	<link rel="stylesheet" type="text/css" href="../estilo/layout.css" />
	<link rel="icon" href="../multimedia/imagenes/favicon.ico" />
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
			<a href="../viajes.php" title="Pestaña de viajes">Viajes</a>
			<a href="../juegos.html" title="Pestaña de juegos" class="active">Juegos</a>
		</nav>
	</header>

	<!-- Migas -->
	<p>Estás en: Inicio >> Juegos >> Eras de la F1</p>

	<main>
        <nav>
			<a href="../memoria.html" title="Juego de memoria">Juego de memoria</a>
            <a href="../semaforo.php" title="Juego del semáforo">Juego del semáforo</a>
			<a href="../api.html" title="Ayrton Senna: Leyenda de la Fórmula 1">Ayrton Senna: Leyenda de la Fórmula 1</a>
            <a href="./eras.php" title="Eras de la fórmula 1">Eras de la fórmula 1</a>
		</nav>

        <section>
	        <h2>Eras de la F1</h2>
		    <p>A lo largo de la historia la F1 ha pasado por muchos cambios en su reglamentación, desde las medidas de seguridad hasta los diferentes motores de los monoplazas</p>
            <p>Los monoplazas no siempre tuvieron los motores V6 turbo híbridos de 1.6 litros que se usan hoy en día. Cada normativa de motor forma una era en la historia de la F1, hoy te vengo a mostrar 5 eras de los motores de la F1</p>
        </section>

        <section>
            <form action='#' method='POST'>
                <p>Pulsa para crear la base de datos
                    <input type='submit' value='Crear base de datos' name='Crear' >
                </p>
            </form>
        </section>

        <section>
            <h3>Motores Atmosféricos (1950-1960)</h3>
            <p>bla bla bla</p>

            <section>
                <h4>Importar datos de la época</h4>
                <form action='#' method='POST' enctype="multipart/form-data">
                    <p>Seleccione el fichero "motores_atmosfericos.csv"
                        <input type='file' name='archivo_csv_1' >
                    </p>
                    <p>Pulse para importar los datos de la época
                        <input type='submit' value='Importar' name='Cargar_era_1' >
                    </p>
                </form>
            </section>

            <section>
                <h4>Exportar datos de la época</h4>
                <form action="#" method="POST">
                    <p>Pulse para exportar los datos de la época
                        <input type="submit" value="Exportar" name="Exportar_era_1">
                    </p>
                </form>
            </section>
        </section>

        <section>
            <h3>Aspiración Mixta (1961-1988)</h3>
            <p>bla bla bla</p>

            <section>
                <h4>Importar datos de la época</h4>
                <form action='#' method='POST' enctype="multipart/form-data">
                    <p>Seleccione el fichero "aspiracion_mixta.csv"
                        <input type='file' name='archivo_csv_2' >
                    </p>
                    <p>Pulse para importar los datos de la época
                        <input type='submit' value='Importar' name='Cargar_era_2' >
                    </p>
                </form>
            </section>

            <section>
                <h4>Exportar datos de la época</h4>
                <form action="#" method="POST">
                    <p>Pulse para exportar los datos de la época
                        <input type="submit" value="Exportar" name="Exportar_era_2">
                    </p>
                </form>
            </section>
        </section>

        <section>
            <h3>Motores V10 y V12 (1989-2005)</h3>
            <p>Esta era es un tanto especial ya que no se dividide en dos eras (una la V10 y otra la V12).</p>
            <p>Esto es porque estos dos motores compartieron marco normativo siendo posible usar tanto los V10 como los V12, entonces es considerada como una sola época</p>

            <section>
                <h4>Importar datos de la época</h4>
                <form action='#' method='POST' enctype="multipart/form-data">
                    <p>Seleccione el fichero "motores_v10_y_v12.csv"
                        <input type='file' name='archivo_csv_3' >
                    </p>
                    <p>Pulse para importar los datos de la época
                        <input type='submit' value='Importar' name='Cargar_era_3' >
                    </p>
                </form>
            </section>

            <section>
                <h4>Exportar datos de la época</h4>
                <form action="#" method="POST">
                    <p>Pulse para exportar los datos de la época
                        <input type="submit" value="Exportar" name="Exportar_era_3">
                    </p>
                </form>
            </section>
        </section>

        <section>
            <h3>Motores V8 (2006-2013)</h3>
            <p>bla bla bla</p>

            <section>
                <h4>Importar datos de la época</h4>
                <form action='#' method='POST' enctype="multipart/form-data">
                    <p>Seleccione el fichero "motores_v8.csv"
                        <input type='file' name='archivo_csv_4' >
                    </p>
                    <p>Pulse para importar los datos de la época
                        <input type='submit' value='Importar' name='Cargar_era_4' >
                    </p>
                </form>
            </section>

            <section>
                <h4>Exportar datos de la época</h4>
                <form action="#" method="POST">
                    <p>Pulse para exportar los datos de la época
                        <input type="submit" value="Exportar" name="Exportar_era_4">
                    </p>
                </form>
            </section>
        </section>

        <section>
            <h3>Motores Híbridos (2014-presente)</h3>
            <p>bla bla bla</p>

            <section>
                <h4>Importar datos de la época</h4>
                <form action='#' method='POST' enctype="multipart/form-data">
                    <p>Seleccione el fichero "motores_hibridos.csv"
                        <input type='file' name='archivo_csv_5' >
                    </p>
                    <p>Pulse para importar los datos de la época
                        <input type='submit' value='Importar' name='Cargar_era_5' >
                    </p>
                </form>
            </section>

            <section>
                <h4>Exportar datos de la época</h4>
                <form action="#" method="POST">
                    <p>Pulse para exportar los datos de la época
                        <input type="submit" value="Exportar" name="Exportar_era_5">
                    </p>
                </form>
            </section>
        </section>

        <?php
            $era = new Era();
            
            if(count($_POST) > 0) // solo se ejecutará si se ha pulsado uno de los inputs
            {
                if(isset($_POST["Crear"])) $era -> crearBBDD();

                if($_FILES) // solo se ejecutará si se han enviado ficheros
                {
                    if(isset($_POST["Cargar_era_1"]) && $_POST["Cargar_era_1"])
                    {
                        $ficheroCSV = $_FILES["archivo_csv_1"]["name"];
                        $numeroEra = 0;

                        if($era -> getNombreFicheroCorrespondienteALaEra($numeroEra) === $ficheroCSV) $era -> importarEra($ficheroCSV, $era -> getNombreEra($numeroEra));
                    }

                    if(isset($_POST["Cargar_era_2"]) && $_POST["Cargar_era_2"])
                    {
                        $ficheroCSV = $_FILES["archivo_csv_2"]["name"];
                        $numeroEra = 1;

                        if($era -> getNombreFicheroCorrespondienteALaEra($numeroEra) === $ficheroCSV) $era -> importarEra($ficheroCSV, $era -> getNombreEra($numeroEra));
                    }

                    if(isset($_POST["Cargar_era_3"]) && $_POST["Cargar_era_3"])
                    {
                        $ficheroCSV = $_FILES["archivo_csv_3"]["name"];
                        $numeroEra = 2;

                        if($era -> getNombreFicheroCorrespondienteALaEra($numeroEra) === $ficheroCSV) $era -> importarEra($ficheroCSV, $era -> getNombreEra($numeroEra));
                    }

                    if(isset($_POST["Cargar_era_4"]) && $_POST["Cargar_era_4"])
                    {
                        $ficheroCSV = $_FILES["archivo_csv_4"]["name"];
                        $numeroEra = 3;

                        if($era -> getNombreFicheroCorrespondienteALaEra($numeroEra) === $ficheroCSV) $era -> importarEra($ficheroCSV, $era -> getNombreEra($numeroEra));
                    }

                    if(isset($_POST["Cargar_era_5"]) && $_POST["Cargar_era_5"])
                    {
                        $ficheroCSV = $_FILES["archivo_csv_5"]["name"];
                        $numeroEra = 4;

                        if($era -> getNombreFicheroCorrespondienteALaEra($numeroEra) === $ficheroCSV) $era -> importarEra($ficheroCSV, $era -> getNombreEra($numeroEra));
                    }
                }

                if (isset($_POST["Exportar_era_1"]))
                {
                    $numeroEra = 0;
                    $era -> exportarEra($era -> getNombreEra($numeroEra));
                }

                if (isset($_POST["Exportar_era_2"]))
                {
                    $numeroEra = 1;
                    $era -> exportarEra($era -> getNombreEra($numeroEra));
                }
    
                if (isset($_POST["Exportar_era_3"]))
                {
                    $numeroEra = 2;
                    $era -> exportarEra($era -> getNombreEra($numeroEra));
                }

                if (isset($_POST["Exportar_era_4"]))
                {
                    $numeroEra = 3;
                    $era -> exportarEra($era -> getNombreEra($numeroEra));
                }

                if (isset($_POST["Exportar_era_5"]))
                {
                    $numeroEra = 4;
                    $era -> exportarEra($era -> getNombreEra($numeroEra));
                }
            }
        ?>
	</main>

</body>
</html>