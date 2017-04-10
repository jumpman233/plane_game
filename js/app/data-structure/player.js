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
        saveLocal: function (  ) {
            var player = this;
            localStorage.setItem("playerData", JSON.stringify({
                speed: player.speed,
                damage: player.da
            }));
        },
        getData: function (  ) {
            var playerData;

            if(localStorage.getItem('playerData')){
                playerData = JSON.parse(localStorage.getItem('playerData'));
            } else{
                this.resetData();
            }

            return playerData;
        },
        resetData: function (  ) {
            var playerData = {
                speed: 0.02,
                damage: 5,
                shootRate: 30,
                bulletSpeed: 5,
                maxLife: 3
            };
            this.setData(playerData);
        },
        updateData: function (  ) {
            var player = this,
                playerData = player.getData();

            player.score = 0;
            player.maxLife = playerData.maxLife;
            player.curLife = player.maxLife;
            player.plane.shootRate = playerData.shootRate;
            player.plane.damage = playerData.damage;
            player.speed = playerData.speed;
        },
        setData: function ( data ) {
            localStorage.setItem('playerData', JSON.stringify(data));
        },
        upgrade: function ( str ) {
            var player = this,
                playerData = player.getData();

            switch (str){
                case 'speed':
                    playerData.speed += 0.01;
                    break;
                case 'damage':
                    playerData.damage += 1;
                    break;
                case 'shootRate':
                    playerData.shootRate += 5;
                    break;
                case 'maxLife':
                    playerData.maxLife += 1;
                    break;
            }

            player.setData(playerData);
        },
        init: function ( params ) {
            var defer = $.Deferred(),
                player = this;

            player.geh = GameEventHandler;

            player.plane = params.plane;
            player.plane.curBullet = 0;
            player.plane.role = 'player';
            player.updateData();

            player.geh.mouseMove(function (e) {
                player.toPos = util.getEventPosition(e);
            });
            player.geh.keydown(function ( e ) {
                if(e.code === 'F2'){
                    player.resetData();
                }
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