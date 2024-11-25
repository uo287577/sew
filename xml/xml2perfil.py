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
    maximaAltura = buscaAlturaMaxima(nodosEjeY) + 10

    distancia = 50.0

    for i in range(numeroNodos):
        campoEjeX = round(float(nodosEjeX[i].text.strip('\n'))/10,2) + 7
        campoEjeY = round(-float(nodosEjeY[i].text.strip('\n'))+maximaAltura,2) * 20

        distancia = round(distancia + campoEjeX,2)

        cadena = '\t'
        if(i == 0):
            cadena += '"'

        cadena += str(distancia)+','+str(campoEjeY)

        if(i == numeroNodos - 1):
            cadena += '"'
        cadena += '\n'

        svg.write(cadena)

    svg.write('\tstyle="fill:white;stroke:red;stroke-width:4" />\n')
    xml.close() # IMPORTANTE CERRAR EL XML AL FINAL DE LA EJECUCION DE ESTE METODO

def epilogoSVG(archivo):
    """ Escribe en el archivo de salida el epílogo del archivo SVG"""
    archivo.write("</svg>\n")

def buscaAlturaMaxima(nodos):
    res = float(nodos[0].text.strip('\n'))
    for i in range(1,len(nodos)):
        nodo = float(nodos[i].text.strip('\n'))
        if nodo > res:
            res = nodo
    return res

def main():
    path = "d:/Clase/SEW/Laboratorio/F1Desktop/xml/" # para clase
    #path = "f:/Clase/SEW/Laboratorio/F1Desktop/xml/" # en casa

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