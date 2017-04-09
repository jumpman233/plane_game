/**
 * Created by lzh on 2017/2/28.
 */

define(['gameEventHandler',
    'util',
    ],function (GameEventHandler, util) {
    'use strict';
    function Player() {
        this.plane = null;
        this.maxLife = 0;
        this.curLife = 0;
        this.score = 0;
        this.speed = 0;
        this.toPos = null;
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
            var defer = $.Deferred(),
                player = this,
                playerData = "1" || JSON.parse(localStorage.getItem('playerData'));
            if(playerData){
                playerData = {
                    speed: 0.05,
                    damage: 5,
                    shootRate: 30,
                    bulletSpeed: 5,
                    maxLife: 3
                };
                localStorage.setItem("playerData", JSON.stringify(playerData));
            }

            player.score = 0;
            player.maxLife = playerData.maxLife;
            player.curLife = player.maxLife;

            player.geh = GameEventHandler;

            player.plane = params.plane;
            player.plane.shootRate = playerData.shootRate;
            player.plane.damage = playerData.damage;
            player.speed = playerData.speed;
            player.plane.curBullet = 0;
            player.plane.role = 'player';

            player.geh.mouseMove(function (e) {
                player.toPos = util.getEventPosition(e);
            });
            defer.resolve();
        },
        shoot: function (  ) {
            if(this.plane && typeof this.plane.shoot){
                this.plane.shoot();
            } else{
                throw TypeError();
            }
        },
        move: function (  ) {
            var player = this,
                curPos = player.plane.position;

            curPos.x += player.speed * (player.toPos.x - curPos.x);
            curPos.y += player.speed * (player.toPos.y - curPos.y);
        },
        draw: function ( ctx ) {
            this.plane.draw(ctx);
            this.move();
        }
    };
    return new Player();
});