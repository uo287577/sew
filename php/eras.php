<?php  
    session_start(); // iniciamos la sesion

	class Era
	{
		protected $server;
		protected $user;
		protected $pass;
        protected $dbname;

		protected $db;

        public static $nombresErasFicheros = array(
            0 => array("Nombre_era" => "Motores Atmosféricos", "Nombre_fichero" => "motores_atmosfericos.csv"),
            1 => array("Nombre_era" => "Aspiración Mixta", "Nombre_fichero" => "aspiracion_mixta.csv"),
            2 => array("Nombre_era" => "Motores V10 y V12", "Nombre_fichero" => "motores_v10_y_v12.csv"),
            3 => array("Nombre_era" => "Motores V8", "Nombre_fichero" => "motores_v8.csv"),
            4 => array("Nombre_era" => "Motores Híbridos", "Nombre_fichero" => "motores_hibridos.csv"),
        );

        protected $tabla;

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

            $this -> tabla = null;
		}

        public function __destruct()
        {
            $this -> cerrarConexion();
        }

        public function cerrarConexion()
        {
            $this -> db -> close();
        }

        public function getTabla()
        {
            return $this -> tabla;
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

        private function isBBDDCreada()
        {
            try
            {
                $this -> db -> select_db($this -> dbname);
                return true;
            } catch (mysqli_sql_exception $e)
            {
                echo "<p>Ha ocurrido un error con la base de datos, vuelve a crearla</p>";
                return false;
            }
        }

        public function importarEra($ficheroCSV, $nombreTabla)
        {
            if($this -> isBBDDCreada())
            {
                if($this -> isTablaYaImportada($nombreTabla))
                {
                    $this -> computarTablaTiemposEra($nombreTabla);
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
                            $this -> cerrarConexion();
                            fclose($fichero);
                            exit();
                        }
    
                        $queryPre -> close();
                    }
                    echo "<p>Los datos han sido importados a la base de datos correctamente</p>";
                    fclose($fichero);
    
                    $this -> computarTablaTiemposEra($nombreTabla);
                }
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

        private function computarTablaTiemposEra($nombreTabla)
        {
            $nombreDistintivoTabla = str_replace(" ", "", $nombreTabla);

            $seccion = "<section>";
            $encabezadoTabla = '<h3>Mejores tiempos de la era de los ' . strtolower($nombreTabla) . '</h3>';
            $seccion .= $encabezadoTabla;

            $tabla = "<table>";

            $fila1 = "<tr>";
            $fila1 .= '<th scope="col" id="circuito' . $nombreDistintivoTabla . '">Circuito</th>';
            $fila1 .= '<th scope="col" id="piloto' . $nombreDistintivoTabla . '">Piloto</th>';
            $fila1 .= '<th scope="col" id="coche' . $nombreDistintivoTabla . '">Coche</th>';
            $fila1 .= '<th scope="col" id="tiempo' . $nombreDistintivoTabla . '">Tiempo</th>';
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
                
                $columnas = '<td headers="circuito' . $nombreDistintivoTabla . '">' . $fila["Circuito"] . '</td>'; 
                $columnas .= '<td headers="piloto' . $nombreDistintivoTabla . '">' . $fila["Piloto"] . '</td>';
                $columnas .= '<td headers="coche' . $nombreDistintivoTabla . '">' . $fila["Coche"] . '</td>';
                $columnas .= '<td headers="tiempo' . $nombreDistintivoTabla . '">' . $fila["Tiempo"] . '</td>';

                $filaDatos .= $columnas;
                $filaDatos .= "</tr>";

                $tabla .= $filaDatos;
            }

            $tabla .= "</table>";

            $seccion .= $tabla;
            $seccion .= "</section>";

            $resultados -> free();
			$queryPre -> close();

            $this -> tabla = $seccion;
        }

        public function exportarEra($nombreTabla)
        {
            if($this -> isBBDDCreada())
            {
                $this -> db -> select_db($this -> dbname);
    
                $query = "SELECT * FROM `" . $nombreTabla . "`";
                $queryPre = $this -> db -> prepare($query);
                $queryPre -> execute();

                $resultados = $queryPre -> get_result();
                $resultados -> data_seek(0); // se posiciona al inicio del resultado de busqueda
    
                $file = fopen($nombreTabla."_exported.csv", "w");
    
                $lineaInicial = "Circuito,Piloto,Coche,Tiempo" . "\n";
    
                fwrite($file, $lineaInicial);
                
                
                while ($fila = $resultados -> fetch_assoc())
                {
                    $columnas = $fila["Circuito"] . "," . $fila["Piloto"] . "," . $fila["Coche"] . "," . $fila["Tiempo"] . "\n";
    
                    fwrite($file, $columnas);
                }
            
                fclose($file);
                $resultados -> free();
                $queryPre -> close();
            }
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
    <link rel="stylesheet" type="text/css" href="../estilo/eras.css" />
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
		    <p>La Fórmula 1 ha evolucionado a lo largo de los años, con cambios que van desde la seguridad en los coches hasta la tecnología de sus motores.</p>
            <p>Los monoplazas no siempre han llevado los motores V6 turbo híbridos de 1.6 litros que vemos hoy en día. Cada tipo de motor ha marcado una era en la F1, y aquí exploramos cinco de esas épocas que han dejado una huella en la historia de este deporte.</p>
        </section>

        <article>
            <h3>Creación de la base de datos</h3>
            <form action='#' method='POST'>
                <label>Pulsa para crear la base de datos
                    <input type='submit' value='Crear base de datos' name='Crear' >
                </label>
            </form>

            <?php
                $era = new Era();
            
                if(isset($_POST["Crear"]))
                {
                    $era -> crearBBDD();
                    
                    $_SESSION["tabla1"] = null;
                    $_SESSION["tabla2"] = null;
                    $_SESSION["tabla3"] = null;
                    $_SESSION["tabla4"] = null;
                    $_SESSION["tabla5"] = null;
                }
            ?>
        </article>

        <section>
            <h3>Motores Atmosféricos (1950-1960)</h3>
            <p>Durante esta época, la Fórmula 1 estaba dando sus primeros pasos. 
                Los coches contaban con motores de hasta 4.5 litros en su mayoría, o de 1.5 litros con sobrealimentación en algunos casos. 
                La potencia no era tan elevada como en los días de hoy, pero los pilotos se encargaban de exprimir al máximo lo que tenían.</p>
            <p>Juan Manuel Fangio fue una figura dominante, ganando títulos con diferentes equipos como Alfa Romeo y Maserati. 
                Era una época de fiabilidad y resistencia, y los circuitos, como Silverstone y Monza, se convirtieron en míticos. 
                Los coches eran relativamente simples, pero la habilidad del piloto era clave.</p>

            <?php 
                $era = new Era();
                $tablaGenerada = null;

                if($_FILES) // solo se ejecutará si se han enviado ficheros
                {
                    if(isset($_POST["Cargar_era_1"]))
                    {
                        $ficheroCSV = $_FILES["archivo_csv_1"]["name"];

                        if(Era::$nombresErasFicheros[0]["Nombre_fichero"] === $ficheroCSV)
                        {
                            $era -> importarEra($ficheroCSV, Era::$nombresErasFicheros[0]["Nombre_era"]);
                            $tablaGenerada = $era -> getTabla();
                        }
                    }

                    if(isset($_SESSION['tabla1'])) // ya definido...
                    {
                        echo $_SESSION["tabla1"];
                    } else
                    {
                        if(isset($tablaGenerada))
                        {
                            $_SESSION["tabla1"] = $tablaGenerada;
                            echo $_SESSION["tabla1"];
                        }
                    }
                } else if(!isset($_POST["Crear"])) // cualquier input de exportar
                {
                    if(isset($_SESSION["tabla1"])) // esto implica que la tabla fue importada anteriormente => tiene sentido que al exportar se siga visualizando
                    {
                        echo $_SESSION["tabla1"];
                    }
                }
            ?>

            <?php
                // tabla no definida => permitimos importar
                if(!isset($_SESSION['tabla1']))
                {
                    echo "<section>
                        <h4>Importar datos de la época</h4>
                        <form action='#' method='POST' enctype='multipart/form-data'>
                            <label>Seleccione el fichero 'motores_atmosfericos.csv'
                                <input type='file' name='archivo_csv_1' >
                            </label>
                            <p></p>
                            <label>Pulse para importar los datos de la época
                                <input type='submit' value='Importar' name='Cargar_era_1' >
                            </label>
                        </form>
                    </section>";
                }
            ?>

            <?php
                // tabla definida => permitimos exportar
                if(isset($_SESSION['tabla1']))
                {
                    echo "<section>
                        <h4>Exportar datos de la época</h4>
                        <form action='#' method='POST'>
                            <label>Pulse para exportar los datos de la época
                                <input type='submit' value='Exportar' name='Exportar_era_1'>
                            </label>
                        </form>
                    </section>";
                }
            ?>

            <?php
                $era = new Era();
            
                if (isset($_POST["Exportar_era_1"]) && isset($_SESSION['tabla1']))
                {
                    $nombreEra = Era::$nombresErasFicheros[0]["Nombre_era"];

                    $era -> exportarEra($nombreEra);
                    echo "<p>Datos exportados a " . $nombreEra . "_exported.csv" . ".</p>";
                }
            ?>
        </section>

        <section>
            <h3>Aspiración Mixta (1961-1988)</h3>
            <p>En los años 60 y 70, el mundo de la Fórmula 1 vivió un verdadero cambio. 
                Los motores turboalimentados llegaron para quedarse y, en combinación con los motores atmosféricos, crearon una era de altísimos picos de potencia. 
                Algunos equipos apostaron por motores más pequeños pero potentes, como los de Renault, mientras que otros siguieron con los motores atmosféricos tradicionales.</p>
            <p>Los coches empezaron a alcanzar más de 1,000 caballos de fuerza gracias a los turbos, lo que cambió por completo el enfoque de los ingenieros. 
                A medida que avanzaba la era, los turbos dominaban cada vez más. 
                Ayrton Senna y Alain Prost brillaron en estos años, marcando el camino en circuitos como Monaco y Spa-Francorchamps, siempre con una mezcla de audacia y técnica.</p>

            <?php 
                $era = new Era();
                $tablaGenerada = null;
            
                if($_FILES) // solo se ejecutará si se han enviado ficheros
                {
                    if(isset($_POST["Cargar_era_2"]))
                    {
                        $ficheroCSV = $_FILES["archivo_csv_2"]["name"];

                        if(Era::$nombresErasFicheros[1]["Nombre_fichero"] === $ficheroCSV)
                        {
                            $era -> importarEra($ficheroCSV, Era::$nombresErasFicheros[1]["Nombre_era"]);
                            $tablaGenerada = $era -> getTabla();
                        }
                    }

                    if(isset($_SESSION['tabla2'])) // ya definido...
                    {
                        echo $_SESSION["tabla2"];
                    } else
                    {
                        if(isset($tablaGenerada))
                        {
                            $_SESSION["tabla2"] = $tablaGenerada;
                            echo $_SESSION["tabla2"];
                        }
                    }
                } else if(!isset($_POST["Crear"])) // cualquier input de exportar
                {
                    if(isset($_SESSION["tabla2"])) // esto implica que la tabla fue importada anteriormente => tiene sentido que al exportar se siga visualizando
                    {
                        echo $_SESSION["tabla2"];
                    }
                }
            ?>

            <?php
                // tabla no definida => permitimos importar
                if(!isset($_SESSION['tabla2']))
                {
                    echo "<section>
                        <h4>Importar datos de la época</h4>
                        <form action='#' method='POST' enctype='multipart/form-data'>
                            <label>Seleccione el fichero 'aspiracion_mixta.csv'
                                <input type='file' name='archivo_csv_2' >
                            </label>
                            <p></p>
                            <label>Pulse para importar los datos de la época
                                <input type='submit' value='Importar' name='Cargar_era_2' >
                            </label>
                        </form>
                    </section>";
                }
            ?>

            <?php
                // tabla definida => permitimos exportar
                if(isset($_SESSION['tabla2']))
                {
                    echo "<section>
                        <h4>Exportar datos de la época</h4>
                        <form action='#' method='POST'>
                            <label>Pulse para exportar los datos de la época
                                <input type='submit' value='Exportar' name='Exportar_era_2'>
                            </label>
                        </form>
                    </section>";
                }
            ?>

            <?php
                $era = new Era();
            
                if (isset($_POST["Exportar_era_2"]) && isset($_SESSION['tabla2']))
                {
                    $nombreEra = Era::$nombresErasFicheros[1]["Nombre_era"];

                    $era -> exportarEra($nombreEra);
                    echo "<p>Datos exportados a " . $nombreEra . "_exported.csv" . ".</p>";
                }
            ?>
        </section>

        <section>
            <h3>Motores V10 y V12 (1989-2005)</h3>
            <p>Aquí es donde las cosas realmente se pusieron interesantes. 
                Aunque la era comenzó con motores V12, que ofrecían mucha potencia pero eran más pesados y consumían más combustible, 
                rápidamente los motores V10 tomaron el control debido a su equilibrio entre peso, potencia y eficiencia. 
                Los motores V12 fueron populares en los primeros años de esta era, especialmente con equipos como Ferrari, que los utilizó hasta mediados de los 90.</p>
            <p>Sin embargo, los motores V10 dominaron durante los años 2000, convirtiéndose en la configuración estándar de la Fórmula 1. 
                En esta era, Michael Schumacher y su equipo Ferrari dejaron una huella imborrable, ganando cinco campeonatos consecutivos. 
                Esta era es difícil de separar porque, aunque los motores V10 eran más populares, 
                los V12 todavía tenían una gran presencia hasta que los V10 fueron completamente la norma.</p>
            <p>Equipos como McLaren, Williams y Renault empujaron los límites de la tecnología, 
                con circuitos como Suzuka y Monza siendo testigos de algunas de las carreras más emocionantes. 
                Fue una era llena de avances técnicos, estrategias complejas y pilotos con habilidades excepcionales.</p>

            <?php 
                $era = new Era();
                $tablaGenerada = null;
                
                if($_FILES) // solo se ejecutará si se han enviado ficheros
                {
                    if(isset($_POST["Cargar_era_3"]))
                    {
                        $ficheroCSV = $_FILES["archivo_csv_3"]["name"];

                        if(Era::$nombresErasFicheros[2]["Nombre_fichero"] === $ficheroCSV)
                        {
                            $era -> importarEra($ficheroCSV, Era::$nombresErasFicheros[2]["Nombre_era"]);
                            $tablaGenerada = $era -> getTabla();
                        }
                    }

                    if(isset($_SESSION['tabla3'])) // ya definido...
                    {
                        echo $_SESSION["tabla3"];
                    } else
                    {
                        if(isset($tablaGenerada))
                        {
                            $_SESSION["tabla3"] = $tablaGenerada;
                            echo $_SESSION["tabla3"];
                        }
                    }
                } else if(!isset($_POST["Crear"])) // cualquier input de exportar
                {
                    if(isset($_SESSION["tabla3"])) // esto implica que la tabla fue importada anteriormente => tiene sentido que al exportar se siga visualizando
                    {
                        echo $_SESSION["tabla3"];
                    }
                }
            ?>

            <?php
                // tabla no definida => permitimos importar
                if(!isset($_SESSION['tabla3']))
                {
                    echo "<section>
                        <h4>Importar datos de la época</h4>
                        <form action='#' method='POST' enctype='multipart/form-data'>
                            <label>Seleccione el fichero 'motores_v10_y_v12.csv'
                                <input type='file' name='archivo_csv_3' >
                            </label>
                            <p></p>
                            <label>Pulse para importar los datos de la época
                                <input type='submit' value='Importar' name='Cargar_era_3' >
                            </label>
                        </form>
                    </section>";
                }
            ?>

            <?php
                // tabla definida => permitimos exportar
                if(isset($_SESSION['tabla3']))
                {
                    echo "<section>
                        <h4>Exportar datos de la época</h4>
                        <form action='#' method='POST'>
                            <label>Pulse para exportar los datos de la época
                                <input type='submit' value='Exportar' name='Exportar_era_3'>
                            </label>
                        </form>
                    </section>";
                }
            ?>

            <?php
                $era = new Era();
            
                if (isset($_POST["Exportar_era_3"]) && isset($_SESSION['tabla3']))
                {
                    $nombreEra = Era::$nombresErasFicheros[2]["Nombre_era"];

                    $era -> exportarEra($nombreEra);
                    echo "<p>Datos exportados a " . $nombreEra . "_exported.csv" . ".</p>";
                }
            ?>
        </section>

        <section>
            <h3>Motores V8 (2006-2013)</h3>
            <p>A partir de 2006, los motores se redujeron a V8 de 2.4 litros, 
                lo que fue un cambio importante tanto en el sonido de los coches como en la forma en que se manejaban. 
                El límite de 18,000 revoluciones por minuto hizo que los motores fueran más controlables y con menos potencia que los V10. 
                Era una Fórmula 1 más centrada en la fiabilidad y la estrategia, pero aún así vimos algunas batallas épicas.</p>
            <p>Sebastian Vettel y Red Bull dominaron la segunda mitad de esta era, llevándose cuatro campeonatos consecutivos (2010-2013), gracias a su gran consistencia y velocidad. 
                Silverstone y Monza seguían siendo clásicos, y el dominio de los equipos de Red Bull y Ferrari destacaron en cada temporada. 
                Fue un periodo en el que la fiabilidad y la capacidad de los coches para gestionar el desgaste de los neumáticos y la estrategia se volvieron clave para el éxito.</p>

            <?php 
                $era = new Era();
                $tablaGenerada = null;
            
                if($_FILES) // solo se ejecutará si se han enviado ficheros
                {
                    if(isset($_POST["Cargar_era_4"]))
                    {
                        $ficheroCSV = $_FILES["archivo_csv_4"]["name"];

                        if(Era::$nombresErasFicheros[3]["Nombre_fichero"] === $ficheroCSV)
                        {
                            $era -> importarEra($ficheroCSV, Era::$nombresErasFicheros[3]["Nombre_era"]);
                            $tablaGenerada = $era -> getTabla();
                        }
                    }

                    if(isset($_SESSION['tabla4'])) // ya definido...
                    {
                        echo $_SESSION["tabla4"];
                    } else
                    {
                        if(isset($tablaGenerada))
                        {
                            $_SESSION["tabla4"] = $tablaGenerada;
                            echo $_SESSION["tabla4"];
                        }
                    }
                } else if(!isset($_POST["Crear"])) // cualquier input de exportar
                {
                    if(isset($_SESSION["tabla4"])) // esto implica que la tabla fue importada anteriormente => tiene sentido que al exportar se siga visualizando
                    {
                        echo $_SESSION["tabla4"];
                    }
                }
            ?>

            <?php
                // tabla no definida => permitimos importar
                if(!isset($_SESSION['tabla4']))
                {
                    echo "<section>
                        <h4>Importar datos de la época</h4>
                        <form action='#' method='POST' enctype='multipart/form-data'>
                            <label>Seleccione el fichero 'motores_v8.csv'
                                <input type='file' name='archivo_csv_4' >
                            </label>
                            <p></p>
                            <label>Pulse para importar los datos de la época
                                <input type='submit' value='Importar' name='Cargar_era_4' >
                            </label>
                        </form>
                    </section>";
                }
            ?>

            <?php
                // tabla definida => permitimos exportar
                if(isset($_SESSION['tabla4']))
                {
                    echo "<section>
                        <h4>Exportar datos de la época</h4>
                        <form action='#' method='POST'>
                            <label>Pulse para exportar los datos de la época
                                <input type='submit' value='Exportar' name='Exportar_era_4'>
                            </label>
                        </form>
                    </section>";
                }
            ?>

            <?php
                $era = new Era();
                
                if (isset($_POST["Exportar_era_4"]) && isset($_SESSION['tabla4']))
                {
                    $nombreEra = Era::$nombresErasFicheros[3]["Nombre_era"];

                    $era -> exportarEra($nombreEra);
                    echo "<p>Datos exportados a " . $nombreEra . "_exported.csv" . ".</p>";
                }
            ?>
        </section>

        <section>
            <h3>Motores Híbridos (2014-presente)</h3>
            <p>La Fórmula 1 dio otro giro con los motores híbridos en 2014, combinando motores V6 turboalimentados de 1.6 litros con sistemas de recuperación de energía. 
                El objetivo era mejorar la eficiencia energética y reducir el impacto ambiental, lo que introdujo nuevas tecnologías que marcaron el rumbo de la categoría. 
                Estos motores no solo son más eficientes, sino que también han aumentado la potencia total a más de 1,000 caballos gracias a la combinación de energía eléctrica y térmica.</p>
            <p>Mercedes ha sido el equipo dominante en esta era, con Lewis Hamilton a la cabeza, estableciendo un récord de victorias y títulos. 
                Sin embargo, la competencia se ha intensificado con el resurgimiento de Red Bull y la llegada de Max Verstappen, quien ha mostrado ser un competidor feroz en los últimos años.</p>
            <p>Circuitos como Suzuka y Interlagos siguen siendo escenarios de emociones fuertes, pero con una mayor estrategia y tecnología detrás de cada vuelta. 
                La Fórmula 1 ha cambiado mucho, pero sigue siendo el espectáculo emocionante que siempre fue, solo que ahora con más tecnología y una mayor preocupación por la sostenibilidad.</p>

            <?php 
                $era = new Era();
                $tablaGenerada = null;
            
                if($_FILES) // solo se ejecutará si se han enviado ficheros
                {
                    if(isset($_POST["Cargar_era_5"]))
                    {
                        $ficheroCSV = $_FILES["archivo_csv_5"]["name"];

                        if(Era::$nombresErasFicheros[4]["Nombre_fichero"] === $ficheroCSV)
                        {
                            $era -> importarEra($ficheroCSV, Era::$nombresErasFicheros[4]["Nombre_era"]);
                            $tablaGenerada = $era -> getTabla();
                        }
                    }

                    if(isset($_SESSION['tabla5'])) // ya definido...
                    {
                        echo $_SESSION["tabla5"];
                    } else
                    {
                        if(isset($tablaGenerada))
                        {
                            $_SESSION["tabla5"] = $tablaGenerada;
                            echo $_SESSION["tabla5"];
                        }
                    }
                } else if(!isset($_POST["Crear"])) // cualquier input de exportar
                {
                    if(isset($_SESSION["tabla5"])) // esto implica que la tabla fue importada anteriormente => tiene sentido que al exportar se siga visualizando
                    {
                        echo $_SESSION["tabla5"];
                    }
                }
            ?>

            <?php
                // tabla no definida => permitimos importar
                if(!isset($_SESSION['tabla5']))
                {
                    echo "<section>
                            <h4>Importar datos de la época</h4>
                            <form action='#' method='POST' enctype='multipart/form-data'>
                                <label>Seleccione el fichero 'motores_hibridos.csv'
                                    <input type='file' name='archivo_csv_5' >
                                </label>
                                <p></p>
                                <label>Pulse para importar los datos de la época
                                    <input type='submit' value='Importar' name='Cargar_era_5' >
                                </label>
                            </form>
                        </section>";
                }
            ?>

            <?php
                // tabla definida => permitimos exportar
                if(isset($_SESSION['tabla5']))
                {
                    echo "<section>
                            <h4>Exportar datos de la época</h4>
                            <form action='#' method='POST'>
                                <label>Pulse para exportar los datos de la época
                                    <input type='submit' value='Exportar' name='Exportar_era_5'>
                                </label>
                            </form>
                        </section>";
                }
            ?>

            <?php
                $era = new Era();
                
                if(isset($_POST["Exportar_era_5"]) && isset($_SESSION['tabla5']))
                {
                    $nombreEra = Era::$nombresErasFicheros[4]["Nombre_era"];

                    $era -> exportarEra($nombreEra);
                    echo "<p>Datos exportados a " . $nombreEra . "_exported.csv" . ".</p>";
                }
            ?>
        </section>
	</main>

</body>
</html>