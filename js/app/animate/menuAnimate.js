/**
 * Created by lzh on 2017/3/8.
 */

define(['global', 'rect', 'text'], function ( global, Rect, Text ) {
    var context = null,
        optWidth = 0,
        optHeight = 0,
        optFont = 0,
        width = 0,
        height = 0,
        startText = new Text(),
        startRect = new Rect(),
        gameNameText = new Text(),
        startOptTarget = {x:0, y:0},
        gameNameTarget = {x:0, y:0},
        easing = 0.06,
        mainMenuComplete = false,
        mainMenuRemoving = false,
        mainMenuRemoved = false,
        storeText = new Text(),
        storeRect = new Rect(),
        storeOptTarget = {x: 0, y:0},
        startClickListener = null,
        storeClickListener = null;

    var initMenuData = function ( startClickLis, storeClickLis ) {
        if(global.width == 0 && global.height == 0){
            throw TypeError('initMenuData: global has not been init!');
        }
        optFont = global.optFont;
        optWidth = global.optWidth;
        optHeight = global.optHeight;
        width = global.width;
        height = global.height;
        context = global.context;
        startClickListener = startClickLis;
        storeClickListener = storeClickLis;

        resetMainMenu();
    };

    var easeMoveToTarget = function ( x1, y1, x2, y2 ) {
        return {
            dx: easing * (x2 - x1),
            dy: easing * (y2 - y1)
        }
    };

    var resetMainMenu = function (  ) {
        gameNameTarget.x = width / 2;
        gameNameTarget.y = height / 5;

        startOptTarget.x = width / 2;
        startOptTarget.y = height / 2;

        storeOptTarget.x = width / 2;
        storeOptTarget.y = height / 2 + optHeight * 2;

        gameNameText.x = width / 2;
        gameNameText.y = -optHeight;
        gameNameText.text = 'FIGHT IN SKY';

        startRect.x = width / 2 - optWidth / 2;
        startRect.y = height + optHeight;
        startText.x  = width / 2;
        startText.y  = height + optHeight;
        startText.fontSize = optFont;

        startRect.width = optWidth;
        startRect.height = optHeight;
        startText.text = 'START GAME';

        storeRect.width = optWidth;
        storeRect.height = optHeight;

        storeRect.x = width / 2 - optWidth / 2;
        storeRect.y = height + optHeight;
        storeText.x = width / 2;
        storeText.y = height + optHeight;
        storeText.text = 'STORE';
        storeText.fontSize = optFont;

        mainMenuComplete = false;
        mainMenuRemoving = false;
        mainMenuRemoved = false;
    };

    var inScreen = function ( ctx ) {
        var d1 = easeMoveToTarget(gameNameText.x, gameNameText.y, gameNameTarget.x, gameNameTarget.y),
            d2 = easeMoveToTarget(startText.x, startText.y, startOptTarget.x, startOptTarget.y),
            d3 = easeMoveToTarget(startRect.x, startRect.y, startOptTarget.x - optWidth / 2, startOptTarget.y - optHeight * 0.7),
            d4 = easeMoveToTarget(storeRect.x, storeRect.y, storeOptTarget.x - optWidth / 2, storeOptTarget.y - optHeight * 0.7),
            d5 = easeMoveToTarget(storeText.x, storeText.y, storeOptTarget.x, storeOptTarget.y);

        gameNameText.x += d1.dx;
        gameNameText.y += d1.dy;

        startRect.x += d3.dx;
        startRect.y += d3.dy;
        startText.x += d2.dx;
        startText.y += d2.dy;

        storeText.x += d5.dx;
        storeText.y += d5.dy;
        storeRect.x += d4.dx;
        storeRect.y += d4.dy;

        gameNameText.draw(ctx);

        startRect.draw(ctx);
        startText.draw(ctx);
        storeRect.draw(ctx);
        storeText.draw(ctx);

        if(Math.abs(gameNameText.y - gameNameTarget.y) <= 1 && !mainMenuComplete){
            mainMenuComplete = true;
            startClickListener(startOptTarget.x, startOptTarget.y);
            storeClickListener(storeOptTarget.x, storeOptTarget.y);
        }
    };

    var outScreen = function ( ctx ) {
        startRect.draw(ctx);
        startText.draw(ctx);
        storeRect.draw(ctx);
        storeText.draw(ctx);
        gameNameText.draw(ctx);

        startText.move();
        startRect.move();
        gameNameText.move();
        storeText.move();
        storeRect.move();

        if(startText.y - optHeight > height &&
            startRect.y - optHeight > height &&
            gameNameText.y - optHeight > height){
            mainMenuRemoved = true;
        }
    };

    var drawMainMenu = function ( ctx ) {
        if(!mainMenuRemoving && !mainMenuRemoved){
            inScreen(ctx);
        } else if(mainMenuRemoving){
            outScreen(ctx);
        }
    };

    var removeMainMenu = function (  ) {
        if(mainMenuRemoving) return;

        mainMenuRemoving = true;

        var vx1 = (Math.random() * 10 + 2) * (Math.random() < 0.5 ? 1 : -1),
            ay1 =  Math.random() + 1,
            ay2 =  Math.random() + 1,
            vx2 = (Math.random() * 10 + 2) * (Math.random() < 0.5 ? 1 : -1),
            vy1 = - (Math.random() * 10 + 5),
            vy2 = - (Math.random() * 10 + 5),
            vx3 = (Math.random() * 10 + 2) * (Math.random() < 0.5 ? 1 : -1),
            vy3 = - (Math.random() * 10 + 5),
            ay3 =  Math.random() + 1;

        startText.vx = startRect.vx = vx1;
        startText.vy = startRect.vy = vy1;
        startText.ay = startRect.ay = ay1;

        storeText.vx = storeRect.vx = vx3;
        storeText.vy = storeRect.vy = vy3;
        storeText.ay = storeRect.ay = ay3;

        gameNameText.vx = vx2;
        gameNameText.vy = vy2;
        gameNameText.ay = ay2;
    };

    return {
        init: initMenuData,
        mainMenu: {
            init: initMenuData,
            reset: resetMainMenu,
            draw: drawMainMenu,
            remove: removeMainMenu,
            complete: function (  ) {
                return mainMenuComplete;
            },
            isRemoved: function (  ) {
                return mainMenuRemoved;
            }
        }
    }
});