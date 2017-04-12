/**
 * Created by lzh on 2017/2/28.
 */

define(['global'],function ( global ) {
    'use strict';
    function GameEventHandler() {
        this.mouseMoveList = [];
        this.keydownList = [];
    }
    GameEventHandler.prototype = {
        constructor: GameEventHandler,
        mouseMove:function (funcObj) {
            global.context.canvas.addEventListener('mousemove', funcObj, false);
            this.mouseMoveList.push(funcObj);
        },
        keydown: function (funcObj) {
            $(document)[0].addEventListener('keydown', funcObj, false);
            this.keydownList.push(funcObj);
        },
        removeAllEvents: function (  ) {
            var geh = this;
            for(var i = 0; i < geh.mouseMoveList.length; i++){
                global.canvasElement.removeEventListener('mousemove', geh.mouseMoveList[i]);
            }
            for(var i = 0; i < geh.mouseMoveList.length; i++){
                global.canvasElement.removeEventListener('keydown', geh.keydownList[i]);
            }
        },
        mouseDown:function (funcObj) {
            global.context.canvas.addEventListener('mousedown', funcObj, false);
        }
    };
    return new GameEventHandler();
});