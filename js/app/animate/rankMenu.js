/**
 * Created by lzh on 2017/4/12.
 */

define(['text', 'global', 'rect', 'util'], function ( Text, global, Rect, util ) {
    'use strict';
    var rankData,
        isRemoving, isRemoved, isIn,
        rankText,
        rankList,
        width,
        height,
        backText = new Text(),
        backRect = new Rect(),
        backEvent;

    var getEmptyString = function ( n ) {
        var str = '';
        for(var i = 0; i < n; i++){
            str += ' ';
        }
        return str;
    };

    var init = function ( data, backCallback) {
        var fontSize = global.optFont * 1.5,
            indexH , indexW , dh;

        backEvent = backCallback;

        rankData = data;
        rankList = [];

        isRemoving = false;
        isRemoved = false;
        isIn = false;

        width = global.width;
        height = global.height;
        indexH = height / 5;
        indexW = width / 2;
        dh = fontSize * 2.5;

        rankText = new Text();
        rankText.fontSize = fontSize * 2;
        rankText.text = 'RANKING';
        rankText.x = indexW;
        rankText.y = indexH;
        rankText.scale = 0;
        indexH += dh * 1.5;

        for(var i = 0; i < data.length; i++){
            var newText = new Text();
            newText.text = 'TOP' + ( i + 1 ) + getEmptyString(40) + data[i];
            newText.x = indexW;
            newText.y = indexH;
            newText.scale = 0;
            indexH += dh;
            rankList.push(newText);
        }

        indexH += dh;

        backText.text = 'BACK';
        backText.x = indexW;
        backText.y = indexH;
        backText.fontSize = fontSize * 1.2;
        backText.scale = 0;

        backRect.width = global.optWidth;
        backRect.height = backText.fontSize * 1.5;
        backRect.x = indexW - backRect.width / 2;
        backRect.y = indexH - backRect.height * 0.7;
        backRect.scale = 0;
    };

    var moveIn = function (  ) {
        if(rankText.scale <= 1){
            rankText.scale += 0.05;
        } else if(rankList[rankList.length - 1].scale <= 1){
            for(var i = 0; i < rankList.length; i++){
                if(rankList[i].scale <= 1){
                    rankList[i].scale += 0.1;
                    break;
                }
            }
        } else if(backText.scale <= 1 && backRect.scale <= 1){
            backText.scale += 0.05;
            backRect.scale += 0.05;
        } else if(!isIn){
            isIn = true;
            addEvents();
        }
    };

    var moveOut = function (  ) {
        if(rankText.scale > 0){
            rankText.scale -= 0.05;
        } else if(rankList[rankList.length - 1].scale >= 0){
            for(var i = 0; i < rankList.length; i++){
                if(rankList[i].scale >= 0){
                    rankList[i].scale -= 0.1;
                    break;
                }
            }
        } else if(backText.scale >= 0 && backRect.scale >= 0){
            backText.scale -= 0.05;
            backRect.scale -= 0.05;
        } else{
            isRemoved = true;
        }
    };

    var draw = function (  ) {
        if(!isRemoving && !isIn){
            moveIn();
        } else if(isRemoving){
            moveOut();
        }
        rankText.draw(global.context);

        rankList.forEach(function ( text ) {
            text.draw(global.context);
        });

        backRect.draw(global.context);
        backText.draw(global.context);
    };

    var mouseMoveEvent = function ( e ) {
        var pos = util.getEventPosition(e);

        if(backRect.isInclude(pos.x, pos.y)){
            util.setCursor('pointer');
            backRect.fillColor = global.selectColor;
        } else{
            util.setCursor('default');
            backRect.fillColor = global.selectDefaultColor;
        }
    };

    var clickEvent = function ( e ) {
        var pos = util.getEventPosition(e);

        if(backRect.isInclude(pos.x, pos.y)){
            backEvent(e);
            util.setCursor('default');
        }
    };

    var removeEvents = function (  ) {
        global.canvasElement.removeEventListener('mousemove', mouseMoveEvent);
        global.canvasElement.removeEventListener('click', clickEvent);
    };

    var addEvents = function (  ) {
        global.canvasElement.addEventListener('mousemove', mouseMoveEvent);
        global.canvasElement.addEventListener('click', clickEvent);
    };

    var remove = function (  ) {
        removeEvents();

        isRemoving = true;
    };

    return {
        init: init,
        draw: draw,
        remove: remove,
        isRemoved: function (  ) {
            return isRemoved;
        }
    }
});