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
                throw TypeError('util initAudio: need param src!')
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
                if(obj && obj.clone){
                    return obj.clone();
                }
                for(var i in obj){
                    if(obj[i] instanceof HTMLElement || obj[i] == Object.getPrototypeOf(obj)[i]){
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
                throw TypeError('GameUtil collisionTest(): params is not right! ');
            }
        },
        angToRed: function(angle){
            return angle / 360 * 2 * Math.PI;
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
        setCursor: function ( str ) {
            $('#'+global.canvasElement.id).css('cursor', str);
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
            var util = this;
            if(list[0] && list[0].className == 'missile'){
                for(var i in list){
                    var obj  = list[i];
                    if(!util.isInCanvas(obj)&&
                        obj.restFollow<=0){
                        list.splice(i,1);
                    }
                }
            } else{
                for(var i in list){
                    if(!util.isInCanvas(list[i])){
                        list.splice(i,1);
                    }
                }
            }
        },
        isInCanvas: function ( obj ) {
            if(obj && obj.position && obj.position.x != null && obj.position.y != null){
                var x = obj.position.x,
                    y = obj.position.y;
                return !(x - obj.width - global.width > 0   ||
                x + obj.width < 0                           ||
                y - obj.height - global.height > 0          ||
                y + obj.height < 0);
            } else{
                throw TypeError('util isInCanvas: param is not right!');
            }
        },
        inherit: function ( obj ) {
            if(obj == null) {throw  TypeError()}

            if( Object.create) return Object.create(obj);

            var t = typeof p;
            if( t !== 'object' && t !== 'function') throw TypeError();
            function f(  ) {};
            f.prototype = obj;
            return new f();
        },
        //first param must be array, second param must be object
        paramInclude: function ( parentArray, includedObj ) {
            if(typeof parentArray == 'object' && typeof includedObj == 'object'){
                for(var i in parentArray){
                    var flag = false;
                    for(var j in includedObj){
                        if(j == parentArray[i]){
                            flag = true;
                            break;
                        }
                    }
                    if(!flag) throw TypeError(parentArray[i] + ' is request');
                }
                return true;
            } else{
                throw TypeError('util paramInclude(): params are not right!');
            }
        },
        resolveColor: function (  ) {
            if(arguments.length == 3){
                return 'rgba(' + arguments[0] + ',' + arguments[1] + ',' + arguments[2] + ',' + 1 + ')';
            } else if(arguments.length == 4){
                return 'rgba(' + arguments[0] + ',' + arguments[1] + ',' + arguments[2] + ',' + arguments[3] +')';
            } else{
                throw TypeError('util resolveColor(): params are not right!')
            }
        },
        getColor: function ( str ) {
          if(typeof str !== 'string'){
              throw TypeError('util getColor(): params are not right!');
          } else{
              str = str.split('(')[1].split(')')[0].split(',');
              return {
                  r: str[0],
                  g: str[1],
                  b: str[2]
              }
          }
        },
        randomPN: function (  ) {
            return (Math.random() > 0.5 ? 1 : -1);
        },
        randomInt: function ( l_num, r_num ) {
            if(arguments.length == 1){
                return Math.round(Math.random() * l_num);
            } else if(arguments.length == 2){
                return Math.round(Math.random() * (r_num - l_num) + l_num);
            } else{
                throw TypeError('util randomInt(): parmas are not right!');
            }
        }
    };
    return new GameUtil();
});
