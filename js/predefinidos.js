/**
 * Gestión de canales predefinidos.
 */

$.predefinidos = {

    // el ID de la caja donde vamos a escribir el resultado
    caja: "#lista_predefinidos",
    // URL donde están los predefinidos
    url: "canales.xml",
    // documento XML que contiene los predefinidos
    xml : null,

    // procesa una lista de canales (Array)
    procesarCanales: function (canales) {
        // le pido a jQuery que cree un elemento UL
        let lista = $("<ul/>");
        lista.addClass("collection");
        for (let i = 0; i < canales.length; i++) {
            let canal = canales[i];
            let categorias = canal.getElementsByTagName("categoria");
            let txt_categorias = "";
            for (let j = 0; j < categorias.length; j++) {
                txt_categorias += categorias[j].childNodes[0].nodeValue + "<br/>";
            }
            let click = "onclick='$.canales.add( \""+
                canal.getElementsByTagName("nombre")[0].childNodes[0].nodeValue+"\",\""+
                canal.getElementsByTagName("url")[0].childNodes[0].nodeValue+"\")'";
            console.log(click);
            let item = $('<li '+click+'><img alt="50px" width="50px" src="' + canal.getElementsByTagName("logo")[0].childNodes[0].nodeValue +
                '" alt="" class="circle"><span class="title"><strong>' +
                (canal.getElementsByTagName("nombre")[0].childNodes[0].nodeValue).toUpperCase() +
                "</strong></span> <p>" + txt_categorias.toUpperCase() + "</p>" +
                '<a href="#!" class="secondary-content"><i class="material-icons">grade</i></a></li>');
            item.addClass("collection-item avatar");
            lista.append(item);
        }
        $(this.caja).empty();
        $(this.caja).append("<h5>Listando... " + canales.length + " canales</h5>");
        $(this.caja).append(lista);
    },

    // carga la lista de predefinidos
    cargarPredefinidos: function () {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                if (this.responseXML != null) {
                    let xmlDoc = this.responseXML;
                    $.predefinidos.xml = xmlDoc;
                    let canales = xmlDoc.getElementsByTagName("canal");
                    $.predefinidos.procesarCanales(canales);
                } else {
                    $(this.caja).append("<h5>Error:</h5><p>No ha sido posible cargar la lista de canales predefinidos.</p>");
                }
            } else {
                // mostrar error lectura predefinidos
            }
        };
        xhttp.open("GET", this.url, true);
        xhttp.send();
    },


    filtra : function(texto) {
        texto=texto.toLowerCase();
        let path = "/canales/canal[categoria[contains(text(),'"+texto.toLowerCase()+"')]]";
        let nuevos_canales = this.xml.evaluate(
            path, this.xml, null, XPathResult.ANY_TYPE, null);
        const nodes = [];
        let node = nuevos_canales.iterateNext();
        while (node) {
            nodes.push(node);
            node = nuevos_canales.iterateNext();
        }
        console.log(nodes);
        if(nodes.length == 0){
            this.cargarPredefinidos($.canales.lista);
        } else {
            this.procesarCanales(nodes);    
        }
    }

};
