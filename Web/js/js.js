/**
 * Created by Leonardo on 06/07/2016.
 */
function start(){ //Início da função start()
    $("#inicio").hide();

    $("#fundoGame").append("<div id='jogador' class='anima1'></div>");
    $("#fundoGame").append("<div id='inimigo1' class='anima2'></div>");
    $("#fundoGame").append("<div id='inimigo2'></div>");
    $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
    $("#fundoGame").append("<div id='placar'></div>");
    $("#fundoGame").append("<div id='energia'></div>");

    //Prinicipais variáveis do jogo
    var jogo        = {}
    var velocidade  = 5;
    var posicaoY    = parseInt(Math.random * 334);
    var podeAtirar  = true;
    var fimdejogo   = false;
    var pontos      = 0;
    var salvos      = 0;
    var perdidos    = 0;
    var energiaAtual= 3;

    var TECLA = {
        W: 87,
        S: 83,
        D: 68
    }

    /*Sons do jogo*/
    var somDisparo  = document.getElementById("somDisparo");
    var somExplosao = document.getElementById("somExplosao");
    var musica      = document.getElementById("musica");
    var somGameOver = document.getElementById("somGameOver");
    var somPerdido  = document.getElementById("somPerdido");
    var somResgate  = document.getElementById("somResgate");

    /*Loop musica de fundo*/
    musica.addEventListener("ended", function(){
        musica.currentTime = 0;
        musica.play();
    }, false);
    musica.play();

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
        placar();
        energia();
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
            somDisparo.play();
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

        //Pega as colisões entre as divs
        var colisao1 = ($("#jogador").collision($("#inimigo1")));
        var colisao2 = ($("#jogador").collision($("#inimigo2")));
        var colisao3 = ($("#disparo").collision($("#inimigo1")));
        var colisao4 = ($("#disparo").collision($("#inimigo2")));
        var colisao5 = ($("#jogador").collision($("#amigo")));
        var colisao6 = ($("#inimigo2").collision($("#amigo")));

        //Console.log usado para saber o que tem dentro da colisao1, muito bom para debug.
        //console.log(colisao1);
        //Verifica se houve colisão entre jogador e helicoptero
        if (colisao1.length > 0){
            energiaAtual--;
            //captura local da explosão
            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));
            explosao1(inimigo1X, inimigo1Y);

            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left", 694);
            $("#inimigo1").css("top", posicaoY);
        }

        //verifica se houve colisão entre jogador e caminhão
        if (colisao2.length > 0){
            energiaAtual--;
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            explosao2(inimigo2X, inimigo2Y);

            $("#inimigo2").remove();

            reposicionaInimigo2();
        }

        //Verifica disparo com inimigo1 (tiro acerta helicoptero)
        if (colisao3.length > 0){

            velocidade = velocidade + 0.3;
            //console.log(velocidade);
            pontos = pontos + 100;

            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));

            explosao1(inimigo1X, inimigo1Y);

            $("#disparo").css("left", 950);

            posicaoY = parseInt(Math.random() * 394);
            $("#inimigo1").css("left", 694);
            $("#inimigo1").css("top", posicaoY);

        }

        //Verifica disparo com inimigo2 (tiro acerta caminhão)
        if (colisao4.length > 0){
            pontos = pontos + 50;

            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));

            $("#inimigo2").remove();

            explosao2(inimigo2X, inimigo2Y);

            $("#disparo").css("left", 950);

            reposicionaInimigo2();
        }

        //verifica colisão entre jogador e amigo
        if (colisao5.length > 0){
            somResgate.play();
            salvos++;
            reposicionaAmigo();
            $("#amigo").remove();
        }

        //Verifica colisão com Caminhão vc amigo
        if (colisao6.length > 0){
            perdidos++;
            amigoX = parseInt($("#amigo").css("left"));
            amigoY = parseInt($("#amigo").css("top"));
            explosao3(amigoX, amigoY);

            $("#amigo").remove();

            reposicionaAmigo();
        }
    }//Fim função colisao

    //Explosão 1
    function explosao1(inimigo1X,inimigo1Y){

        somExplosao.play();

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

    //Explosao 2
    function explosao2(inimigo2X, inimigo2Y){

        somExplosao.play();

        $("#fundoGame").append("<div id='explosao2'></div>");
        $("#explosao2").css("background-image","url(imgs/explosao.png)");
        var div2 = $("#explosao2");

        div2.css("top", inimigo2Y);
        div2.css("left", inimigo2X);
        div2.animate({width:200, opacity:0}, "slow");
        var tempoExplosao2 = window.setInterval(removeExplosao2, 1000);

        function removeExplosao2(){
            div2.remove();
            window.clearInterval(tempoExplosao2);
            tempoExplosao2 = null;
        }
    }//Fim explosão2

    //Explosão 3
    function explosao3(amigoX, amigoY){

        somExplosao.play();

        $("#fundoGame").append("<div id='explosao3' class='anima4'></div>");
        $("#explosao3").css("top", amigoY);
        $("#explosao3").css("left", amigoX);

        var tempoExplosao3 = window.setInterval(resetaExplosao3, 2000);

        function resetaExplosao3(){
            $("#explosao3").remove();
            window.clearInterval(tempoExplosao3);
            tempoExplosao3 = null;
        }
    }//fim explosao 3

    //Reposiciona inimigo2
    function reposicionaInimigo2(){
        var tempoColisao4 = window.setInterval(reposiciona4, 5000);

        function reposiciona4(){
            window.clearInterval(tempoColisao4);
            tempoColisao4 = null;

            if (!fimdejogo){
                $("#fundoGame").append("<div id='inimigo2'></div>")
            }
        }
    }//fim reposiciona inimigo2

    function reposicionaAmigo(){
        var tempoAmigo = window.setInterval(reposiciona6, 6000);

        function reposiciona6(){
            window.clearInterval(tempoAmigo);
            tempoAmigo = null;

            if (!fimdejogo){
                $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
            }
        }
    }//fim da reposicionaAmigo

    function placar(){
        $("#placar").html("<h2>Pontos: " + pontos + " Salvos: " + salvos + " Perdidos: " + perdidos + "</h2>");
    }//Fim func placar

    function energia(){
        switch (energiaAtual){
            case 3:
                $("#energia").css("background-image","url(imgs/energia3.png)");
                break;
            case 2:
                $("#energia").css("background-image","url(imgs/energia2.png)");
                break;
            case 1:
                $("#energia").css("background-image","url(imgs/energia1.png)");
                break;
            case 0:
                $("#energia").css("background-image","url(imgs/energia0.png)");
                gameOver();
                break;
        }
    }//Fim func energia

    function gameOver(){
        fimdejogo = true;
        musica.pause();
        somGameOver.play();

        window.clearInterval(jogo.timer);
        jogo.timer = null;

        $("#jogador").remove();
        $("#inimigo1").remove();
        $("#inimigo2").remove();
        $("#amigo").remove();

        $("#fundoGame").append("<div id='fim'></div>");
        $("#fim").html("<h1> Game Over </h1><p>Sua pontuação foi: " + pontos + "</p>" + "<div id='reinicia' onclick='reiniciaJogo()'><h3><a href='#'>Jogar Novamente</a></h3></div> ");
    }//fim func gameOver

}//Fim função start()

//Reiniciar o jogo
function reiniciaJogo(){
    somGameOver.pause();
    $("#fim").remove();
    start();
}//fim func reiniciarJogo
