/**
 * Created by lzh on 2017/2/28.
 */

define(['gameEventHandler',
    'util',
    'global'
    ],function (GameEventHandler, util, global ) {
    'use strict';
    function Player() {
        this.plane = null;
        this.maxLife = 0;
        this.curLife = 0;
        this.score = 0;
    }
    Player.prototype = {
        getTool: function (tool) {
            var player = this;
            var plane = player.plane;
            switch (tool.name){
                case "upgrade":
                    if(plane.curBullet < plane.bulletStyle.style.length-1){
                        plane.curBullet++;
                    }
                    break;
                case "addLife":
                    if(player.curLife < player.maxLife){
                        player.curLife++;
                    }
                    break;
                default:
                    break;
            }
        },
        init: function ( params ) {

            var player = this;

            player.score = 0;
            player.maxLife = 3;
            player.curLife = player.maxLife;

            player.geh = GameEventHandler;

            player.plane = params.plane;
            player.plane.curBullet = 0;
            player.plane.role = 'player';

            player.geh.mouseMove(function (e) {
                player.plane.position = util.getEventPosition(e);
            });
            // player.geh.keydown(function ( e ) {
            //     if(e.keyCode == 27 && player.playing){
            //         if(!player.pause){
            //             player.pause = true;
            //             player.pauseMenu();
            //         } else{
            //             player.resume();
            //             player.removeAllOptions();
            //         }
            //     }
            // });
        }
    };
    return new Player();
});