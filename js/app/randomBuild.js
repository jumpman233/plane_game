
/**
 * Created by lzh on 2017/3/1.
 */

define(['warehouse',
'global',
'player'],function ( warehouse, global, player ) {
    function RandomBuild(  ) {

    }
    RandomBuild.prototype = {
        createEnemyPlane: function ( probability ) {
            if(Math.random()<probability){
                var x = Math.random()*global.width;
                var plane = warehouse.getPlaneByType(2);
                plane.shootTime = plane.shootRate;
                plane.position.x = x;
                plane.position.y = 0;
                plane.direction = 180;
                plane.role = 'enemy';
                plane.canShoot = true;
                plane.bulletStyle = warehouse.getBulletStyleByType(2);
                plane.curBullet = 0;
            }
            console.log(plane);
            return plane;
        },
        createTool: function (  ) {

        },
        createMissile: function ( probability ) {
            if(Math.random() < probability){
                var missile = warehouse.getMissileByType(1);
                var x = Math.random()*global.width;
                missile.position.x = x;
                missile.position.y = 0;
                missile.position.direction = 180;
                missile.target = player.plane;
            }
            return missile;
        }
    };
    return new RandomBuild();
});