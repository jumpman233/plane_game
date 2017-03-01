/**
 * Created by lzh on 2017/2/28.
 */

define(['util',
'player'],function ( util, player ) {
    function DataManager(  ) {
        this.enemy_bullets = [];
        this.player_bullets = [];
        this.tools = [];
        this.player = null;
        this.enemy_planes = [];
        this.missiles = [];
    }

    DataManager.prototype = {
        constructor: DataManager,
        resolveBullet: function ( bullet ) {
            var manager = this;
            if(!bullet || !bullet.parent || !bullet.parent.role){
                throw Error('DataManager resolveBullet: param type error!')
            }
            if(bullet.parent.role == 'player'){
                manager.player_bullets.push(bullet);
            } else if(bullet.parent.role == 'enemy'){
                manager.enemy_bullets.push(bullet);
            }
        },
        resolvePlane: function ( plane ) {
            var manager = this;
            if(!plane || !plane.role){
                throw Error('DataManager resolveBullet: param type error!')
            }
            if(plane.role == 'player'){
                manager.player_planes.push(plane);
            } else if(plane.role == 'enemy'){
                manager.enemy_planes.push(plane);
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

            //check if player's bullets have collision with enemies
            //if true, it's possible to appear a tool
            //check if enemies have collision with player's plane
            //if true, player's life will be reduced

            for(var i in dm.enemy_planes){
                var plane = dm.enemy_planes[i];
                for (var j in dm.player_bullets){
                    var bullet = dm.player_bullets[j];
                    if(util.collisionTest(plane,bullet)){
                        plane.getShot(bullet);
                        if(plane.isDead){
                            // var newTool = game.createTool(plane,game.fps);
                            // if(newTool){
                            //     toolList.push(newTool);
                            // }
                            // player.score += plane.score;
                            planeDead(plane);
                        }
                        dm.player_bullets.splice(j,1);
                        break;
                    }
                }
                if(plane && util.collisionTest(plane,player.plane)){
                    dm.enemy_planes.splice(i,1);
                    player.curLife--;
                }
            }
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
            if(player.curLife == 0){
                gameOver();
            }

            dm.dirtyCheck();
            dm.planeListCheck(dm.enemy_planes);
        },
        dirtyCheck: function (  ) {
            var dm = this;
            util.dirtyCheck(dm.enemy_bullets);
            util.dirtyCheck(dm.enemy_planes);
            util.dirtyCheck(dm.player_bullets);
            util.dirtyCheck(dm.tools);
            util.dirtyCheck(dm.missiles);
        },
        planeListCheck: function (list) {
            for(var i in list){
                var plane = list[i];
                if(plane.canDestroy){
                    list.splice(i,1);
                }
            }
        }
    };

    return new DataManager();
});