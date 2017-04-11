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
        this.isDead = false;
        this.isDying = false;
        this.dieFrame = 0;
        this.isFade = false;
        this.fadeFinish = false;
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
        die: function (  ) {
            var defer = $.Deferred(),
                player = this;
            if(player.curLife > 0){
                throw TypeError('player die(): player is not die!');
            }
            player.geh.removeAllEvents();
            player.isDying = true;

            return defer;
        },
        resetData: function (  ) {
            var playerData = {
                speed: 5,
                damage: 5,
                shootRate: 30,
                bulletSpeed: 5,
                maxLife: 1,
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
            }
        },
        draw: function ( ctx ) {
            var player = this,
                flag1;

            if(!player.isDying){
                player.plane.draw(ctx);
                player.shoot();
                player.move();
            } else{
                player.plane.draw(ctx);
                flag1 = player.drawExplosion(ctx);
                if(!player.isFade){
                    util.fadeTo(255, 255, 255, 5)
                        .then(function (  ) {
                            player.fadeFinish = true;
                        });
                    player.isFade = true;
                }
            }
            if(flag1 && player.fadeFinish) {
                player.isDead = true;
            }
        },
        drawExplosion: function ( ctx) {
            var width = ctx.canvas.width,
                height = ctx.canvas.height,
                player = this,
                pos = util.copy(this.plane.position),
                maxWidth = 40,
                x1, x2, x3, x4, x5, x6, y1, y2, y3, y4, y5, y6;
            player.dieFrame++;
            if(player.dieFrame >= maxWidth){
                x1 = maxWidth;
                x2 = -maxWidth;
            } else{
                x1 = player.dieFrame;
                x2 = -player.dieFrame;
            }
            y1 = y2 = -10 - pos.y;

            if(player.dieFrame >= maxWidth * 2){
                y3 = 200 + maxWidth;
                y4 = 200 - maxWidth;
            } else{
                y3 = 200 + (player.dieFrame - maxWidth);
                y4 = 200 - (player.dieFrame - maxWidth);
            }
            x3 = x4 = 20 + width - pos.x;

            if(player.dieFrame >= maxWidth * 3){
                y5 = 400 + maxWidth;
                y6 = 400 - maxWidth;
            } else{
                y5 = 400 + (player.dieFrame - maxWidth * 2);
                y6 = 400 - (player.dieFrame - maxWidth * 2);
            }
            x5 = x6 = -20 - pos.x;
            var drawOne = function ( x_1, x_2, y_1, y_2 ) {
                ctx.save();
                ctx.translate(pos.x, pos.y);
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(x_1, y_1);
                ctx.lineTo(x_2, y_2);
                ctx.closePath();
                ctx.fillStyle = util.resolveColor(0, 0, 0, 0.7);
                ctx.fill();
                ctx.restore();
            };

            if(player.dieFrame <= maxWidth){
                drawOne(x1, x2, y1, y2);
            } else if(player.dieFrame <= maxWidth * 2){
                drawOne(x1, x2, y1, y2);
                drawOne(x3, x4, y3, y4);
            } else if(player.dieFrame <= maxWidth * 3){
                drawOne(x1, x2, y1, y2);
                drawOne(x3, x4, y3, y4);
                drawOne(x5, x6, y5, y6);
            } else{
                drawOne(x1, x2, y1, y2);
                drawOne(x3, x4, y3, y4);
                drawOne(x5, x6, y5, y6);
                return true;
            }

            return false;
        }
    };
    return new Player();
});