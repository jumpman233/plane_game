/**
 * Created by lzh on 2017/2/28.
 */

define(['util',
'position',
'global'], function ( util, Position, global ) {
    'use strict';
    /**
     * FlyObject
     * a basic class of fly object
     * parent of class 'plane' and 'bullet'
     * attributes:
     position:    position
     speed:        number
     imgSrc:    string
     rotate:    string
     */
    function FlyObject(params) {
        if (!params) return;

        if(params.width){
            this.width = params.width;
        } else {
            this.width = 10;
        }
        if(params.height){
            this.height = params.height;
        } else{
            this.height = 10;
        }

        if (params.x && params.y) {
            this.position = new Position(
                params.x + this.width / 2,
                params.y + this.height / 2);
        } else {
            this.position = new Position(0, 0);
        }
        if (params.speed) {
            this.speed = params.speed;
        } else {
            this.speed = 10;
        }
        if (params.img) {
            this.img = params.img;
        }
        if (params.src) {
            this.src = params.src;
        }
        if (params.direction !== null) {
            this.direction = params.direction;
            this.originDirection = this.direction;
        }
        if (params.deadImg){
            this.deadImg = params.deadImg;
        }
        if (params.deadSrc) {
            this.deadSrc = params.deadSrc;
        }
        if (params.target) {
            this.target = params.target;
        }
        if (params.maxRotate) {
            this.maxRotate = params.maxRotate;
        } else{
            this.maxRotate = 5;
        }
        this.k = 0;
        this.b = 0;
    }

    FlyObject.prototype = {
        className: 'flyObject',
        constructor: FlyObject,
        setKb: function (  ) {
            var obj = this,
                rotation = this.direction,
                x = this.position.x,
                y = this.position.y,
                pi = Math.PI;
            if(rotation == pi / 2 || rotation == pi / 2 * 3){
                obj.k = 0;
            } else{
                obj.k = Math.tan(rotation);
            }

            obj.b = y - obj.k * x;
        },
        rotateToAngle: function ( angle ) {
            var obj = this,
                rotateAngle = this.maxRotate,
                totAngle = Math.abs(this.direction - angle);
            if(totAngle <= rotateAngle){
                rotateAngle = totAngle;
            }
            if(obj.direction < angle) {
                obj.direction += rotateAngle;
            } else{
                obj.direction -= rotateAngle;
            }
        },
        loadImg: function () {
            var obj = this;
            obj.img = util.initImage({
                width: obj.width,
                height: obj.height,
                src: obj.src
            });
        },
        // if img is null, the obj's img param will be used
        drawImg: function (img) {
            var obj = this;
            var drawImg = null;
            var ctx = global.context;
            if(img instanceof Image){
                drawImg = img;
            } else{
                drawImg = obj.img;
            }
            ctx.save();
            ctx.translate(obj.position.x, obj.position.y);
            ctx.rotate(obj.direction/180*Math.PI);
            ctx.drawImage(drawImg, - obj.width/2, - obj.height/2, obj.width, obj.height);
            ctx.restore();
        },
        move: function () {
            var obj = this;
            obj.position.y -= obj.speed * Math.cos(util.angToRed(obj.direction));
            obj.position.x += obj.speed * Math.sin(util.angToRed(obj.direction));
        },
        moveToTarget: function () {
            var obj = this;
            if(obj.hasOwnProperty("target") && obj.target.hasOwnProperty("position")){
                var targetPos = obj.target.position;
                var pos = obj.position;
                var includeAng = Position.prototype.includeAng(pos, targetPos, obj.direction);
                if(Math.abs(includeAng) <= obj.maxRotate){
                    obj.direction += includeAng;
                } else{
                    if((includeAng < 0 && includeAng > -180) || includeAng>180){
                        obj.direction -= obj.maxRotate;
                        if(obj.direction < 0){
                            obj.direction = 360 + obj.direction;
                        }
                    } else{
                        obj.direction += obj.maxRotate;
                        if(obj.direction >= 360){
                            obj.direction -= 360;
                        }
                    }
                }

                obj.position.y -= obj.speed * Math.cos(obj.direction / 180 * Math.PI);
                obj.position.x += obj.speed * Math.sin(obj.direction / 180 * Math.PI);
            }
        },
        clone: function (  ) {
            var newFly = new FlyObject(),
                oldFly = this;

            for(var i in oldFly){
                if(oldFly[i] && oldFly[i].clone){
                    newFly[i] = oldFly[i].clone();
                } else{
                    newFly[i] = oldFly[i];
                }
            }

            return newFly;
        }
    };

    return FlyObject;
});