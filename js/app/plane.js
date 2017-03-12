/**
 * Created by lzh on 2017/2/28.
 */

define(['util',
    'flyObject',
    'dataManager',
    'sound',
    'behTree',
    'behNode'
],function ( util, FlyObject, dataManager, sound) {
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
        } else{
            this.canShoot = true;
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
        if(params.deadAudioName){
            this.deadAudioName = params.deadAudioName;
        }
        this.deadAudio = null;
        this.isDead = false;
        this.animateSave = 0;
        this.canDestroy = false;
        this.target = null;
    }
    Plane.prototype = util.copy(FlyObject.prototype);
    Plane.prototype.constructor = Plane;
    Plane.prototype.className = 'plane';
    Plane.prototype.loadImg = function () {
        var plane = this;
        plane.img = util.initImage({
            width: plane.width,
            height: plane.height,
            src: plane.src
        });
        plane.deadImg = util.initImage({
            width: plane.width,
            height: plane.height,
            src: plane.deadSrc
        });
    };
    Plane.prototype.drawPlane = function () {
        var plane = this;
        if(!plane.isDead){
            plane.drawImg(plane.img);
        } else{
            plane.animateSave--;
            if(plane.animateSave <= 0){
                plane.canDestroy = true;
            }
            plane.drawImg(plane.deadImg);
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
                sound.playAudio(plane.deadAudio);
            }
        }
    };
    Plane.prototype.draw = function () {
        var plane = this;
        plane.drawPlane();
    };
    Plane.prototype.shoot = function (  ) {
        var plane = this;
        if(plane.shootTime-- <= 0 && plane.canShoot && plane.curBullet != undefined){
            var bulList = plane.bulletStyle.getBullets(plane.curBullet);
            for (var i = 0 ;i<bulList.length;i++){
                bulList[i].position = util.copy(plane.position);
                bulList[i].parent = plane;
                bulList[i].direction = bulList[i].direction + bulList[i].parent.direction;
                bulList[i].move();
                dataManager.resolveBullet(bulList[i]);
            }
            plane.shootTime = plane.shootRate;
            sound.playAudio(plane.bulletStyle.audio);
        }
    };
    Plane.prototype.moveToTarget = function (  ) {
        FlyObject.prototype.moveToTarget();
    };
    Plane.prototype.clone = function (  ) {
        var newPlane = new Plane(),
            oldPlane = this;

        for(var i in oldPlane){
            if(oldPlane[i] && typeof oldPlane[i] == 'object' && oldPlane[i].clone){
                newPlane[i] = oldPlane[i].clone();
            } else{
                newPlane[i] = oldPlane[i];
            }
        }
        return newPlane;
    };

    return Plane;
});