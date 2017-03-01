/**
 * Created by lzh on 2017/2/28.
 */

define(['util',
'position'], function ( util, Position ) {
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
        if (params.direction!=null) {
            this.direction = params.direction;
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
    }

    FlyObject.prototype = {
        className: 'flyObject',
        constructor: FlyObject,
        context: null,
        loadImg: function () {
            var obj = this;
            obj.img = util.initImage({
                width: obj.width,
                height: obj.height,
                src: obj.src
            });
        },
        // if img is null, the obj's img param will be used
        drawImg: function (ctx,img) {
            var obj = this;
            var drawImg = null;
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
            obj.position.y -= obj.speed * Math.cos(obj.direction / 360 * Math.PI * 2);
            obj.position.x += obj.speed * Math.sin(obj.direction / 360 * Math.PI * 2);
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
        }
    };

    return FlyObject;
});