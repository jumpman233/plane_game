/**
 * Created by lzh on 2017/2/28.
 */

define(['util',
'flyObject',
'planeGame'],function ( util, FlyObject, planeGame ) {
    /**
     * plane
     * object can shoot
     * child of class 'flyObject'
     * attributes:
     position:    position
     speed:        number
     imgSrc:    string
     rotate:    string
     type:        number
     maxHp:        number
     */
    function Plane(params) {
        if (!params) return;

        FlyObject.apply(this, arguments);
        if (params.type) {
            this.type = params.type;
        }
        if(params.shootRate){
            this.shootRate = params.shootRate;
            this.shootTime = this.shootRate;
        }
        if(params.bulletType){
            this.bulletType = params.bulletType;
        }
        if(params.role){
            this.role = params.role;
        }
        if(params.canShoot){
            this.canShoot = params.canShoot;
        }
        if(params.curBullet){
            this.curBullet = params.curBullet;
        }
        if(params.hp){
            this.hp = params.hp;
        }
        if(undefined != params.score){
            this.score = params.score;
        } else{
            this.score = 1;
        }
        if(params.toolDrop){
            this.toolDrop = params.toolDrop;
        }
        if(params.deadAudioSrc){
            this.deadAudioSrc = params.deadAudioSrc;
        }
        this.bulletList = [];
        this.isDead = false;
        this.animateSave = 0;
        this.canDestroy = false;
    }
    Plane.prototype = util.copy(FlyObject.prototype);
    Plane.prototype.constructor = Plane;
    Plane.prototype.className = 'plane';
    Plane.prototype.loadImg = function () {
        var obj = this;
        obj.img = util.initImage({
            width: obj.width,
            height: obj.height,
            src: obj.src,
            onload: function () {
                obj.isInit = true;
            }
        });
        obj.deadImg = util.initImage({
            width: obj.width,
            height: obj.height,
            src: obj.deadSrc,
            onload: function () {
                obj.isInit = true;
            }
        });
    };
    Plane.prototype.drawPlane = function (ctx) {
        var plane = this;
        if(!plane.isDead){
            plane.drawImg(ctx,plane.img);
        } else{
            plane.animateSave--;
            if(plane.animateSave <= 0){
                plane.canDestroy = true;
            }
            plane.drawImg(ctx,plane.deadImg);
        }
    };
    // if the plane's hp <= 0, func will return true, else return false
    Plane.prototype.getShot = function (bullet) {
        var plane = this;
        if(plane.role == "enemy"){
            plane.hp -= bullet.damage;
            if(plane.hp<=0){
                plane.isDead = true;
                plane.animateSave = 5;
                util.playAudio({
                    src: plane.deadAudioSrc
                });
            }
        }
    };
    Plane.prototype.move = function () {
        var plane = this;
        if(!plane.isDead && plane.target && plane.target.hasOwnProperty("position")){
            FlyObject.prototype.moveToTarget.call(plane);
        } else if(!plane.isDead){
            FlyObject.prototype.move.call(plane);
        }
    };
    Plane.prototype.draw = function (ctx) {
        var plane = this;
        plane.drawPlane(ctx);

        if(plane.shootTime-- == 0 && plane.canShoot && plane.curBullet != undefined){
            var bulList = plane.bulletStyle.getBullets(plane.curBullet);
            for (var i = 0 ;i<bulList.length;i++){
                bulList[i].position = util.copy(plane.position);
                bulList[i].parent = plane;
                bulList[i].direction = bulList[i].direction + bulList[i].parent.direction;
                bulList[i].move(ctx);
                bulList[i].move(ctx);
                planeGame.bulletList.push(bulList[i]);
                plane.shootTime = plane.shootRate;
            }
            if(plane.bulletStyle.audioSrc){
                util.playAudio({
                    src: plane.bulletStyle.audioSrc
                })
            }
        }
    };

    return Plane;
});