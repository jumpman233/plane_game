/**
 * Created by lzh on 2017/4/10.
 */

define(['global', 'ball', 'util'], function ( global, Ball, util ) {
    'use strict';
    var width,
        height,
        stars = [],
        baseR = 15,
        randomR = 15,
        vy = 1,
        isInit = false,
        possibility = 0.01;

    var Star = function (  ) {
        this.x = 0;
        this.y = 0;
        this.vy = 0;
        this.radius = 0;
        this.scale = 0;
    };
    
    Star.prototype = {
        constructor: Star,
        draw: function ( ctx ) {
            var star = this;
            ctx.save();
            ctx.translate(star.x, star.y);
            ctx.beginPath();
            ctx.scale(star.scale,star.scale);
            if(star.scale <= 1){
                star.scale += 0.1;
            }
            ctx.arc(0, 0, star.radius, 0, Math.PI *2);
            ctx.closePath();
            var gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, star.radius);
            gradient.addColorStop(0, 'rgba(255,255,255,1)');
            gradient.addColorStop(.1, 'rgba(255,255,255,1)');
            gradient.addColorStop(.2, 'rgba(255,255,255,.5)');
            gradient.addColorStop(.6, 'rgba(255,255,255,0)');
            gradient.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = gradient;
            ctx.fill();
            ctx.restore();
        },
        move: function (  ) {
            this.y += this.vy;
        }
    };

    var randomStar = function ( possibility ) {
        if(Math.random() <= possibility){
            var star = new Star(),
                flag = true;
            star.radius = baseR + Math.random() * randomR;
            star.x = Math.random() * (width - star.radius) + star.radius / 2;
            star.y = Math.random() * (height - star.radius) + star.radius / 2;
            star.vy = vy;
            for(var i = 0; i < stars.length; i++){
                if(Math.abs(stars[i].x - star.x) <= 50 ||
                Math.abs(stars[i].y - star.y) <= 50){
                    flag = false;
                    break;
                }
            }
            if(flag){
                stars.push(star);
            }
        }
    };

    var dirtyCheck = function (  ) {
        for(var i = 0; i < stars.length; i++){
            if(stars[i].y - stars[i].radius / 2 >= height){
                stars.splice(i, 1);
            }
        }
    };

    var init = function (  ) {
        width = global.width;
        height = global.height;
        stars = [];
        isInit = true;
    };

    var draw = function ( ctx ) {
        if(!isInit) init();

        randomStar(possibility);
        stars.forEach(function ( star ) {
            star.draw(ctx);
            star.move();
        });

        dirtyCheck();
    };

    var reset = function (  ) {
        stars = [];
    };

    return {
        init: init,
        reset: reset,
        draw: draw
    };
});