/**
 * Created by lzh on 2017/2/28.
 */

define([''],function (  ) {
    'use strict';
    function GameEventHandler(params) {
        if(params && params.target){
            this.target = params.target;
        } else{
            throw Error('GameEventHandler: constructor lack attribute target!');
        }
    }
    GameEventHandler.prototype = {
        mouseMove:function (funcObj) {
            this.target.addEventListener('mousemove', funcObj, false);
        },
        keydown: function (funcObj) {
            $(document)[0].addEventListener('keydown', funcObj, false);
        },
        mouseDown:function (funcObj) {
            this.target.addEventListener('mousedown', funcObj, false);
        },
        constructor: GameEventHandler
    };
    return GameEventHandler;
})