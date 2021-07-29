var app = {
// Application Constructor
    isCam: false,
    localStorage: window.localStorage,
    urlServidor: 'http://localhost/PonteiroOnline/sipat/App/API-v1.0/',
    urlServidor: 'https://ponteiro.online/Sipat/App/API-v1.0/',
    apiToken: 'JKhfdkj93js0Jhfkkjhskjd4352gsfgfgdf65sghf75jhgf3ygh658njhfbfgKJHgIjkkj909089KJ98345kdjhfskjHIUdukwiufjhJKfjk78dfjkKjzf7dKjfd1',
    inserirDadosInicio: $('#inserirDadosInicio').html(),
    initialize: function () {
        this.bindEvents();
        this.mascaras();
    },
    bindEvents: function () {
        app.localStorage.removeItem('back');
        app.onRead();
        document.addEventListener('deviceready', this.onDeviceReady, false);
        $(document).bind("pagechange", this.onPageChange);

    },
    onDeviceReady: function () {
        StatusBar.backgroundColorByHexString("#006633");
        $(".dialogo").addClass('android');
        //navigator.splashscreen.hide();
        app.loading();
        app.verifica();
        $(".urlAPI").val(app.urlServidor);

        try {
            db = openDatabase('sipat', '1.0', 'sipat', 10 * 1024 * 1024 * 1024);//banco webSql
            //db = window.sqlitePlugin.openDatabase({name: 'ponteiroonline.db', location: 'default'});//banco sqLite=
        } catch (e) {
            app.alerta("Erro no banco de Dados!");
        }


        db.transaction(function (tx) {
            tx.executeSql('ALTER TABLE colaboradores ADD temperatura');
        });

        db.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS colaboradores (id, empresa, nome, cpf, rg, nascimento, sexo, email, foto, codigo, setor, funcao, coligada, altura, calca, calcado, camiseta, glicemia, peso, pressaoarterial, temperatura)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS dados (id, tipo, colaborador, valor, data)');
        });



    },
    random: function (min, max) {
        if (!min)
            min = 0;
        if (!max)
            max = 9999;
        return Math.floor(Math.random() * max + min);
    },
    verifica: function () { //VERIFICA SE JA FEZ LOGIN OU NÃO NA INICIALIZAÇÃO;
        if (app.localStorage.getItem('id')) {
            app.carregaPage('home');
        } else {
            app.carregaPage('login');
            app.localStorage.clear();
        }
    },
    mascaras: function () {
        $(".pressao").inputmask({
            mask: ["99/99"],
            keepStatic: true,
            placeholder: ' '

        });

    },
    carregaPage: function (page) { //TROCA DE PAGINA
        $.mobile.changePage($("#" + page));
    },
    setColaboradores: function (id, empresa, nome, cpf, rg, nascimento, sexo, email, foto, codigo, setor, funcao, coligada, altura, calca, calcado, camiseta, glicemia, peso, pressaoarterial, temperatura) {
        var cols = '<tr>';
        cols += '<td class="center"><img width="30px" class="imgColList"  src="' + (foto != 'default' ? foto : 'images/default.jpg') + '"></td>';
        cols += '<td class="center">' + codigo + '</td>';
        cols += '<td>' + nome.toUpperCase() + '</td>';
        cols += '<td class="center">' + cpf + '</td>';
        cols += '<td class="center"><img data-id="' + id + '" class="iconViewColaborador" src="images/icons/black/view.png"></td>';
        cols += '</tr>';
        $("#listaColaboradores").append(cols);
        db.transaction(function (tx) {
            tx.executeSql("INSERT INTO colaboradores (id, empresa, nome, cpf, rg, nascimento, sexo, email, foto, codigo, setor, funcao, coligada, altura, calca, calcado, camiseta, glicemia, peso, pressaoarterial, temperatura) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ", [id, empresa, nome, cpf, rg, nascimento, sexo, email, foto, codigo, setor, funcao, coligada, altura, calca, calcado, camiseta, glicemia, peso, pressaoarterial, temperatura]);
        });
    },
    onPageChange: function (event, data) { //TODA VEZ Q TROCAR DE PAGINA;

        toPageId = data.toPage.attr("id");
        switch (toPageId) {
            case "index":
                $(".ui-loader.ui-corner-all.ui-body-a.ui-loader-default").hide();
                //app.verifica();
                break;
            case "home":
                $(".modal.modalAvaliacao img").attr('src', 'images/starW.png');

                $("form .inputError").removeClass('inputError');
                $(".modal").hide();

                if (!app.localStorage.getItem('id')) {
                    app.carregaPage('login');
                    $("input[type=text]").val("");
                    $("input[type=password]").val("");
                }
                $('.userNome').html(app.localStorage.getItem('nome'));
                if (app.localStorage.getItem('foto') !== 'default' && app.localStorage.getItem('foto') !== 'block') {
                    $('.fotoUser').attr('src', app.localStorage.getItem('foto'));
                    $('.fotoUser').attr('href', app.localStorage.getItem('foto'));
                    $('.fotoUser').attr('title', app.localStorage.getItem('nome'));
                    $('.fotoUser').swipebox();
                }
                app.setNavegacao('close');

                if (app.localStorage.getItem("avaliacao")) {
                    if (app.localStorage.getItem("avaliacao") >= 0) {
                        $(".modal.modalAvaliacao img").attr('src', 'images/starW.png');
                        for (var i = 1; i <= app.localStorage.getItem("avaliacao"); i++) {
                            $('.modal.modalAvaliacao img[data-value="' + i + '"]').attr('src', 'images/starY.png');
                        }
                    }
                }

                $.ajax({
                    url: app.urlServidor,
                    type: "POST",
                    data: {
                        tipo: 'getInit',
                        apiToken: app.apiToken,
                        userId: app.localStorage.getItem('id'),
                        userChave: app.localStorage.getItem('chave'),
                        cliente: app.localStorage.getItem('cliente'),
                    },
                    dataType: 'json',
                    success: function (result) {
                        console.log(result);
                        if (result.return == 'ok') {
//                            app.localStorage.setItem("avaliacao", result.dados.avaliacao);
//                            if (result.dados.avaliacao >= 0) {
//                                $(".modal.modalAvaliacao img").attr('src', 'images/starW.png');
//                                for (var i = 1; i <= result.dados.avaliacao; i++) {
//                                    $('.modal.modalAvaliacao img[data-value="' + i + '"]').attr('src', 'images/starY.png');
//                                }
//                            }

                            app.localStorage.setItem('nome', result.user.nome);
                            app.localStorage.setItem('foto', result.user.foto);
                            app.localStorage.setItem('email', result.user.email);
                            app.localStorage.setItem('chave', result.user.userChave);
                            app.localStorage.setItem('cliente', result.user.cliente);
                            $('.userNome').html(app.localStorage.getItem('nome'));
                            if (app.localStorage.getItem('foto') !== 'default') {
                                var foto64 = app.localStorage.getItem('foto');
                                $('.fotoUser').attr('src', foto64);
                                $('.fotoUser').attr('href', foto64);
                                $('.fotoUser').attr('title', app.localStorage.getItem('nome'));
                                $('.fotoUser').swipebox();
                            }

                            if (app.localStorage.getItem('foto') === 'default') {
                                $('.fotoUser').attr({'src': 'images/default.jpg'});
                            }
                            db.transaction(function (tx) {
                                tx.executeSql("DELETE FROM colaboradores");
                            });
                            $('#listaColaboradores').html('<tr class="th"><th></th><th>Cód.</th><th>Nome</th><th>CPF</th><th></th></tr>');
                            if (result.user.colaboradores.length > 0) {
                                $.each(result.user.colaboradores, function (i, item) {
                                    app.setColaboradores(item.id, item.empresa, item.nome, item.cpf, item.rg, item.nascimento, item.sexo, item.email, item.foto, item.codigo, item.setor, item.funcao, item.coligada, item.altura, item.calca, item.calcado, item.camiseta, item.glicemia, item.peso, item.pressaoarterial, item.temperatura);
                                });
                            }
                        } else {

                        }
                        app.loaded();
                    },
                    error: function (result) {
                        console.log(result);

                    }
                });


                break;
            case "login":
                //alert();
                app.localStorage.clear();
                app.setNavegacao('close');
                $("#celNovoCadastro").val("");
                $("input[type=text]").val("");
                $("input[type=password]").val("");
                $("#home .pagina .conteudo").html("");
                $("#paginaFoto .conteudo").removeAttr('data-uFoto');

                
                $('#inserirDadosInicio').html(app.inserirDadosInicio);
                
                break;
            case "esqueciSenha":
                $("#codeSms").val("");
                $("#celRecuperarSenha").val("");
                app.localStorage.removeItem("errodeCodigo");
                app.localStorage.removeItem("codeSmsRecuperarSenha");
                app.setNavegacao('login');
                break;


            default:
                app.setNavegacao('home');
                break;
        }
    },
    idade: function (data_nascimento) {
        var hoje = new Date();
        var nascimento = new Date(data_nascimento);
        return Math.floor(Math.ceil(Math.abs(nascimento.getTime() - hoje.getTime()) / (1000 * 3600 * 24)) / 365.25) + ' Anos';
    },
    setNavegacao: function (back) {
        app.localStorage.setItem('back', back);
    },
    getNavegacao: function () {
        return app.localStorage.getItem('back');
    },
    alerta: function (msg, title, btn, func) {
        if (!msg)
            msg = 'Erro!';
        if (!title)
            title = 'Ops!';
        if (!btn)
            btn = 'Ok';
        if (!func)
            func = null;
        navigator.notification.alert(msg, func, title, btn);
    },
    confirma: function (title, msg, callBack, btn1, btn2) {
        if (!title)
            title = 'Confirme sua ação';
        if (!msg)
            msg = 'Deseja realmente fazer isso?';
        if (!btn1)
            btn1 = 'Ok';
        if (!btn2)
            btn2 = 'Cancelar';

        navigator.notification.confirm(msg, onConfirm, title, [btn1, btn2]);
        function onConfirm(b) {
            if (b == 1) {
                window[callBack]();
            }
        }

    },
    loading: function (msgText, theme, textVisible, textonly, html) {
        if (!msgText)
            msgText = false;
        if (!theme)
            theme = 'a';
        if (!textVisible)
            textVisible = false;
        if (!textonly)
            textonly = false;
        if (!html)
            html = "";
        textVisible = !msgText ? false : true;
        theme = !msgText ? 'a' : 'b';
        $.mobile.loading("show", {
                        text: msgText,
                        textVisible: textVisible,
                        theme: theme,
                        textonly: textonly,
                        html: html
            });
    },
    loaded: function () {
        $.mobile.loading("hide");
    },
    transmiteOfflines: function (alertas, getTotal, totalOff) {
        if (getTotal == false) {
            getTotal = false;
        } else {
            getTotal = true;
        }
        if (!alertas)
            alertas = false;
        if (!totalOff)
            totalOff = 0;

        if (alertas) {
            $(".modalOfflines").show();
        }


        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM dados', [], function (tx, results) {
                var len = results.rows.length, i;
                if (len > 0) {
                    if (getTotal) {
                        totalOff = len;
                        $(".progressoOfflines").css({width: '0%'});
                    }
                    var col = results.rows.item(0);
                    console.log(results.rows.item(0).id);
                    var progressoOfflines = 100 - 100 * len / totalOff;
                    $(".progressoOfflines").css({width: progressoOfflines + '%'});
                    $.ajax({
                        url: app.urlServidor,
                        type: "POST",
                        data: {
                            tipo: 'setDados',
                            apiToken: app.apiToken,
                            userId: app.localStorage.getItem('id'),
                            userChave: app.localStorage.getItem('chave'),
                            cliente: app.localStorage.getItem('cliente'),
                            tipodados: col.tipo,
                            colaborador: col.colaborador,
                            valor: col.valor,
                            data: col.data
                        },
                        dataType: 'json',
                        success: function (result) {
                            console.log(result);
                            if (result.return == "ok") {
                                db.transaction(function (tx) {
                                    tx.executeSql("DELETE FROM dados WHERE id = ? AND tipo = ? AND colaborador = ? AND data = ? ", [col.id, col.tipo, col.colaborador, col.data], function (tx, results) {
                                        app.transmiteOfflines(alertas, false, totalOff);
                                    });
                                });
                            } else {
                                $(".modalOfflines").hide();
                                app.alerta('Ocorreram alguns erros ao enviar os Offlines!\n Tente novamente para completar a ação!');

                            }
                        }, error: function (result) {
                            $(".modalOfflines").hide();
                            app.alerta('Ocorreram alguns erros ao enviar os Offlines!\n Tente novamente para completar a ação!');
                            console.log(result);
                        }
                    });
                } else {
                    $(".progressoOfflines").css({width: '100%'});
                    $(".modalOfflines").hide();
                    if (alertas) {
                        app.alerta('Dados transmitidos com sucesso!', ' ');
                    }
                    $(".progressoOfflines").css({width: '0%'});
                }
            });
        });

    },
    onRead: function () {
        var pagina, scroll, auxScroll = 0, sentidoScroll = 'up', carregandoFotos = false;

        /*dialogos=============================================================*/



        $(document).on("click", ".openDialogo", function () {
            var botao = $(this);
            var dialogo = $("#" + botao.attr('data-dialog'));
            var ul = dialogo.children('ul');
            dialogo.fadeIn(100);
            var nh = ul.height();
            ul.css({bottom: '-' + nh + 'px'}).animate({bottom: '0px'}, 150);
            pagina = dialogo.closest('div[data-role="page"]');
            pagina.css({'overflow-y': 'hidden', position: 'fixed', top: '-' + scroll + 'px'});
            pagina.attr('data-top', scroll);
        });
        $(document).on("click", '.dialogo li', function () {
            var botao = $(this);
            var dialogo = botao.closest('.dialogo');
            var ul = botao.closest('ul');
            var nh = ul.height();
            ul.animate({bottom: '-' + nh + 'px'}, 100);
            dialogo.fadeOut(100);
            pagina.css({'overflow-y': 'auto', position: 'absolute', top: '0'});
            $(document).scrollTop(pagina.attr('data-top'));
        });

        /*=====================================================================*/
        $(document).on('scroll', function () {
            scroll = $(this).scrollTop();
        });
        /*dialogos=============================================================*/
        $(window).on("navigate", function (event, data) {
            if (app.getNavegacao() == 'close') {
                //alert("Saindo...");
                if ($.swipebox.isOpen) {
                    $('#swipebox-close').click();
                } else {
                    navigator.app.exitApp();
                }
            } else if (app.getNavegacao() != null) {
                app.carregaPage(app.getNavegacao());
            }
            return false;
        });
        /*=====================================================================*/

        $(document).on("submit", "form", function () {
            return false;
        });
        /*====================================================================*/
        $(document).on("click", "#btnLogar", function () {
            app.loading("Carregando...");
            var cpfLogin = $("#cpfLogin");
            var senha = $("#senhaLogin");
            $.ajax({
                url: app.urlServidor,
                type: "POST",
                data: {
                    tipo: 'logar',
                    apiToken: app.apiToken,
                    cpf: cpfLogin.val(),
                    senha: senha.val()
                },
                dataType: 'json',
                success: function (result) {
                    app.loaded();
                    if (result.return == "ok") {
                        console.log(result);
                        cpfLogin.removeClass("inputError");
                        senha.removeClass("inputError");
                        $("#errologin").hide();
                        app.localStorage.setItem('id', result.user.id);
                        app.localStorage.setItem('nome', result.user.nome);
                        app.localStorage.setItem('foto', result.user.foto);
                        app.localStorage.setItem('email', result.user.email);
                        app.localStorage.setItem('chave', result.user.userChave);
                        app.localStorage.setItem('cliente', result.user.cliente);
                        $('.userNome').html(app.localStorage.getItem('nome'));
                        if (app.localStorage.getItem('foto') !== 'default') {
                            var foto64 = app.localStorage.getItem('foto');
                            $('.fotoUser').attr('src', foto64);
                            $('.fotoUser').attr('href', foto64);
                            $('.fotoUser').attr('title', app.localStorage.getItem('nome'));
                            $('.fotoUser').swipebox();
                        }

                        if (app.localStorage.getItem('foto') === 'default') {
                            $('.fotoUser').attr({'src': 'images/default.jpg'});
                        }
                        db.transaction(function (tx) {
                            tx.executeSql("DELETE FROM colaboradores");
                        });
                        $('#listaColaboradores').html('<tr class="th"><th></th><th>Cód.</th><th>Nome</th><th>CPF</th><th></th></tr>');
                        if (result.user.colaboradores.length > 0) {
                            $.each(result.user.colaboradores, function (i, item) {
                                app.setColaboradores(item.id, item.empresa, item.nome, item.cpf, item.rg, item.nascimento, item.sexo, item.email, item.foto, item.codigo, item.setor, item.funcao, item.coligada, item.altura, item.calca, item.calcado, item.camiseta, item.glicemia, item.peso, item.pressaoarterial, item.temperatura);
                            });
                        }

                        app.carregaPage("home");
                    } else {
                        cpfLogin.addClass("inputError");
                        senha.addClass("inputError");
                        $("#errologin").show();
                        console.log(result);
                    }
                },
                error: function (result) {
                    console.log(result);
                    app.alerta("Erro ao tentar logar!");
                    app.loaded();
                }
            });
            return false;
        });
        /*====================================================================*/
        $(document).on("click", "#btnAvaliacao", function () {
            $(".modalAvaliacao").show();
        });
        /*====================================================================*/
        $(document).on("click", ".modal.modalAvaliacao img", function () {
            var valor = $(this).attr('data-value');
            console.log(valor);

            $.ajax({
                url: app.urlServidor,
                type: "post",
                data: {
                    tipo: 'setAvaliacao',
                    nota: valor,
                    apiToken: app.apiToken,
                    userId: app.localStorage.getItem('id'),
                    userChave: app.localStorage.getItem('chave'),
                },
                dataType: 'json',
                success: function (result) {
                    console.log(result);
                    if (result.return == "ok") {
                        $(".modal.modalAvaliacao img").attr('src', 'images/starW.png');
                        for (var i = 1; i <= valor; i++) {
                            $('.modal.modalAvaliacao img[data-value="' + i + '"]').attr('src', 'images/starY.png');
                        }
                    } else {

                    }

                },
                error: function (result) {

                }
            });

        });
        /*====================================================================*/
        $(document).on("click", "#SugestaoSalvar", function () {
            var btnSalvar = $(this);
            btnSalvar.attr('disabled', 'disabled');

            var erros = false;

            var sugestao = $("#sugestaoTexto");


            if (!app.valida('requerido', sugestao.val())) {
                sugestao.addClass('inputError');
                erros = true;
            } else {
                sugestao.removeClass('inputError');
            }

            if (erros) {
                btnSalvar.removeAttr('disabled');
            } else {
                app.loading("Carregando...");
                $.ajax({
                    url: app.urlServidor,
                    type: "POST",
                    data: {
                        tipo: 'setSugestao',
                        apiToken: app.apiToken,
                        userId: app.localStorage.getItem('id'),
                        userChave: app.localStorage.getItem('chave'),
                        sugestao: sugestao.val(),
                    },
                    dataType: 'json',
                    success: function (result) {
                        btnSalvar.removeAttr('disabled');
                        console.log(result);
                        app.loaded();
                        if (result.return == "ok") {
                            app.alerta('Enviado com Sucesso!', ' ');
                            sugestao.val('');
                            app.carregaPage('home');

                        } else {
                            app.alerta("Erro ao Salvar!");
                        }
                    },
                    error: function (result) {
                        btnSalvar.removeAttr('disabled');
                        console.log(result);
                        app.alerta("Erro ao Salvar!");
                        app.loaded();
                    }
                });
            }

        });
        /*====================================================================*/
        $(document).on("click", ".iconViewColaborador", function () {
            var id = $(this).attr('data-id');
            app.loading("Carregando...");
            db.transaction(function (tx) {
                tx.executeSql("SELECT * FROM colaboradores WHERE id = ? ", [id], function (tx, results) {
                    var len = results.rows.length, i;
                    if (len > 0) {

                        var col = results.rows.item(0);
                        $('.modalViewColaborador .fotoColaborador').attr('src', col.foto != 'default' ? col.foto : 'images/default.jpg');
                        $('.modalViewColaborador .nomeCol').html(col.nome);
                        $('.modalViewColaborador .CPFCol').html(col.cpf);
                        $('.modalViewColaborador .PISCol').html(col.rg);
                        $('.modalViewColaborador .emailCol').html(col.email);
                        $('.modalViewColaborador .empresaCol').html(col.empresa);
                        $('.modalViewColaborador .nascimentoCol').html(col.nascimento.substr(0, 10).split('-').reverse().join('/'));
                        $('.modalViewColaborador .idadeCol').html(app.idade(col.nascimento));
                        $('.modalViewColaborador .sexoCol').html(col.sexo);
                        $('.modalViewColaborador .setorCol').html(col.setor);
                        $('.modalViewColaborador .funcaoCol').html(col.funcao);
                        $('.modalViewColaborador .coligadaCol').html(col.coligada);

                        app.loaded();


                        $('.modalViewColaborador').show();
                    }
                });

            });
        });




        /*=====================================================================*/
        $(document).on("change", 'input[type="date"]', function () {
            $(this).attr('data-placeholder', $(this).attr('placeholder'));
            if (app.valida('data', $(this).val())) {
                $(this).removeAttr('placeholder');
            } else {
                $(this).attr('placeholder', $(this).attr('data-placeholder'));
            }
        });
        $(document).on("change", 'input[type="time"]', function () {
            $(this).attr('data-placeholder', $(this).attr('placeholder'));
            if (app.valida('hora', $(this).val())) {
                $(this).removeAttr('placeholder');
            } else {
                $(this).attr('placeholder', $(this).attr('data-placeholder'));
            }
        });
        /*=====================================================================*/
        $(document).on("click", '.btnOrigAnexo', function () {
            var orig = $(this).attr('data-orig');
            var destino = "#" + $(this).attr('data-destino');
            var accept = $(this).attr('data-accept');

            if (orig == 'camera') {
                Origem = Camera.PictureSourceType.CAMERA;
            } else if (orig == 'galeria') {
                Origem = Camera.PictureSourceType.SAVEDPHOTOALBUM;
            } else if (orig == 'arquivo') {
                alert(accept);
            }
            if (orig == 'camera' || orig == 'galeria') {
                navigator.camera.getPicture(onSuccess, onFail, {
                    sourceType: Origem,
                    quality: 80,
                    targetWidth: 1000,
                    targetHeight: 1000,
                    destinationType: Camera.DestinationType.DATA_URL,
                    saveToPhotoAlbum: false,
                });
                function onSuccess(imageData) {
                    //alert(destino);
                    $(destino + ' .porcentoUnico').html('<img style="height:auto;max-width:100%;max-height:100%" class="swipebox" href="data:image/jpeg;base64,' + imageData + '" rel="IMG' + app.random(1, 9999999) + '" src="data:image/jpeg;base64,' + imageData + '">').css({background: '#fff'});
                    $(destino + ' .progressoUnico').show();
                    $(destino + ' .boxFilesUnico').animate({height: '100px'}, 100);
                    $(destino + ' .arquivoServer').attr('data-tipo', 'base64').attr('data-editou', '1').val('data:image/jpeg;base64,' + imageData);

                    $('.swipebox').swipebox();
                    //alert(imageData);
                    //app.uploadFile(imageData,box);
                }
                function onFail(message) {
                    if (message != 'No Image Selected') {
                        //app.alerta('Erro ao Inicar a Câmera');
                    }

                }
            } else if (orig == 'arquivo') {
                $(destino + ' .boxFilesUnico').animate({height: '30px'}, 100);
            }
        });

        /*====================================================================*/
        $(document).on("click", '#btnUpdateColaboradores', function () {
            app.loading("Carregando...");
            $.ajax({
                url: app.urlServidor,
                type: "POST",
                data: {
                    tipo: 'getInit',
                    apiToken: app.apiToken,
                    userId: app.localStorage.getItem('id'),
                    userChave: app.localStorage.getItem('chave'),
                    cliente: app.localStorage.getItem('cliente'),
                },
                dataType: 'json',
                success: function (result) {
                    if (result.return == 'ok') {

                        db.transaction(function (tx) {
                            tx.executeSql("DELETE FROM colaboradores");
                        });
                        $('#listaColaboradores').html('<tr class="th"><th></th><th>Cód.</th><th>Nome</th><th>CPF</th><th></th></tr>');
                        if (result.user.colaboradores.length > 0) {
                            $.each(result.user.colaboradores, function (i, item) {
                                app.setColaboradores(item.id, item.empresa, item.nome, item.cpf, item.rg, item.nascimento, item.sexo, item.email, item.foto, item.codigo, item.setor, item.funcao, item.coligada, item.altura, item.calca, item.calcado, item.camiseta, item.glicemia, item.peso, item.pressaoarterial, item.temperatura);
                            });
                        }
                        app.alerta('Dados Atualizados!', ' ');
                    } else {
                        app.alerta('Erro ao carregar dados!');
                    }
                    app.loaded();
                },
                error: function (result) {
                    app.loaded();
                    app.alerta('Erro ao carregar dados!');

                }
            });
        });
        /*====================================================================*/
        $(document).on("keyup", '#inputBusca', function () {
            var valBusca = app.retira_acento($(this).val());
            if (valBusca.length > 0) {
                $("#imgBusca").attr('src', 'images/icons/black/excluir.png').attr('data-acao', 'exclui');
                if (valBusca.length > 1) {
                    $("#imgBusca").attr('src', 'images/spinner.gif').attr('data-acao', 'busca');


                    db.transaction(function (tx) {
                        tx.executeSql("SELECT * FROM colaboradores WHERE nome LIKE ? OR codigo LIKE ? OR cpf LIKE ? ", ['%' + valBusca + '%', '%' + valBusca + '%', '%' + valBusca + '%'], function (tx, results) {
                            var len = results.rows.length, i;
                            console.log(len);
                            if (len > 0) {
                                var tr = '<tr>';
                                for (var i = 0; i < results.rows.length; i++) {
                                    var cols = results.rows.item(i);
                                    tr += '<tr><td style="width: 75px;"><img class="imgFoto" src="' + (cols.foto != 'default' ? cols.foto : 'images/default.jpg') + '"></td>';
                                    tr += '<td style=" border-top: 1px solid #ccc;">';
                                    tr += '<p><strong>Cód.: </strong><span class="codigo">' + cols.codigo + '</span></p>';
                                    tr += '<p><strong>Nome: </strong><span class="nome">' + cols.nome + '</span></p>';
                                    tr += '<p><strong>CPF: </strong><span class="nome">' + cols.cpf + '</span></p>';
                                    tr += '<p><strong>RG: </strong><span class="nome">' + cols.rg + '</span></p>';
                                    tr += '</td>';
                                    tr += '<td>';
                                    tr += '<img class="imgLoadColaborador" data-id="' + cols.id + '" src="images/icons/color/selecionar.png">';
                                    tr += '</td></tr>';
                                }
                                $("#resultBusca").html(tr).css({'display': 'block'});
                            } else {
                                $("#resultBusca").html('<tr><td><strong>Nada encontrado!!!</strong></td></tr>').show();
                            }
                            $("#inputBusca").addClass('aberto');
                        }, function (tx, erro) {
                            console.log('erro: ' + erro);
                        });
                    }, function () {
                        $("#imgBusca").attr('src', 'images/icons/black/excluir.png').attr('data-acao', 'exclui');
                    }, function () {
                        $("#imgBusca").attr('src', 'images/icons/black/excluir.png').attr('data-acao', 'exclui');
                    });

                }
            } else {
                $("#imgBusca").attr('src', 'images/icons/black/view.png').attr('data-acao', 'busca');
                $("#inputBusca").val('').removeClass('aberto');
                $("#barraBusca").removeClass('aberto');
                $("#resultBusca").hide();
            }
        });

        $(document).on("click", '#imgBusca[data-acao="exclui"]', function () {
            $("#imgBusca").attr('src', 'images/icons/black/view.png').attr('data-acao', 'busca');
            $("#inputBusca").val('').removeClass('aberto');
            $("#barraBusca").removeClass('aberto');
            $("#resultBusca").hide();
        });

        $(document).on("click", '.imgLoadColaborador', function () {
            app.loading('Carregando...');
            var id = $(this).attr('data-id');

            db.transaction(function (tx) {
                tx.executeSql("SELECT * FROM colaboradores WHERE id = ? ", [id], function (tx, results) {
                    var len = results.rows.length, i;
                    console.log(len);
                    if (len > 0) {
                        var cols = results.rows.item(0);
                        $('#dadosInsert').attr('data-id', cols.id);
                        $('#dadosInsert .foto img').attr('src', cols.foto != 'default' ? cols.foto : 'images/default.jpg');
                        $('#dadosInsert .codigo span').html(cols.codigo);
                        $('#dadosInsert .nome').html(cols.nome);
                        $('#dadosInsert .cpf span').html(cols.cpf);
                        $('#dadosInsert .rg span').html(cols.rg);
                        $('#dadosInsert .nascimento span').html(cols.nascimento.substr(0, 10).split('-').reverse().join('/'));
                        $('#dadosInsert .idade span').html(app.idade(cols.nascimento));
                        $('#dadosInsert .setor span').html(cols.setor);
                        $('#dadosInsert .funcao span').html(cols.funcao);
                        $('#dadosInsert .coligada span').html(cols.coligada);
                        $('#alturaAnt').val(cols.altura);
                        $('#calcaAnt').val(cols.calca);
                        $('#calcadoAnt').val(cols.calcado);
                        $('#camisetaAnt').val(cols.camiseta);
                        $('#glicemiaAnt').val(cols.glicemia);
                        $('#pesoAnt').val(cols.peso);
                        $('#pressaoarterialAnt').val(cols.pressaoarterial);
                        $('#temperaturaAnt').val(cols.temperatura);

                        $('#btnSalvaDados').removeAttr('disabled');
                        app.loaded();


                    } else {
                        app.alerta('Erro ao carregar!');
                        app.loaded();
                    }

                }, function (tx, erro) {
                    app.alerta('Erro ao carregar!');
                    app.loaded();
                });
            });

            $("#inputBusca").removeClass('aberto');
            $("#barraBusca").removeClass('aberto');
            $("#resultBusca").hide();

        });
        /*====================================================================*/
        $(document).on("click", "#sendOfflines", function () {
            app.transmiteOfflines(true);
        });
        /*====================================================================*/
        $(document).on("click", "#btnSalvaDados", function () {
            app.loading("Salvando...");
            var colaborador = $("#dadosInsert").attr('data-id');
            var d = new Date();
            var data = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
            var altura = $("#altura").val();
            var calca = $("#calca").val();
            var calcado = $("#calcado").val();
            var camiseta = $("#camiseta").val();
            var glicemia = $("#glicemia").val();
            var peso = $("#peso").val();
            var pressaoarterial = $("#pressaoarterial").val();
            var temperatura = $("#temperatura").val();

            if (temperatura != '' && (temperatura < 30 || temperatura > 45)) {
                app.alerta('Temperatura fora dos limites!');
                app.loaded();
            } else {

                db.transaction(function (tx) {
                    if (altura != '') {
                        var idaltura = app.random(111111, 999999);

                        tx.executeSql("INSERT INTO dados (id, tipo, colaborador, valor, data) VALUES (?,?,?,?,?)", [idaltura, 'altura', colaborador, altura, data], function () {
                            $("#alturaAnt").val(altura);
                            $("#altura").val('');
                            tx.executeSql("UPDATE colaboradores SET altura = ? WHERE id = ? ", [altura, colaborador]);
                            console.log('altura');
                        });
                    }
                    if (calca != '') {
                        var idcalca = app.random(111111, 999999);
                        tx.executeSql("INSERT INTO dados (id, tipo, colaborador, valor, data) VALUES (?,?,?,?,?)", [idcalca, 'calca', colaborador, calca, data], function () {
                            $("#calcaAnt").val(calca);
                            $("#calca").val('');
                            tx.executeSql("UPDATE colaboradores SET calca = ? WHERE id = ? ", [calca, colaborador]);
                            console.log('calca');
                        });
                    }
                    if (calcado != '') {
                        var idcalcado = app.random(111111, 999999);
                        tx.executeSql("INSERT INTO dados (id, tipo, colaborador, valor, data) VALUES (?,?,?,?,?)", [idcalcado, 'calcado', colaborador, calcado, data], function () {
                            $("#calcadoAnt").val(calcado);
                            $("#calcado").val('');
                            tx.executeSql("UPDATE colaboradores SET calcado = ? WHERE id = ? ", [calcado, colaborador]);
                            console.log('calcado');
                        });
                    }
                    if (camiseta != '') {
                        var idcamiseta = app.random(111111, 999999);
                        tx.executeSql("INSERT INTO dados (id, tipo, colaborador, valor, data) VALUES (?,?,?,?,?)", [idcamiseta, 'camiseta', colaborador, camiseta, data], function () {
                            $("#camisetaAnt").val(camiseta);
                            $("#camiseta").val('');
                            tx.executeSql("UPDATE colaboradores SET camiseta = ? WHERE id = ? ", [camiseta, colaborador]);
                            console.log('camiseta');
                        });
                    }
                    if (glicemia != '') {
                        var idglicemia = app.random(111111, 999999);
                        tx.executeSql("INSERT INTO dados (id, tipo, colaborador, valor, data) VALUES (?,?,?,?,?)", [idglicemia, 'glicemia', colaborador, glicemia, data], function () {
                            $("#glicemiaAnt").val(glicemia);
                            $("#glicemia").val('');
                            tx.executeSql("UPDATE colaboradores SET glicemia = ? WHERE id = ? ", [glicemia, colaborador]);
                            console.log('glicemia');
                        });
                    }
                    if (peso != '') {
                        var idpeso = app.random(111111, 999999);
                        tx.executeSql("INSERT INTO dados (id, tipo, colaborador, valor, data) VALUES (?,?,?,?,?)", [idpeso, 'peso', colaborador, peso, data], function () {
                            $("#pesoAnt").val(peso);
                            $("#peso").val('');
                            tx.executeSql("UPDATE colaboradores SET peso = ? WHERE id = ? ", [peso, colaborador]);
                            console.log('peso');
                        });
                    }
                    if (pressaoarterial != '') {
                        var idpressaoarterial = app.random(111111, 999999);
                        tx.executeSql("INSERT INTO dados (id, tipo, colaborador, valor, data) VALUES (?,?,?,?,?)", [idpressaoarterial, 'pressaoarterial', colaborador, pressaoarterial, data], function () {
                            $("#pressaoarterialAnt").val(pressaoarterial);
                            $("#pressaoarterial").val('');
                            tx.executeSql("UPDATE colaboradores SET pressaoarterial = ? WHERE id = ? ", [pressaoarterial, colaborador]);
                            console.log('pressaoarterial');
                        });
                    }
                    if (temperatura != '') {
                        var idtemperatura = app.random(111111, 999999);
                        tx.executeSql("INSERT INTO dados (id, tipo, colaborador, valor, data) VALUES (?,?,?,?,?)", [idtemperatura, 'temperatura', colaborador, temperatura, data], function () {
                            $("#temperaturaAnt").val(temperatura);
                            $("#temperatura").val('');
                            tx.executeSql("UPDATE colaboradores SET temperatura = ? WHERE id = ? ", [temperatura, colaborador]);
                            console.log('temperatura');
                        });
                    }

                }, function () {
                    app.transmiteOfflines();
                    app.loaded();
                }, function () {
                    app.loaded();
                    app.transmiteOfflines();
                });
            }
        });


        /*====================================================================*/
        $(document).on("click", ".setPage", function () {

            var page = "#" + $(this).attr('data-page');
            $(".pagina").hide();
            $(".setPage").removeClass('active');
            $(page).show();
            $(this).addClass('active');

        });

        $(document).on("keypress", ".decimal", function (e) {

            if (!e) {
                if (window.event) {
                    e = window.event;
                } else {
                    return;
                }
            }
            if (typeof (e.which) === 'number') {
                e = e.which;
            } else if (typeof (e.charCode) === 'number') {
                e = e.charCode;
            } else if (typeof (e.keyCode) === 'number') {
                e = e.keyCode;
            } else {
                return;
            }



            if ((e > 47 && e < 58 || e === 8 || e === 46 || e === 44)) {
                if (e === 44) {
                    if ($(this).val().indexOf(".") === -1 && ($(this).val() !== "")) {
                        $(this).val($(this).val() + '.');
                    }
                    return false;
                } else if (e === 46 && $(this).val().indexOf(".") !== -1 || ($(this).val() === "") && e === 46) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        });
        $(document).on("keypress", ".inteiro", function (e) {
            var tecla = (window.event) ? event.keyCode : event.which;
            if ((tecla > 47 && tecla < 58 || tecla === 8)) {
                return true;
            } else {
                return false;
            }
        });

    },

    retira_acento: function (text) {
        text = text.replace(new RegExp('[ÁÀÂÃ]', 'gi'), 'A');
        text = text.replace(new RegExp('[ÉÈÊ]', 'gi'), 'E');
        text = text.replace(new RegExp('[ÍÌÎ]', 'gi'), 'I');
        text = text.replace(new RegExp('[ÓÒÔÕ]', 'gi'), 'O');
        text = text.replace(new RegExp('[ÚÙÛ]', 'gi'), 'U');
        text = text.replace(new RegExp('[Ç]', 'gi'), 'C');
        text = text.replace(new RegExp('[áàâã]', 'gi'), 'a');
        text = text.replace(new RegExp('[éèê]', 'gi'), 'e');
        text = text.replace(new RegExp('[íìî]', 'gi'), 'i');
        text = text.replace(new RegExp('[óòôõ]', 'gi'), 'o');
        text = text.replace(new RegExp('[úùû]', 'gi'), 'u');
        text = text.replace(new RegExp('[ç]', 'gi'), 'c');
        return text;
    },
    valida: function (tipo, valor) {
        switch (tipo) {
            case "requerido":
                if (valor != '') {
                    return true;
                }
                break;
            case "empresa":
                if (valor > 0) {
                    return true;
                }
                break;
            case "colaborador":
                if (valor > 0) {
                    return true;
                }
                break;
            case "senha":
                {
                    if (valor.length >= 6) {
                        return true;
                    }
                }
                break;
            case "chavecript":
                {
                    if (valor.length >= 6 && valor.length <= 32) {
                        return valor.match(/[A-Za-z0-9]$/);
                    }
                }
                break;
            case "pin":
                {
                    if (valor.length >= 4) {
                        return valor.match(/^[0-9]+$/);
                    }
                }
                break;
            case "nome":
                {
                    return valor.match(/^[\D]{3,} [\D]{2,}$/);
                }
                break;
            case "email":
                {
                    return valor.match(/^[a-zA-Z.0-9_-]+@[\a-zA-Z0-9_-]+[.][a-zA-Z.0-9_-]*[a-zA-Z0-9]$/);
                }
                break;
            case "data":
                {
                    var data = valor.replace(/[^\d]+/g, '');
                    if (data.length == 8) {
                        return true;
                    } else {
                        return false;
                    }
                }
                break;
            case "hora":
                {
                    var data = valor.replace(/[^\d]+/g, '');
                    if (data.length == 4 || data.length == 6) {
                        return true;
                    } else {
                        return false;
                    }
                }
                break;
            default:

                break;
        }
    }
};
