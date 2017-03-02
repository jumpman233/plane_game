/**
 * Created by lzh on 2017/2/28.
 */

define(['global'],function ( global ) {
    'use strict';
    function GameEventHandler() {

    }
    GameEventHandler.prototype = {
        constructor: GameEventHandler,
        mouseMove:function (funcObj) {
            global.context.canvas.addEventListener('mousemove', funcObj, false);
        },
        keydown: function (funcObj) {
            $(document)[0].addEventListener('keydown', funcObj, false);
        },
        mouseDown:function (funcObj) {
            global.context.canvas.addEventListener('mousedown', funcObj, false);
        }
    };
    return new GameEventHandler();
});