/**
 * Created by lzh on 2017/2/28.
 */

define(['util',
'flyObject'],function ( util , FlyObject) {

    /**
     * Missile
     * a object which can follow a target
     * params:
     * maxFollow: the seconds of following time
     * restFollow: rest time of time
     */
    function Missile(params) {
        if(!params) return;

        FlyObject.apply(this, arguments);
        if(params.maxFollow){
            this.maxFollow = params.maxFollow;
        }
        if(params.type){
            this.type = params.type;
        }
        // if there is no global variable called fps, it will create a default fps to build variable restFollow
        if(undefined !== fps){
            fps = 50;
        }
        this.restFollow = this.maxFollow ? this.maxFollow * fps : 5 * fps;
        console.log(this.restFollow);
    }
    Missile.prototype = util.copy(FlyObject.prototype);
    Missile.prototype.className = "missile";
    Missile.prototype.constructor = Missile;
    Missile.prototype.draw = function (ctx) {
        this.drawImg(ctx,this.img);
    };
    Missile.prototype.move = function () {
        var missile = this;
        if(missile.restFollow <= 0){
            FlyObject.prototype.move.call(missile);
        } else{
            FlyObject.prototype.moveToTarget.call(missile);
        }
        missile.restFollow--;
    };

    return Missile;
})