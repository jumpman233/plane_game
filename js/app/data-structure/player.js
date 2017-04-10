/**
 * Created by lzh on 2017/2/28.
 */

define(['gameEventHandler',
    'util'
    ],function (GameEventHandler, util) {
    'use strict';
    function Player() {
        this.plane = null;
        this.maxLife = 0;
        this.curLife = 0;
        this.curSpeed = 0;
        this.score = 0;
        this.aSpeed = 0.1;
        this.speed = 0;
        this.toPos = null;
        this.money = 0;
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
        getCost: function ( str ) {
            var data = this.getData();
            switch (str.toLowerCase()){
                case 'speed':
                    return data.speed * 100;
                case 'damage':
                    return data.damage * 100;
            }
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
                speed: 5,
                damage: 5,
                shootRate: 30,
                bulletSpeed: 5,
                maxLife: 3,
                money: 500
            };
            this.setData(playerData);
            this.updateData();
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
            player.curSpeed = 0;
        },
        setData: function ( data ) {
            localStorage.setItem('playerData', JSON.stringify(data));
        },
        upgrade: function ( str ) {
            var player = this,
                playerData = player.getData(),
                cost = player.getCost(str),
                money = playerData.money;
            if(money < cost)
                return false;

            switch (str){
                case 'speed':
                    playerData.speed += 1;
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

            playerData.money -= cost;
            player.setData(playerData);

            return true;
        },
        init: function ( params ) {
            var defer = $.Deferred(),
                player = this;

            player.geh = GameEventHandler;

            player.plane = params.plane;
            player.plane.position.x = 300;
            player.plane.position.y = 300;
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
                curPos = player.plane.position,
                dis = curPos.calDis(player.toPos),
                ang = 0;

            if(dis <= player.speed){
                curPos.x = player.toPos.x;
                curPos.y = player.toPos.y;
            } else{
                if(player.curSpeed < player.speed){
                    player.curSpeed += player.aSpeed;
                }
                ang = curPos.includeAng(player.toPos);
                curPos.x += Math.sin(util.angToRed(ang)) * player.curSpeed;
                curPos.y -= Math.cos(util.angToRed(ang)) * player.curSpeed;
                debugger;
            }
        },
        draw: function ( ctx ) {
            this.plane.draw(ctx);
            this.move();
        }
    };
    return new Player();
});