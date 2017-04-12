/**
 * Created by lzh on 2017/2/28.
 */

define(['util',
'player',
'randomBuild'],function ( util, player, rm ) {
    function DataManager(  ) {
        this.enemy_bullets = [];
        this.player_bullets = [];
        this.tools = [];
        this.player = null;
        this.enemies = [];
        this.missiles = [];
    }

    DataManager.prototype = {
        constructor: DataManager,
        resolveBullet: function ( bullet ) {
            var manager = this;
            if(!bullet || !bullet.parent){
                throw TypeError('DataManager resolveBullet: param type error!')
            }
            if(bullet.parent.role == 'player'){
                manager.player_bullets.push(bullet);
            } else{
                manager.enemy_bullets.push(bullet);
            }
        },
        reset: function (  ) {
            this.enemy_bullets = [];
            this.player_bullets = [];
            this.tools = [];
            this.enemies = [];
            this.missiles = [];
        },
        resolveEnemy: function ( enemy ) {
            var manager = this;

            if(!(enemy.className === 'Enemy') && !Array.isArray(enemy)){
                throw TypeError('DataManager resolveEnemy: param type error!');
            }

            if(enemy.className === 'Enemy'){
                manager.enemies.push(enemy);
            } else{
                for(var i in enemy){
                    this.resolveEnemy(enemy[i]);
                }
            }
        },
        resolveTool: function ( tool ) {
            this.tools.push(tool);
        },
        resolveMissile: function ( missile ) {
            this.missiles.push(missile);
        },
        judge: function ( planeDead, gameOver ) {
            var dm = this;
            var tools = dm.tools;

            //check if player has collision with tools
            for(var i in tools){
                var tool = tools[i];
                if(util.collisionTest(player.plane,tool)){
                    player.getTool(tool);
                    tools.splice(i,1);
                }
            }


            /**
             * TODO
             */
            // for(var i in dm.enemies){
            //     var plane = dm.enemies[i];
            //     if(plane && util.collisionTest(plane, player.plane)){
            //         dm.enemies.splice(i,1);
            //         player.curLife--;
            //     }
            // }

            //check if enemies' bullets have collision with player's plane
            for(var i in dm.enemy_bullets){
                if(util.collisionTest(player.plane,dm.enemy_bullets[i])){
                    dm.enemy_bullets.splice(i,1);
                    player.curLife--;
                }
            }
            for(var i in dm.missiles){
                if(util.collisionTest(player.plane,dm.missiles[i])){
                    dm.missiles.splice(i,1);
                    player.curLife--;
                }
            }
            if(player.curLife <= 0 && !player.isDying){
                player.die();
            } else if(player.curLife <= 0 && player.isDead){
                gameOver();
            }

            dm.dirtyCheck();
        },
        dirtyCheck: function (  ) {
            var dm = this;
            util.dirtyCheck(dm.enemy_bullets);
            util.dirtyCheck(dm.player_bullets);
            util.dirtyCheck(dm.tools);
            util.dirtyCheck(dm.missiles);
            dm.enemyDeadCheck();
        },
        enemyDeadCheck: function () {
            var dm = this,
                list = dm.enemies,
                tool;
            for(var i in list){
                var enemy = list[i];
                if(enemy.isDead){
                    list.splice(i,1);
                    if(util.isInCanvas(enemy.plane)){
                        player.score += enemy.score;
                        tool = rm.createTool(enemy.toolDrop, enemy.plane.position);
                        if(tool !== undefined){
                            dm.resolveTool(tool);
                        }
                    }
                }
            }
        }
    };

    return new DataManager();
});