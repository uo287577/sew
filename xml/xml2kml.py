# xml2kml.py
# # -*- coding: utf-8 -*-

import xml.etree.ElementTree as ET

def verXPath(archivoXML, expresionXPath):
    try:
        arbol = ET.parse(archivoXML)
        
    except IOError:
        print ('No se encuentra el archivo ', archivoXML)
        exit()
        
    except ET.ParseError:
        print("Error procesando en el archivo XML = ", archivoXML)
        exit()
       
    raiz = arbol.getroot()
    return raiz

def prologoKML(archivo, nombre):
    """ Escribe en el archivo de salida el prólogo del archivo KML"""

    archivo.write('<?xml version="1.0" encoding="UTF-8"?>\n')
    archivo.write('<kml xmlns="http://www.opengis.net/kml/2.2">\n')
    archivo.write("<Document>\n")
    archivo.write("<Placemark>\n")
    archivo.write("<name>"+nombre+"</name>\n")    
    archivo.write("<LineString>\n")
    #la etiqueta <extrude> extiende la línea hasta el suelo 
    archivo.write("<extrude>1</extrude>\n")
    # La etiqueta <tessellate> descompone la línea en porciones pequeñas
    archivo.write("<tessellate>1</tessellate>\n")
    archivo.write("<coordinates>\n")


def escrituraCoordenadasKML(kml,xml,ExpresionXPath):
    XPathCoordenadasLongitud = ExpresionXPath + "/*[@tipo='Longitud']"
    XPathCoordenadasLatitud = ExpresionXPath + "/*[@tipo='Latitud']"
    XPathCoordenadasAltitud = ExpresionXPath + "/*[@tipo='Altitud']"

    raiz = verXPath(xml,ExpresionXPath)


    nodosLongitud = raiz.findall(XPathCoordenadasLongitud)
    nodosLatitud = raiz.findall(XPathCoordenadasLatitud)
    nodosAltitud = raiz.findall(XPathCoordenadasAltitud)

    for i in range(len(nodosLongitud)):
        camposLatitud = nodosLatitud[i].text.strip('\n').split('°')
        latitud = camposLatitud[0]
        hemisferio = camposLatitud[1]

        camposLongitud = nodosLongitud[i].text.strip('\n').split('°')
        longitud = camposLongitud[0]
        esteOeste = camposLongitud[1]

        altitud = nodosAltitud[i].text.strip('\n')
        kml.write(longitud+","+latitud+","+altitud+"\n")

    xml.close() # IMPORTANTE CERRAR EL XML AL FINAL DE LA EJECUCION DE ESTE METODO

def epilogoKML(archivo):
    """ Escribe en el archivo de salida el epílogo del archivo KML"""
    archivo.write("</coordinates>\n")
    archivo.write("<altitudeMode>relativeToGround</altitudeMode>\n")
    archivo.write("</LineString>\n")
    archivo.write("<Style> id='lineaRoja'>\n") 
    archivo.write("<LineStyle>\n") 
    archivo.write("<color>#ff0000ff</color>\n")
    archivo.write("<width>5</width>\n")
    archivo.write("</LineStyle>\n")
    archivo.write("</Style>\n")
    archivo.write("</Placemark>\n")
    archivo.write("</Document>\n")
    archivo.write("</kml>\n")


def main():
    path = "d:/Clase/SEW/Laboratorio/F1Desktop/xml/"
    #path = "f:/Clase/SEW/Laboratorio/F1Desktop/xml/"

    nombreArchivoXML = input('Introduzca un archivo XML (sin extension especificada) = ')
    miArchivoXML = path+nombreArchivoXML+".xml"

    try:
        xml = open(miArchivoXML,'r',encoding="utf-8")
    except IOError:
        print ('No se encuentra el archivo ', miArchivoXML)
        exit()


    nombreArchivoKML = input('Introduzca el nombre del KML a generar (sin extension especificada) = ')
    miArchivoKML = path+nombreArchivoKML+".kml"

    try:
        kml = open(miArchivoKML,'w',encoding="utf-8")
    except IOError:
        print ('No se puede crear el archivo ', nombreArchivoKML + ".kml")
        exit()

    prologoKML(kml,nombreArchivoXML)

    miExpresionXPath = "{http://www.uniovi.es}puntos/{http://www.uniovi.es}tramo/{http://www.uniovi.es}coordenadas"
    escrituraCoordenadasKML(kml,xml,miExpresionXPath)

    epilogoKML(kml)
    kml.close()


if __name__ == "__main__":
    main()