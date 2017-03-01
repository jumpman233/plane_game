/**
 * Created by lzh on 2017/2/28.
 */

define(['position'],function ( Position ) {
    /**
     * GameUtil
     */
    function GameUtil(){

    }
    GameUtil.prototype = {
        initImage: function(params){
            var image = new Image();
            image.height = params.height;
            image.width = params.width;
            image.src = params.src;
            image.onload = params.onload;
            return image;
        },
        copy: function (obj) {
            var util = this;

            if(obj == undefined) return;
            if(Array.isArray(obj) && obj) {
                var list = [];
                for(var i in obj){
                    list.push(util.copy(obj[i]));
                }
                return list;
            } else if(typeof obj == 'object'){
                var newObj = new Object();
                for(var i in obj){
                    if(obj[i] instanceof Image || obj[i] == Object.getPrototypeOf(obj)[i]){
                        newObj[i] = obj[i];
                    } else{
                        newObj[i] = util.copy(obj[i]);
                    }
                }
                return newObj;
            }
            else {
                return obj;
            }

        },
        collisionTest: function (obj1, obj2) {
            if(obj1.position && obj1.width && obj1.height &&
                obj2.position && obj2.width && obj2.height){
                return Math.abs(obj2.position.x - obj1.position.x) < (obj1.width + obj2.width) / 2 &&
                    Math.abs(obj2.position.y - obj1.position.y) < (obj1.height + obj2.height) / 2
            } else{
                throw Error('GameUtil collisionTest(): params is not right! ');
            }
        },
        getEventPosition: function (e) {
            if(undefined == e){
                return;
            }
            if(e.layerX || e.layerX == 0){
                return new Position(e.layerX, e.layerY);
            }  else if(e.offsetX || e.offsetX == 0){
                return new Position(e.offsetX, e.offsetX);
            }
        },
        checkInRect: function ( pos, rectX, rectY, rectW, rectH ) {
            return pos.x <= rectX+ rectW && pos.x >= rectX &&
                pos.y >= rectY && pos.y <= rectY + rectH;
        },
        sleep: function (duration) {
            var start = new Date();
            while(true){
                var time = new Date();
                if(time.getTime()-start.getTime() > duration){
                    break;
                }
            }
        },
        playAudio: function (params) {
            if(!params.src){
                throw Error("playAudio lack of param src!");
            }
            var audio = new Audio(params.src);
            if(params.loop){
                audio.loop = true;
            }
            audio.volume = this.getCurSound();
            audio.play();
            return audio;
        },
        getCurSound: function(  ) {
            return $('#soundSlider')[0].valueAsNumber;
        }
    };
    return new GameUtil();
});