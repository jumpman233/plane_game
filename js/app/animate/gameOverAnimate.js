/**
 * Created by lzh on 2017/4/11.
 */

define(['global', 'text', 'rect', 'util'], function ( global, Text, Rect, util ) {
    var scoreText = new Text(),
        gameOverText = new Text(),
        moneyText = new Text(),
        onceAgainText = new Text(),
        onceAgainRect = new Rect(),
        returnMainText = new Text(),
        returnMainRect = new Rect(),
        width,
        height,
        fontSize,
        dh,
        optWidth,
        optHeight,
        money,
        score,
        onceAgainClick,
        returnMainClick;

    function updateScore(  ) {
        scoreText.text = 'SCORE: ' + score;
    }

    function updateMoney(  ) {
        moneyText.text = 'MONEY: ' + money + 'G';
    }

    var init = function ( params ) {
        var baseH, baseW, indexH, dw;

        width = global.width;
        height = global.height;
        baseH = height / 5;
        baseW = width / 2;
        indexH = baseH;
        optHeight = global.optHeight;
        optWidth = global.optWidth;
        dw = width / 10 * 1.5;

        money = params.moneyValue;
        score = params.scoreValue;
        onceAgainClick = params.onceAgain;
        returnMainClick = params.returnMain;

        fontSize = height / 100 * 3;
        dh = fontSize * 2;

        gameOverText.text = 'GAME OVER';
        gameOverText.fontSize = fontSize * 2;
        gameOverText.x = baseW;
        gameOverText.y = baseH;
        indexH += dh * 3;

        updateScore();
        scoreText.fontSize = fontSize * 1.5;
        scoreText.x = baseW;
        scoreText.y = indexH;
        indexH += dh * 2;

        updateMoney();
        moneyText.fontSize = fontSize * 1.5;
        moneyText.x = baseW;
        moneyText.y = indexH;
        indexH += dh * 4;

        onceAgainText.text = 'ONCE AGAIN';
        onceAgainText.fontSize = fontSize;
        onceAgainText.y = indexH;
        onceAgainText.x = width / 2 - dw;

        onceAgainRect.width = onceAgainText.text.length * fontSize;
        onceAgainRect.height = fontSize * 1.5;
        onceAgainRect.x = width / 2 - dw - onceAgainRect.width / 2;
        onceAgainRect.y = indexH - onceAgainRect.height * 0.7;

        returnMainText.text = 'MAIN MENU';
        returnMainText.fontSize = fontSize;
        returnMainText.y = indexH;
        returnMainText.x = width / 2 + dw;

        returnMainRect.width = returnMainText.text.length * fontSize;
        returnMainRect.height = fontSize * 1.5;
        returnMainRect.x = width / 2 + dw - returnMainRect.width / 2;
        returnMainRect.y = indexH - returnMainRect.height * 0.7;

        registerEvents();
    };

    var mouseMoveEvent = function ( e ) {
        var pos = util.getEventPosition(e);

        if(returnMainRect.isInclude(pos.x, pos.y)){
            util.setCursor('pointer');
        } else if(onceAgainRect.isInclude(pos.x, pos.y)){
            util.setCursor('pointer');
        } else{
            util.setCursor('default');
        }
    };

    var clickEvent = function ( e ) {
        var pos = util.getEventPosition(e);

        if(returnMainRect.isInclude(pos.x, pos.y)){
            returnMainClick();
        } else if(onceAgainRect.isInclude(pos.x, pos.y)){
            onceAgainClick();
        }
    };

    var registerEvents = function (  ) {
        global.canvasElement.addEventListener('mousemove', mouseMoveEvent);
        global.canvasElement.addEventListener('click', clickEvent);
    };

    var clearAllEvents = function (  ) {
        global.canvasElement.removeEventListener('mousemove', mouseMoveEvent);
        global.canvasElement.removeEventListener('click', clickEvent);
    };

    var draw = function ( ctx ) {
        gameOverText.draw(ctx);

        scoreText.draw(ctx);
        moneyText.draw(ctx);

        onceAgainRect.draw(ctx);
        onceAgainText.draw(ctx);

        returnMainRect.draw(ctx);
        returnMainText.draw(ctx);

    };

    var remove = function (  ) {

    };

    return {
        init: init,
        draw: draw,
        remove: remove
    };
});