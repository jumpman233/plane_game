
/**
 * Created by lzh on 2017/3/1.
 */

define(['warehouse',
'global',
'player',
'util'],function ( warehouse, global, player, util ) {
    function RandomBuild(  ) {

    }
    RandomBuild.prototype = {
        createEnemyPlane: function ( probability ) {
            if(Math.random()<probability){
                var x = Math.random()*global.width;
                var m = Math.floor(Math.random()*warehouse.enemyList.length) + 1;
                var enemy = warehouse.getEnemyByType(m);
                var plane = enemy.plane;
                plane.shootTime = plane.shootRate;
                plane.position.x = x;
                plane.position.y = 0;
                plane.direction = 180;
                plane.canShoot = true;
                plane.curBullet = 0;
            }
            return enemy;
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
        },
        createTool : function ( probability ) {
            var allWeight = 0;

            var rand = Math.random();
            if(rand>probability){
                return;
            }

            for(var i in warehouse.toolList){
                var tool = warehouse.toolList[i];
                allWeight += tool.weight;
            }
            rand = Math.random() * allWeight;
            for(var i in warehouse.toolList){
                var tool = warehouse.toolList[i];
                rand -= tool.weight;
                if(rand<=0){
                    var newTool = util.copy(tool);
                    newTool.init();
                    newTool.extraTime = fps * newTool.existTime;
                    return newTool;
                }
            }
        }
    };
    return new RandomBuild();
});