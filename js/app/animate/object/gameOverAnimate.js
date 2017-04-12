/**
 * Created by lzh on 2017/4/11.
 */

define(['global', 'text', 'rect', 'util'], function ( global, Text, Rect, util ) {
    'use strict';
    var scoreText = new Text(),
        gameOverText = new Text(),
        moneyText = new Text(),
        onceAgainText = new Text(),
        onceAgainRect = new Rect(),
        returnMainText = new Text(),
        returnMainRect = new Rect(),
        newRecordText = new Text(),
        onceAgainTextTarget = {x: 0, y: 0},
        onceAgainRectTarget = {x: 0, y: 0},
        returnMainTextTarget = {x: 0, y: 0},
        returnMainRectTarget = {x: 0, y: 0},
        width,
        height,
        fontSize,
        dh,
        optWidth,
        optHeight,
        money,
        score,
        onceAgainClick,
        returnMainClick,
        isFinish,
        ds,
        isRemoving,
        isRemoved,
        dScore,
        resolveMoney,
        updateRanking,
        isNewRecord,
        dAng = 5;

    function updateScore(  ) {
        scoreText.text = 'SCORE: ' + score;
    }

    function updateMoney(  ) {
        moneyText.text = 'MONEY: ' + money + 'G';
    }

    var init = function ( params, onceAgainEvent, returnMainEvent, resolveMon ) {
        var baseH, baseW, indexH, dw;

        isFinish = false;
        isRemoving = false;
        isRemoved = false;
        isNewRecord = false;
        ds = 0.05;

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
        onceAgainClick = onceAgainEvent;
        returnMainClick = returnMainEvent;
        resolveMoney = resolveMon;

        updateRanking = params.updateRanking;

        fontSize = height / 100 * 3;
        dh = fontSize * 2;

        gameOverText.text = 'GAME OVER';
        gameOverText.fontSize = fontSize * 2;
        gameOverText.x = baseW;
        gameOverText.y = baseH;
        gameOverText.scale = 0;
        indexH += dh * 3;

        updateScore();
        scoreText.fontSize = fontSize * 1.5;
        scoreText.x = baseW;
        scoreText.y = indexH;
        scoreText.scale = 0;
        indexH += dh * 2;

        newRecordText.text = 'New Record!';
        newRecordText.color = 'red';
        newRecordText.fontSize = fontSize * 0.75;
        newRecordText.rotate = 0;
        newRecordText.x = baseW + scoreText.fontSize * scoreText.text.toString().length / 2;
        newRecordText.y = scoreText.y - scoreText.fontSize;
        newRecordText.scale = 0;
        newRecordText.dAng = dAng;

        updateMoney();
        moneyText.fontSize = fontSize * 1.5;
        moneyText.x = baseW;
        moneyText.y = indexH;
        moneyText.scale = 0;
        indexH += dh * 4;

        onceAgainText.text = 'ONCE AGAIN';
        onceAgainText.fontSize = fontSize;
        onceAgainText.y = indexH;
        onceAgainText.x = -(fontSize * onceAgainText.text.length) * 2;
        onceAgainTextTarget.x = width / 2 - dw;
        onceAgainTextTarget.y = indexH;

        onceAgainRect.width = onceAgainText.text.length * fontSize;
        onceAgainRect.height = fontSize * 1.5;
        onceAgainRect.x = -onceAgainRect.width*2;
        onceAgainRect.y = indexH - onceAgainRect.height * 0.7;
        onceAgainRectTarget.x = width / 2 - dw - onceAgainRect.width / 2;
        onceAgainRectTarget.y = indexH - onceAgainRect.height * 0.7;

        returnMainText.text = 'MAIN MENU';
        returnMainText.fontSize = fontSize;
        returnMainText.y = indexH;
        returnMainText.x = width + returnMainText.text.length * fontSize * 2;
        returnMainTextTarget.x = width / 2 + dw;
        returnMainTextTarget.y = indexH;

        returnMainRect.width = returnMainText.text.length * fontSize;
        returnMainRect.height = fontSize * 1.5;
        returnMainRect.x = width + returnMainRect.width * 2;
        returnMainRect.y = indexH - returnMainRect.height * 0.7;
        returnMainRectTarget.x = width / 2 + dw - returnMainRect.width / 2;
        returnMainRectTarget.y = indexH - returnMainRect.height * 0.7;
    };

    var mouseMoveEvent = function ( e ) {
        var pos = util.getEventPosition(e);

        if(returnMainRect.isInclude(pos.x, pos.y)){
            returnMainRect.fillColor = global.selectColor;
            util.setCursor('pointer');
        } else if(onceAgainRect.isInclude(pos.x, pos.y)){
            onceAgainRect.fillColor = global.selectColor;
            util.setCursor('pointer');
        } else{
            returnMainRect.fillColor = global.selectDefaultColor;
            onceAgainRect.fillColor = global.selectDefaultColor;
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

    var easeMove = function ( sta, des ) {
        sta.x += (des.x - sta.x) * 0.07;
        sta.y += (des.y - sta.y) * 0.03;
    };

    var drawIn = function ( ) {
        if(gameOverText.scale <= 1){
            gameOverText.scale += ds;
        } else if(scoreText.scale <= 1){
            scoreText.scale += ds;
            if(!isNewRecord && updateRanking(score)){
                isNewRecord = true;
            }
        } else if(isNewRecord && newRecordText.scale <= 1){
            newRecordText.scale += ds / 2;
            var ang = util.redToAng(newRecordText.rotate);
            if(ang >= 30){
                newRecordText.dAng = -dAng;
            } else if(ang <= -30){
                newRecordText.dAng = dAng;
            }
            newRecordText.rotate += util.angToRed(newRecordText.dAng);
        } else if(moneyText.scale <= 1){
            moneyText.scale += ds;
        } else if(Math.abs(onceAgainTextTarget.x - onceAgainText.x) >= 1 &&
            Math.abs(onceAgainRectTarget.x - onceAgainRect.x) >= 1){
            easeMove(onceAgainRect, onceAgainRectTarget);
            easeMove(onceAgainText, onceAgainTextTarget);
            easeMove(returnMainRect, returnMainRectTarget);
            easeMove(returnMainText, returnMainTextTarget);
        } else if(score > 0){
            dScore = parseInt(score / 50);
            if(dScore < 10){
                dScore = 10;
            }
            if(score < dScore){
                dScore = score;
            }
            score -= dScore;
            money += Math.floor(dScore / 10);
            updateScore();
            updateMoney();
        } else if(!isFinish){
            isFinish = true;
            registerEvents();
            resolveMoney(money);
        }
    };

    var drawOut = function ( ) {
        if(Math.abs(onceAgainTextTarget.x - onceAgainText.x) >= 20 &&
            Math.abs(onceAgainRectTarget.x - onceAgainRect.x) >= 20){
            onceAgainRect.move();
            onceAgainText.move();
            returnMainRect.move();
            returnMainText.move();
        } else if(scoreText.scale >= 0 && moneyText.scale >= 0){
            scoreText.scale -= ds;
            moneyText.scale -= ds;
            newRecordText.scale -= ds;
        } else if(gameOverText.scale >= 0){
            gameOverText.scale -= ds;
        } else{
            isRemoved = true;
            registerEvents();
        }
    };

    var draw = function ( ctx ) {
        if(isRemoved)
            return;

        if(isRemoving){
            drawOut(ctx);
        } else{
            drawIn(ctx);
        }

        gameOverText.draw(ctx);

        scoreText.draw(ctx);
        moneyText.draw(ctx);

        newRecordText.draw(ctx);

        onceAgainRect.draw(ctx);
        onceAgainText.draw(ctx);

        returnMainRect.draw(ctx);
        returnMainText.draw(ctx);

    };

    var remove = function (  ) {
        isRemoving = true;

        clearAllEvents();

        returnMainRectTarget.x = width + returnMainRect.width * 1.5;
        returnMainTextTarget.x = width + returnMainRect.width * 1.5;
        returnMainRect.vx = 20;
        returnMainText.vx = 20;

        onceAgainTextTarget.x = -onceAgainRect.width * 1.5;
        onceAgainRectTarget.x = -onceAgainRect.width * 1.5;
        onceAgainRect.vx = -20;
        onceAgainText.vx = -20;

    };

    return {
        init: init,
        draw: draw,
        remove: remove,
        isRemoved: function (  ) {
            return isRemoved;
        }
    };
});