/**
 * Created by lzh on 2017/2/28.
 */

define(['gameEventHandler',
    'util',
    'ball',
    'global'],function (GameEventHandler, util, Ball, global) {
    'use strict';
    function Player() {
        this.plane = null;
        this.maxLife = 0;
        this.curLife = 0;
        this.score = 0;
        this.speed = 0;
        this.toPos = null;
        this.money = 0;

        this.isDead = false;
        this.isDying = false;
        this.dieFrame = 0;
        this.explodeBall = new Ball;
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
            var playerData = localStorage.getItem('playerData');

            if(!playerData){
                this.resetData();
                playerData = localStorage.getItem('playerData');
            }

            return JSON.parse(playerData);
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
                speed: 7,
                damage: 5,
                shootRate: 30,
                bulletSpeed: 5,
                maxLife: 1,
                money: 500
            };
            this.setData(playerData);
            this.updateData();
        },
        ready: function (  ) {
            var player = this;

            player.updateData();
            player.addEvent();
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
            player.plane.curBullet = 0;
            player.plane.position.x = global.width / 2;
            player.plane.position.y = global.height / 2;

            player.isDead = false;
            player.isDying = false;
            player.explodeBall = new Ball;
            player.dieFrame = 0;
        },
        setData: function ( ) {
            if(arguments.length === 1 && typeof arguments[0] === 'object'){
                localStorage.setItem('playerData', JSON.stringify(arguments[0]));
            } else if(arguments.length === 2 && typeof arguments[0] === 'string' && typeof arguments[1] === 'number'){
                var data = this.getData();
                data[arguments[0]] = arguments[1];
                this.setData(data);
            } else{
                throw TypeError('player setData: params are not right!');
            }
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
            player.updateData();

            defer.resolve();
        },
        addEvent: function (  ) {
            var player = this;

            player.geh.mouseMove(function (e) {
                player.toPos = util.getEventPosition(e);
            });
            player.geh.keydown(function ( e ) {
                if(e.code === 'F2'){
                    player.resetData();
                }
            });
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
                dis,
                ang = 0;
            if(player.toPos){
                dis = curPos.calDis(player.toPos)
            } else {
                return;
            }
            if(dis <= player.speed){
                curPos.x = player.toPos.x;
                curPos.y = player.toPos.y;
            } else{
                ang = curPos.includeAng(player.toPos);
                curPos.x += Math.sin(util.angToRed(ang)) * player.speed;
                curPos.y -= Math.cos(util.angToRed(ang)) * player.speed;
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
                flag1 = player.drawExplosion(ctx);
                // if(!player.isFade){
                //     util.fadeTo(255, 255, 255, 1)
                //         .then(function (  ) {
                //             player.fadeFinish = true;
                //         });
                //     player.isFade = true;
                // }
                player.plane.draw(ctx);
            }
            if(flag1) {
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
            player.explodeBall.color = util.resolveColor(240, 240, 240, 1);
            player.explodeBall.x = pos.x;
            player.explodeBall.y = pos.y;
            if(player.dieFrame <= maxWidth){
                player.explodeBall.radius += 0.5;
            } else if(player.explodeBall.radius > 0 && player.dieFrame <= maxWidth * 2) {
                player.explodeBall.radius -= 0.5;
            } else{
                player.explodeBall.radius += 10;
            }
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
                ctx.fillStyle = util.resolveColor(200, 200, 200, 0.7);
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
            }
            player.explodeBall.draw(ctx);
            return player.explodeBall.radius >= width;
        }
    };
    return new Player();
});