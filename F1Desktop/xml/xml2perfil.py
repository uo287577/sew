# xml2perfil.py
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

def prologoSVG(archivo, nombre):
    """ Escribe en el archivo de salida el prólogo del archivo SVG"""

    archivo.write('<?xml version="1.0" encoding="UTF-8"?>\n')
    archivo.write('<svg xmlns="http://www.w3.org/2000/svg" version="2.0">\n')


def escrituraPuntosSVG(svg,xml,ExpresionXPath):
    svg.write("<polyline points=\n")

    XPathEjeX = ExpresionXPath + "/{http://www.uniovi.es}distancia"
    XPathEjeY = ExpresionXPath + "/{http://www.uniovi.es}coordenadas/*[@tipo='Altitud']"

    raiz = verXPath(xml,ExpresionXPath)


    nodosEjeX = raiz.findall(XPathEjeX)
    nodosEjeY = raiz.findall(XPathEjeY)

    numeroNodos = len(nodosEjeX)

    distancia = 0.0

    for i in range(numeroNodos):
        campoEjeX = str(float(nodosEjeX[i].text.strip('\n'))/5)
        campoEjeY = str(float(nodosEjeY[i].text.strip('\n')))

        if(i == 0):
            distancia = round(distancia + float(campoEjeX),2)
            svg.write('\t"'+campoEjeX+","+campoEjeY+"\n")
        else:
            distancia = round(float(distancia) + float(campoEjeX),2)
            if(i == numeroNodos - 1):
                svg.write('\t'+str(distancia)+","+campoEjeY+'"\n')
            else:
                svg.write("\t"+str(distancia)+","+campoEjeY+"\n")

    svg.write('\tstyle="fill:white;stroke:red;stroke-width:4" />\n')
    xml.close() # IMPORTANTE CERRAR EL XML AL FINAL DE LA EJECUCION DE ESTE METODO

def epilogoSVG(archivo):
    """ Escribe en el archivo de salida el epílogo del archivo SVG"""
    archivo.write("</svg>\n")


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


    nombreArchivoSVG = input('Introduzca el nombre del SVG a generar (sin extension especificada) = ')
    miArchivoSVG = path+nombreArchivoSVG+".svg"

    try:
        svg = open(miArchivoSVG,'w',encoding="utf-8")
    except IOError:
        print ('No se puede crear el archivo ', nombreArchivoSVG + ".svg")
        exit()

    prologoSVG(svg,nombreArchivoXML)

    miExpresionXPath = "{http://www.uniovi.es}puntos/{http://www.uniovi.es}tramo"    
    escrituraPuntosSVG(svg,xml,miExpresionXPath)

    epilogoSVG(svg)
    svg.close()


if __name__ == "__main__":
    main()