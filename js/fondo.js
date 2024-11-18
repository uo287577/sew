/* Miguel Fernández Huerta UO287577 */

"use strict"; // para que se haga comprobación de tipos en tiempo de ejecución
class Fondo
{
    constructor(nombrePais,nombreCapital,nombreCircuito)
    {
        this.nombrePais = nombrePais;
        this.nombreCapital = nombreCapital;
        this.nombreCircuito = nombreCircuito;
    }

    getImagenFondo()
    {
        $(document).ready(function()
        {
            var flickrAPI = "https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?"; // NO CONSEGUIMOS QUE FUNCIONE CON COORDENADAS POR TEMA PERMISOS O A SABER
            //var flickrAPI = "https://api.flickr.com/services/rest/?method=flickr.photos.geo.photosForLocation&api_key=86e3c1f564a9d22974389506fb27f85e&lat=41.564792&lon=2.261216&format=json&jsoncallback=1";
            $.getJSON(flickrAPI, 
                    {
                        tags: "montmelo,f1",
                        tagmode: "all",
                        format: "json"
                    })
            .done(function(data) {
                $("main", document.body)
                .css({
                    "background-image": `url('${data.items[0].media.m.replace("_m","_b")}')`,
                    "background-size": "cover",
                    "background-position": "center",
                    "width": "100%",
                    "height": "89vmin"
                })
            });
        })
    }
}