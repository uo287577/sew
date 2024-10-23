import xml.etree.ElementTree as ET
import math

# Función para calcular la distancia entre dos puntos geográficos
def calcular_distancia(lat1, lon1, lat2, lon2):
    # Convertir grados a radianes
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    
    # Haversine formula
    dlon = lon2 - lon1 
    dlat = lat2 - lat1 
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a)) 
    # Radio de la Tierra en metros (6371000)
    distancia = 6371000 * c
    return distancia

# Función para leer el archivo KML y extraer las coordenadas
def leer_kml_y_calcular_distancias(kml_file):
    # Cargar el archivo KML
    tree = ET.parse(kml_file)
    root = tree.getroot()

    # Namespace para manejar el KML
    ns = {'kml': 'http://www.opengis.net/kml/2.2'}
    
    # Lista para guardar las coordenadas
    coordenadas = []

    # Encontrar el LineString y extraer las coordenadas
    for placemark in root.findall('.//kml:Placemark', ns):
        line_string = placemark.find('.//kml:LineString', ns)
        if line_string is not None:
            coords = line_string.find('.//kml:coordinates', ns)
            if coords is not None:
                # Dividir las coordenadas y guardarlas en la lista
                puntos = coords.text.strip().split()
                for punto in puntos:
                    # Cambiar el orden a (lat, lon, alt)
                    lon, lat, alt = map(float, punto.split(','))
                    coordenadas.append((lat, lon, alt))  # Guardar (lat, lon, alt)

    # Calcular las distancias entre los puntos
    distancias = []
    for i in range(1, len(coordenadas)):
        lat1, lon1, _ = coordenadas[i-1]
        lat2, lon2, _ = coordenadas[i]
        distancia = calcular_distancia(lat1, lon1, lat2, lon2)
        distancias.append(distancia)

    return coordenadas, distancias

# Función para imprimir coordenadas y distancias
def imprimir_coordenadas_y_distancias(coordenadas, distancias):
    for i, (lat, lon, alt) in enumerate(coordenadas):
        print(f"Punto {i+1}: Latitud={lat}, Longitud={lon}, Altura={alt} m")
        if i > 0:
            print(f"Distancia desde el punto {i} al {i+1}: {distancias[i-1]:.2f} m")

# Uso del código
if __name__ == "__main__":
    # Cambia 'tu_archivo.kml' por el nombre de tu archivo KML
    kml_file = "f:/Clase/SEW/Laboratorio/F1Desktop/xml/" + "circuito.kml"  
    coordenadas, distancias = leer_kml_y_calcular_distancias(kml_file)
    
    # Imprimir coordenadas y distancias
    imprimir_coordenadas_y_distancias(coordenadas, distancias)
