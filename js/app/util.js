/**
 * Created by lzh on 2017/2/28.
 */

define(['position','global'],function ( Position, global ) {
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
            global.notLoadedImgCount++;
            image.onload = function (  ) {
                global.notLoadedImgCount--;
                console.log(image.src+'加载完成!');
            };
            return image;
        },
        initAudio: function ( params ) {
            if(!params.src){
                throw Error('util initAudio: need param src!')
            }
            console.log('start to init '+params.src);
            var audio = new Audio(params.src);
            audio.loop = params.loop;
            audio.load();
            global.notLoadedAudioCount++;
            var interval = window.setInterval(function (  ) {
                if(audio.readyState){
                    console.log(params.src+'已加载！');
                    global.notLoadedAudioCount --;
                    window.clearInterval(interval);
                }
            },100);
            return audio;
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
                    if(obj[i] instanceof Audio || obj[i] instanceof Image || obj[i] == Object.getPrototypeOf(obj)[i]){
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
        dirtyCheck: function (list) {
            var game = this;
            if(list[0] && list[0].className == 'missile'){
                for(var i in list){
                    var obj  = list[i];
                    var x = list[i].position.x + list[i].width / 2;
                    var y = list[i].position.y + list[i].height / 2;
                    if((x - obj.width / 2 - game.width > 0       ||
                        x + obj.width / 2 < 0                   ||
                        y - obj.height / 2 - game.height > 0    ||
                        y + obj.height / 2 < 0                  )&&
                        obj.restFollow<=0){
                        list.splice(i,1);
                    }
                }
            } else{
                for(var i in list){
                    var obj  = list[i];
                    var x = list[i].position.x + list[i].width / 2;
                    var y = list[i].position.y + list[i].height / 2;
                    if(x - obj.width / 2 - game.width > 0       ||
                        x + obj.width / 2 < 0                   ||
                        y - obj.height / 2 - game.height > 0    ||
                        y + obj.height / 2 < 0){
                        list.splice(i,1);
                    }
                }
            }
        }
    };
    return new GameUtil();
});
