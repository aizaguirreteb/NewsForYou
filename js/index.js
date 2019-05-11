
$(document).ready(function () {
    $.controlador.init('panel_home');
    $.controlador.initSideBar('panel_home');
    $.controlador.initClassListado('panel_home');
    $.controlador.initClassActualizar("panel_home");
    $('.collapsible').collapsible({accordion : true});



    $.canales.load();
    $("#sidebar_channelList").click(() => {

        $.controlador.listarCanales($.canales.lista);
        $.controlador.initClassNoticias('panel_channelList');
    });

    $("#sidebar_delete").click(() => {
        $.controlador.listarCanalesBorrado($.canales.lista);
        $.controlador.initClassListado('panel_delete');
        
    });

    $("#sidebar_listaUpdate").click(() => {
       
        $.controlador.listarCanalesActualizar($.canales.lista);
        //$.controlador.initClassListado('panel_delete');
    });

    //$("#btn_aceptar_borrado").click(()=>{
    //$.controlador.borrarCanal(indice);
    //});


    
    $('.modal').modal();


    function procesarCanales(xml) {
        //le pido a jquery que cree un elemento ul
        let lista = $("<ul/>");
        //de la respuesta AJAX,        
        let xmlDoc = xml.responseXML;
        let canales = xmlDoc.getElementsByTagName("canal");
        for (let i = 0; i < canales.length; i++) {
            let canal = canales[i];
            let item = $("<li>" + canal.getElementsByTagName("nombre")[0].childNodes[0].nodeValue + "</li>");
            lista.append(item);
        }
        $("#listapredefinidos").append(lista);

    }

    function cargarDatosCanales(xml) {
        //le pido a jquery que cree un elemento ul
        let lista = $("<ul class='collection with-header'/>");
        //de la respuesta AJAX,        
        let xmlDoc = xml.responseXML;
        let canales = xmlDoc.getElementsByTagName("canal");
        for (let i = 0; i < canales.length; i++) {
            let canal = canales[i];
            let item = $("<li class='collection-item'><div>" +
                canal.getElementsByTagName("nombre")[0].childNodes[0].nodeValue +
                "<a href='#!' class='noticias secondary-content'><i class='material-icons'>send</i></a></div></li>");
            lista.append(item);
        }
        $("#listapredefinidos2").append(lista);

    }

    function listaBorradodeDatos(xml) {
        //le pido a jquery que cree un elemento ul
        let lista = $("<ul class='collection with-header'/>");
        //de la respuesta AJAX,        
        let xmlDoc = xml.responseXML;
        let canales = xmlDoc.getElementsByTagName("canal");
        for (let i = 0; i < canales.length; i++) {
            let canal = canales[i];
            let item = $("<li><label><input class='with-gap' name='group1' type='radio'/><span>" +
                canal.getElementsByTagName("nombre")[0].childNodes[0].nodeValue +
                "</span></label></li>");
            lista.append(item);
        }
        $("#listaBorrado").append(lista);

    }
    function cargaPredefinidos() {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                procesarCanales(this);
                cargarDatosCanales(this);
                listaBorradodeDatos(this);
            } else {
                console.log("error de lectura de predefinidos");
            }
        }
        xhttp.open("GET", "canales.xml", true);
        xhttp.send();
    }


    $("#form_alta_btn_aceptar").click(function () {
        console.log("ALTA::Nombre canal: " + $("#form_alta_nombre").val() + " URL canal: " + $("#form_alta_url").val());
        $.canales.add(
            $("#form_alta_nombre").val(), //Value of the name
            $("#form_alta_url").val()     //Value of the url
        );

    });

    /*$("#form_update_btn_aceptar").click(function () {
        console.log("UPDATE::Nombre canal: " + $("#form_update_nombre").val() + " URL canal: " + $("#form_update_url").val());
        $.canales.update(
            $("#form_update_nombre").val(), //Value of the name
            $("#form_update_url").val()     //Value of the url
        );

    });*/

    

    cargaPredefinidos();

    /**
     * Método para cambiar al modo noche
     */

    $("input[type='checkbox']").change(function(){
        if($(this).is(":checked")){
            $(".original-theme").each(function () {
                this.classList.toggle("original-theme",false);
                this.classList.toggle("night-theme",true);
            });
           
        }else{
            $(".night-theme").each(function () {
                this.classList.toggle("night-theme",false);
                this.classList.toggle("original-theme",true);
            });
            
        }
    });







});

$(document).ready(function () {
    $('.sidenav').sidenav();
});
