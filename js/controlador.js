$.controlador = {}




$.controlador.panel_activo = "";

/*
* Method that changes the active panel
*/
$.controlador.activarPanel = function (panel_nuevo) {
    $($.controlador.panel_activo).hide();
    $(panel_nuevo).show();
    $.controlador.panel_activo = panel_nuevo;
}


/*
* Method that initiates the top bar with its content and selects the active panel on click
*/
$.controlador.init = function (panel_inicial) {

    $('[id^="menu_"]').each(function () {
        var $this = $(this);
        var menu_id = $this.attr('id');
        var panel_id = menu_id.replace('menu_', 'panel_');

        $("#" + menu_id).click(function () {
            $.controlador.activarPanel("#" + panel_id);
        });
        console.log("id_menu::" + menu_id + "  id_panel::" + panel_id);
    });


    $(".panel").hide();

    $.controlador.activarPanel("#" + panel_inicial);
}

/*
* Method that initiates the sidebar menu with its panel
*/
$.controlador.initSideBar = function (panel_inicial) {

    $('[id^="sidebar_"]').each(function () {
        var $this = $(this);
        var sidebar_id = $this.attr('id');
        var panel_id = sidebar_id.replace('sidebar_', 'panel_');

        $("#" + sidebar_id).click(function () {
            $.controlador.activarPanel("#" + panel_id);
        });
        console.log("id_sidebar::" + sidebar_id + "  id_panel::" + panel_id);
    });


    $(".panel").hide();

    $.controlador.activarPanel("#" + panel_inicial);
}

/*
Métodos para controlar los paneles activos de los botones por clases
*/
$.controlador.initClassListado = function (panel_inicial) {

    $('.listado').each(function () {
        var $this = $(this);
        var listado_id = $this.attr('id');
        var panel_id = listado_id.replace($this.attr('id'), 'panel_channelList');

        $("#" + listado_id).click(function () {
            //Cuando muestra el panel listado por haberle dado a un botón, tiene que volver a cargar la lista para ver los cambios realizados
            $.controlador.listarCanales($.canales.lista);

            $.controlador.activarPanel("#" + panel_id);
        });
        console.log("id_clase_listado::" + listado_id + "  id_panel::" + panel_id);
    });


    $(".panel").hide();

    $.controlador.activarPanel("#" + panel_inicial);
}

$.controlador.initClassNoticias = function (panel_inicial) {
    $('.noticias').each(function () {
        var $this = $(this);
        var noticias_id = $this.attr('id');
        var panel_id = noticias_id.replace($this.attr('id'), 'panel_viewNews');

        $("#" + noticias_id).click(function () {
            $.controlador.activarPanel("#" + panel_id);
        });
        console.log("id_clase_noticias::" + noticias_id + "  id_panel::" + panel_id);
    });


    $(".panel").hide();

    $.controlador.activarPanel("#" + panel_inicial);
}

$.controlador.initClassActualizar = function (panel_inicial) {
    $('.actualizar').each(function () {
        var $this = $(this);
        var actualizar_id = $this.attr('id');
        var panel_id = actualizar_id.replace($this.attr('id'), 'panel_update');

        $("#" + actualizar_id).click(function () {
            $.controlador.activarPanel("#" + panel_id);
        });
        console.log("id_clase_actualizar::" + actualizar_id + "  id_panel::" + panel_id);
    });


    $(".panel").hide();

    $.controlador.activarPanel("#" + panel_inicial);
}


/*
Método para mostrar los canales que añadimos
*/
$.controlador.listarCanales = function (arrayCanales) {
    if (arrayCanales.length == 0) {
        let textoSinCanales = $("<h5 class='center-align'> No tienes canales añadidos. En 'Gestión de canales' puedes añadir uno nuevo.</h5>");
        $("#verListaCanales").empty();
        $("#verListaCanales").append(textoSinCanales);

    } else {
        $.canales.load();
        //creamos una lista vacía
        let lista = $("<ul/>");
        //añadimos la clase collection de materialize a la clase
        lista.addClass("collection");
        let id = 0;
        arrayCanales.forEach((canal, indice) => {
            console.log(canal);
            console.log(id);
            let item = $("<li class='collection-item' ><div><h7><strong>" + canal.nombre +
                "</strong></h7><a href='#!' id='canal" + id + "' class='noticias secondary-content'><i onclick='$.controlador.mostrarCanal(" + indice + ")' class='material-icons'>send</i></a>"
            );
            $.controlador.initClassListado("panel_channelList");
            //item.click($.controlador.mostrarCanal(indice));
            id++;
            item.addClass("collection-item");
            lista.append(item);
        });

        $("#verListaCanales").empty();
        $("#verListaCanales").append(lista);
    }
}


/*
Método para mostrar las noticias de los canales en los que pinchamos
*/
$.controlador.mostrarCanal = function (indice) {
    console.log("mostrando canal: " + indice);
    console.log($.canales.lista[indice].url);



    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let xml = this.responseXML.getElementsByTagName("item");
            if (xml.length > 0) {
                $.controlador.mostrarNoticiasRSS(this, indice);
            } else {
                $.controlador.mostrarNoticiasATOM(this, indice);
            }

        }
    };
    url = $.canales.lista[indice].url;
    console.log(url);
    xhttp.open("GET", 'https://cors-anywhere.herokuapp.com/' + url, true);
    xhttp.send();

}

/*
* Método para mostrar las noticias en el caso de que sean RSS
*/
/*$.controlador.mostrarNoticiasRSS = function (xml) {
    var i;
    var xmlDoc = xml.responseXML;
    var table = "<table><tr><th>Titulo</th><th>Descripcion</th></tr>";
    var x = xmlDoc.getElementsByTagName("item");
    for (i = 0; i < x.length; i++) {
        table += "<tr><td>" + '<a href="' + x[i].getElementsByTagName("link")[0].childNodes[0].nodeValue + '">' +
            x[i].getElementsByTagName("title")[0].childNodes[0].nodeValue +
            "</a></td><td>" +
            x[i].getElementsByTagName("description")[0].childNodes[0].nodeValue +
            "</td></tr>";
    }
    table += "</table>";
    //console.log(table);
    $("#tablaNoticias").empty();
    $("#tablaNoticias").append(table);

}*/

$.controlador.mostrarNoticiasRSS = function (xml, indice) {
    var i;
    var xmlDoc = xml.responseXML;
    var lista = $("<ul/>");
    lista.addClass("collapsible popout");
    var x = xmlDoc.getElementsByTagName("item");
    for (i = 0; i < x.length; i++) {
        let item = $("<li><div class='collapsible-header'><h6><strong>" +
            x[i].getElementsByTagName("title")[0].childNodes[0].nodeValue +
            "</strong></h6></div><div class='collapsible-body'><span>" +
            x[i].getElementsByTagName("description")[0].childNodes[0].nodeValue +
            "<div><p style='color:grey'>" + x[i].getElementsByTagName("pubDate")[0].childNodes[0].nodeValue + "</p></div><div><a href='" + x[i].getElementsByTagName("link")[0].childNodes[0].nodeValue + "'>Ver Noticia</a></div><span></div></li>");
        lista.append(item);
    }

    //console.log(table);
    $("#tablaNoticias").empty();
    $("#tablaNoticias").append("<h4 style='font-weight:bold' class='center-align'>" + $.canales.lista[indice].nombre + "</h4>");
    $("#tablaNoticias").append(lista);
    $('.collapsible').collapsible({ accordion: true });
}


/*
* Método para mostrar las noticias en el caso de que sean ATOM
*/
/*$.controlador.mostrarNoticiasATOM = function (xml) {
    var i;
    var xmlDoc = xml.responseXML;
    var table = "<table><tr><th>Titulo</th><th>Descripcion</th></tr>";
    var x = xmlDoc.getElementsByTagName("entry");
    for (i = 0; i < x.length; i++) {
        table += "<tr><td>" + '<a href="' + x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue + '">' +
            x[i].getElementsByTagName("title")[0].childNodes[0].nodeValue +
            "</a></td><td>" +
            x[i].getElementsByTagName("summary")[0].childNodes[0].nodeValue +
            "</td></tr>";
    }
    table += "</table>";
    //console.log(table);
    $("#tablaNoticias").empty();
    $("#tablaNoticias").append(table);

}*/

$.controlador.mostrarNoticiasATOM = function (xml, indice) {
    var i;
    var xmlDoc = xml.responseXML;
    var lista = $("<ul/>");
    lista.addClass("collapsible popout");
    var x = xmlDoc.getElementsByTagName("entry");
    for (i = 0; i < x.length; i++) {
        let item = $("<li><div class='collapsible-header'><h6><strong>" +
            x[i].getElementsByTagName("title")[0].childNodes[0].nodeValue +
            "</strong></h6></div><div class='collapsible-body'><span>" +
            x[i].getElementsByTagName("summary")[0].childNodes[0].nodeValue +
            "<div><p style='color:grey'>" + x[i].getElementsByTagName("updated")[0].childNodes[0].nodeValue + "</p></div><a href='" + x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue + "'>Ver Noticia</a><span></div></li>");
        lista.append(item);
    }

    //console.log(table);
    $("#tablaNoticias").empty();
    $("#tablaNoticias").append("<h4 style='font-weight:bold' class='center-align'>" + $.canales.lista[indice].nombre + "</h4>");
    $("#tablaNoticias").append(lista);
    $('.collapsible').collapsible({ accordion: true });
}

/**
 * Método para mostrar la lista de canales disponibles para borrar 
 */

$.controlador.listarCanalesBorrado = function (arrayCanales) {

    if (arrayCanales.length == 0) {
        let textoSinCanales = $("<h5 class='center-align'> No tienes canales para borrar. En 'Gestión de canales' puedes añadir uno nuevo.</h5>");
        $("#listaBorrado").empty();
        $("#listaBorrado").append(textoSinCanales);

    } else {

        //creamos una lista vacía
        let lista = $("<ul/>");
        //añadimos la clase collection de materialize a la clase
        lista.addClass("collection");
        let id = 0;
        arrayCanales.forEach((canal, indice) => {
            console.log(canal);
            console.log(id);
            let item = $("<li ><div>" + canal.nombre +
                "<a  href='#!' class='secondary-content'><i  id='borrado_canal_" + id + "' onclick='$.controlador.borrarCanal(" + indice +
                ")' href='#modal1' class='material-icons modal-trigger'>delete</i></a></div></li>");

            $("#borrado_canal_" + id).click(() => {
                $.controlador.listarCanales($.canales.lista);

                $.controlador.initClassListado("panel_delete");
            });

            id++;
            item.addClass("collection-item");
            lista.append(item);
        });

        $("#listaBorrado").empty();
        $("#listaBorrado").append(lista);
    }
}


/**
 * Método para borrar canales del array
 */
$.controlador.borrarCanal = function (indice) {
    console.log("borrando canal: " + indice);
    console.log("borrando canal -->" + $.canales.lista[indice].nombre);

    $("#btn_aceptar_borrado").click(() => {
        M.toast({ html: 'Canal ' + $.canales.lista[indice].nombre + ' borrado', classes: 'rounded' })
        $.canales.lista.splice(indice, 1);
        $.canales.save();
        $.canales.load();
    });


}



/**
 * Método para actualizar o cambiar datos de los canales
 */

$.controlador.listarCanalesActualizar = function (arrayCanales) {
    if (arrayCanales.length == 0) {
        let textoSinCanales = $("<h5 class='center-align'> No tienes canales para modificar. En 'Gestión de canales' puedes añadir uno nuevo.</h5>");
        $("#listaCanalesActualizar").empty();
        $("#listaCanalesActualizar").append(textoSinCanales);

    } else {
        //creamos una lista vacía
        let lista = $("<ul/>");
        //añadimos la clase collection de materialize a la clase
        lista.addClass("collection");
        let id = 0;
        arrayCanales.forEach((canal, indice) => {
            console.log(canal);
            console.log(id);
            let item = $("<li style='font-weight:bold' ><div>" + canal.nombre +
                "<a  href='#!' class='secondary-content'><i id='actualizado_canal_" + id +
                "' onclick='$.controlador.mostrarPanelActualizarCanal(" + indice +
                ")' class='actualizar material-icons'>arrow_forward</i></a></div></li>");

            id++;
            item.addClass("collection-item");
            lista.append(item);
        });


        $("#listaCanalesActualizar").empty();
        $("#listaCanalesActualizar").append(lista);
        $.controlador.initClassActualizar("panel_listaUpdate");
    }
}

$.controlador.mostrarPanelActualizarCanal = function (indice) {
    console.log("actualizando canal: " + indice + " nombre: " + $.canales.lista[indice].nombre);
    let item = "<br><div class='row'><div class='center-align col s12'><div class='input-field'><input value='" +
        $.canales.lista[indice].nombre + "' id='form_update_nombre' type='text' class='validate'><label class='active' for='form_update_nombre'>NOMBRE</label></div>" +
        "<div class='input-field'><input value='" + $.canales.lista[indice].url +
        "' id='form_update_url' type='url' class='validate'><label class='active' for='form_update_url'>URL</label><span class='helper-text' data-error='Format not valid' data-success='Valid URL format'></span></div></div>"
        + "<div class='right-align col s12'><button class='btn-floating btn-large waves-effect waves-light center-align' id='form_update_btn_aceptar' onclick='$.canales.clickActualizar(" +
        indice + ")' type='submit' name='action'><i id='btn_update_icon' class='material-icons center'>done</i></button></div></div>";

    $("#form_update").empty();
    $("#form_update").append(item);



}