/**
 * código JS exclusivo de gestión de alimentadores (canales)
 */

//first we create an object of 'canales'
//If we did this with classes we would be able to create more than one object and it would be a problem
$.canales = {};

$.canales.lista = [];

/* channel model
let canal = {
    nombre: "BarraPunto",
    url: "http://backends.barrapunto.com/barrapunto.rss",
    tipo: "RSS"
};*/

/**
 * Method to add channels, the type of the channel is guessed beforehand by the app
 * returns true if the channel has been added properly and false if it hasn't
 * 
 * Checks if the URL is valid and if it's already been added to the app.
 * Checks if either the name or the URL is repeated on the list.
 */

$.canales.add = function (nombre, url) {
    var correcto = true;


    $.canales.lista.forEach(function (item, index, array) {
        //console.log("hola");
        console.log("item.nombre: " + item.nombre + " index: " + index);
        if (item.nombre == nombre || item.url == url){ 
            correcto = false;
            M.toast({html: 'Pero, ese canal ya lo tienes!', classes: 'rounded'});
        }
    });

    if (correcto) {
        //console.log("he entrado");
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            //console.log("readystatechange");
            if (this.readyState == 4 & this.status == 200) {
                if (this.responseXML != null) {
                    $.canales.addRSS(this.responseXML, nombre, url);     
                    M.toast({html: 'Nuevo canal añadido!', classes: 'rounded'});   
                }
            }
        };
        xhttp.open("GET", 'https://cors-anywhere.herokuapp.com/' + url, true);
        xhttp.send();

    }
    return correcto;
}


$.canales.addRSS = function (xml, nombre, url) {

    let x = xml.getElementsByTagName("item");
    if (x.length > 0) {

        $.canales.lista.push(
            {
                "nombre": nombre,
                "url": url,
                "tipo": "RSS"
            }
        );

        $.canales.save();
        $.canales.load();

    } else {
        let atom = xml.getElementsByTagName("entry");
        if (atom.length > 0) {
            console.log("añadido un atom");
            $.canales.lista.push(
                {
                    "nombre": nombre,
                    "url": url,
                    "tipo": "ATOM"
                });

            $.canales.save();
            $.canales.load();

        } else {
            alert("ERROR: URL no válida");
        }
    }




}

/**
 * Método para actualizar el nombre u url de los canales.
 */
$.canales.update = function(indice, nombre, url) {
    var actualizarCorrecto = true;

    $.canales.lista.forEach(function (item, index, array) {
        //console.log("hola");
        console.log("item.nombre: " + item.nombre + " index: " + index);
        if (item.nombre == nombre) {
            actualizarCorrecto = false;
            M.toast({html: 'Ese nombre ya existe, prueba con otro!', classes: 'rounded'}); 
        }
    
    });

    if (actualizarCorrecto) {
        //console.log("he entrado");
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            //console.log("readystatechange");
            if (this.readyState == 4 & this.status == 200) {
                if (this.responseXML != null) {
                    $.canales.updateRSS(this.responseXML, nombre, url, indice);     
                    M.toast({html: 'Canal actualizado!', classes: 'rounded'});   
                }
            }
        };
        xhttp.open("GET", 'https://cors-anywhere.herokuapp.com/' + url, true);
        xhttp.send();

    }
    return actualizarCorrecto;
    
}

$.canales.updateRSS = function (xml, nombre, url, indice) {

    let x = xml.getElementsByTagName("item");
    if (x.length > 0) {

        $.canales.lista[indice].nombre = nombre;
        $.canales.lista[indice].url = url;
        $.canales.lista[indice].tipo = "RSS";

        $.canales.save();
        $.canales.load();

    } else {
        let atom = xml.getElementsByTagName("entry");
        if (atom.length > 0) {

            $.canales.lista[indice].nombre = nombre;
            $.canales.lista[indice].url = url;
            $.canales.lista[indice].tipo = "ATOM";
    
            $.canales.save();
            $.canales.load();

        } else {
            alert("ERROR: URL no válida");
        }
    }




}


$.canales.clickActualizar = function(indice){
    console.log("UPDATE::Nombre canal: " + $("#form_update_nombre").val() + " URL canal: " + $("#form_update_url").val());
        $.canales.update(
            indice,
            $("#form_update_nombre").val(), //Value of the name
            $("#form_update_url").val()
                 
        );
}


$.canales.save = function () {
    localStorage.setItem('canales', JSON.stringify($.canales.lista));
}

$.canales.load = function () {
    let cadena = localStorage.getItem('canales');
    if (cadena != null) $.canales.lista = JSON.parse(cadena);
}
