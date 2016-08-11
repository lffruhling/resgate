/**
 * Created by Leonardo on 06/07/2016.
 */
function start(){ //Início da função start()
    $("#inicio").hide();

    $("#fundoGame").append("<div id='jogador' class='anima1'></div>");
    $("#fundoGame").append("<div id='inimigo1' class='anima2'></div>");
    $("#fundoGame").append("<div id='inimigo2'></div>");
    $("#fundoGame").append("<div id='amigo' class='anima3'></div>");

    //Prinicipais variáveis do jogo
    var jogo = {}
    var velocidade = 5;
    var posicaoY = parseInt(Math.random * 334);
    var podeAtirar = true;

    var TECLA = {
        W: 87,
        S: 83,
        D: 68
    }

    jogo.pressionou = [];

    //verifica se o usuário pressionou alguma tecla
    $(document).keydown(function(e){
        jogo.pressionou[e.which] = true;
    });

    $(document).keyup(function(e){
        jogo.pressionou[e.which] = false;
    });

    //Game loop

    jogo.timer = setInterval(loop, 30);

    function loop(){
        movefundo();
        movejogador();
        moveinimigo1();
        moveinimigo2();
        moveamigo();
        colisao();
    }//Fim da função loop

    //Função movimenta o fundo do jogo
    function movefundo(){
        esquerda = parseInt($("#fundoGame").css("background-position"));
        $("#fundoGame").css("background-position",esquerda-1);
    }//fim função moveFundo

    function movejogador(){
        if(jogo.pressionou[TECLA.W]){
            var topo = parseInt($("#jogador").css("top"));
            $("#jogador").css("top",topo-10);
            if(topo <= 0){
                $("#jogador").css("top",topo+10);
            }
        }

        if(jogo.pressionou[TECLA.S]){
            var topo = parseInt($("#jogador").css("top"));
            $("#jogador").css("top",topo+10);
            if(topo >= 434){
                $("#jogador").css("top",topo-10);
            }
        }

        if(jogo.pressionou[TECLA.D]){
            //chama função disparo
            disparo();
        }
    }//fim move jogador

    function moveinimigo1(){
        posicaoX = parseInt($("#inimigo1").css("left"));
        $("#inimigo1").css("left", posicaoX - velocidade);
        $("#inimigo1").css("top", posicaoY);

        if (posicaoX <=0){
            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left",694);
            $("#inimigo1").css("top", posicaoY);
        }
    }//fim move inimigo1

    function moveinimigo2(){
        posicaoX = parseInt($("#inimigo2").css("left"));
        $("#inimigo2").css("left",posicaoX-3);

        if(posicaoX <=0){
            $("#inimigo2").css("left",775);
        }
    }//fim move inimigo2

    function moveamigo(){
        posicaoX = parseInt($("#amigo").css("left"));
        $("#amigo").css("left", posicaoX+1);

        if(posicaoX > 906){
            $("#amigo").css("left",0);
        }
    }//fim função amigo

    function disparo() {
        if (podeAtirar) {
            podeAtirar = false;

            topo = parseInt($("#jogador").css("top"));
            posicaoX = parseInt($("#jogador").css("left"));
            tiroX = posicaoX + 190;
            topoTiro = topo + 37;
            $("#fundoGame").append("<div id='disparo'></div>");
            $("#disparo").css("top", topoTiro);
            $("#disparo").css("left", tiroX);

            var tempoDisparo = window.setInterval(executaDisparo, 30)
        }

        function executaDisparo(){
            posicaoX = parseInt($("#disparo").css("left"));
            $("#disparo").css("left", posicaoX + 15);

            if (posicaoX > 900){
                window.clearInterval(tempoDisparo);
                tempoDisparo = null;
                $("#disparo").remove();
                podeAtirar = true;
            }
        }
    } //Fecha disparo()

    function colisao (){
        var colisao1 = ($("#jogador").collision($("#inimigo1")));
        //Pega colisão do jogador com o inimigo1 (helicoptero)

        //Console.log usado para saber o que tem dentro da colisao1, muito bom para debug.
        console.log(colisao1);
        if (colisao1.length > 0){
            //captura local da explosão
            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));
            explosao1(inimigo1X, inimigo1Y);

            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left", 694);
            $("#inimigo1").css("top", posicaoY);
        }

    }//Fim função colisao

    //Explosão 1
    function explosao1(inimigo1X,inimigo1Y){
        //somExplosao.play();

        $("#fundoGame").append("<div id='explosao1'></div>");
        $("#explosao1").css("background-image", "url(imgs/explosao.png)");

        /*Para facilitar a digitação, foi criada a var div, esta var
        * recebe a dis explosao1, ou seja, a partir deste ponto usar
        * $("#explosao1").algumaCoisa ou div.algumaCoisa, tem o mesmo
        * valor para o código.*/

        var div = $("#explosao1");
        div.css("top", inimigo1Y);
        div.css("left", inimigo1X);
        div.animate({width:200, opacity:0}, "slow");

        var tempoExplosao = window.setInterval(removeExplosao, 1000);

        function removeExplosao(){
            div.remove();
            window.clearInterval(tempoExplosao);
            tempoExplosao = null;
        }
    }// Fim explosao1
}//Fim função start()
