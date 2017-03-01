/**
 * Created by lzh on 2017/2/28.
 */

define(['util',
'flyObject'], function ( util, FlyObject ) {
    /**
     * bullet
     * object can be shot
     * child of class 'flyObject'
     * attributes:
     position:    position
     speed:        number
     imgSrc:    string
     rotate:    string
     type:        number
     damage:    number
     */
    function Bullet(params) {
        if (!params) return;

        FlyObject.apply(this, arguments);
        if (params.type) {
            this.type = params.type;
        }
        if (params.damage) {
            this.damage = params.damage;
        }
        this.parent = null;
    }

    Bullet.prototype = util.copy(FlyObject.prototype);
    Bullet.prototype.constructor = Bullet;
    Bullet.prototype.className = 'bullet';
    Bullet.prototype.draw = function (ctx) {
        this.drawImg(ctx);
    };
    Bullet.prototype.move = function () {
        var bullet = this;
        bullet.position.y -= bullet.speed * Math.cos((bullet.direction) / 360 * Math.PI * 2);
        bullet.position.x += bullet.speed * Math.sin((bullet.direction) / 360 * Math.PI * 2);
    };
    return Bullet;
});