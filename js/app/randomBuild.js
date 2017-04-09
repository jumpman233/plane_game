
/**
 * Created by lzh on 2017/3/1.
 */

define(['global',
'player',
'util'],function ( global, player, util ) {
    'use strict';
    function RandomBuild(  ) {
        this.curDiff = null;
        this.diffData = [];
        this.frequency = null;
        this.frameNum = 0;
        this.warehouse = null;
    }
    RandomBuild.prototype = {
        init: function ( warehouse ) {
            var defer = $.Deferred();
            var rb = this;
            rb.diffData = util.copy(warehouse.difficultyData);

            for(var i in rb.diffData){
                for(var j in rb.diffData[i].enemies){
                    var enemy = rb.diffData[i].enemies[j];
                    if(enemy.enemyType){
                        enemy.enemy = warehouse.getEnemyByType(enemy.enemyType);
                    }
                }
            }

            this.warehouse = warehouse;
            defer.resolve();
            return defer;
        },
        setCurDiff: function ( num ) {
            var rb = this;
            if(num >= rb.diffData.length){
                throw TypeError("RandomBuild setCurDiff: param is not right!");
            }

            rb.curDiff = rb.diffData[num];

            rb.enemyType = util.copy(rb.curDiff.enemies);
            rb.frequency = rb.curDiff.frequency;
        },
        createEnemyPlane: function ( ) {
            var rb = this,
                isCreate = false,
                x = 0,
                curDiff = rb.curDiff,
                enemyData = curDiff.enemies,
                list = [];
            if(global.frameNum % (global.fps * rb.frequency) === 0){
                while(!isCreate){
                    for(var i = 0; i < enemyData.length; i++){
                        var e_data = enemyData[i];
                        if(Math.random() <= e_data.possibility){
                            var newEnemy = rb.initNewEnemy(e_data);
                            list.push(newEnemy);
                            isCreate = true;
                        }
                    }
                }
            }
            return list;
        },
        initNewEnemy: function ( enemyData ) {
            var enemy = enemyData.enemy,
                list = [],
                initNum = util.randomInt(enemyData.min_num, enemyData.max_num),
                plane_width = enemy.plane.width + 5,
                initMaxWidth = global.width - plane_width * initNum,
                startX = Math.random() * initMaxWidth;

            var initOne = function ( enemy ) {
                var plane = enemy.plane;

                plane.canShoot = enemyData.canShoot;
                enemy.score = enemyData.score;
                enemy.secureDis = enemyData.secureDis * plane.speed;
                plane.position.x = startX;
                plane.position.y = - plane.height;
                plane.originDirection = 180;
                plane.direction = plane.originDirection;
                plane.curBullet = 0;

                startX += plane_width;

                return enemy;
            };

            for(var i = 0; i < initNum; i++){
                var newEnemy = initOne(enemy.clone());
                list.push(newEnemy);
            }

            return list;
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
        createTool : function ( probability, position ) {
            var allWeight = 0,
                rm = this;
            if(typeof probability !== 'number' || !position || !position.x || !position.y){
                throw TypeError('randomBuild createTool(): params are not right!');
            }

            var rand = Math.random();
            if(rand > probability){
                return;
            }

            for(var i in rm.warehouse.toolList){
                var tool = rm.warehouse.toolList[i];
                allWeight += tool.weight;
            }
            rand = Math.random() * allWeight;
            for(var i in rm.warehouse.toolList){
                var tool = rm.warehouse.toolList[i];
                rand -= tool.weight;
                if(rand<=0){
                    var newTool = util.copy(tool);
                    newTool.init();
                    newTool.position = util.copy(position);
                    newTool.extraTime = global.fps * newTool.existTime;
                    return newTool;
                }
            }
        }
    };
    return new RandomBuild();
});