/**
 * Created by lzh on 2017/4/10.
 */

define(['global', 'ball', 'util'], function ( global, Ball, util ) {
    var width,
        ballBaseR,
        ballMaxR,
        balls = [],
        init = false;

    var draw = function ( ctx ) {
        if(!init){
            reset();
            init = true;
        }
        if(Math.random() < 0.0005) {
            var newBall = new Ball;
            newBall.radius = Math.random() * ballMaxR + ballBaseR;
            newBall.light = true;
            newBall.color = util.resolveColor(0, 255, 255, 1);
            newBall.x = Math.random() * (width - newBall.radius / 2) + newBall.radius / 2;
            newBall.y = -newBall.radius;
            newBall.vy = 0.05;
            balls.push(newBall);
        }

        balls.forEach(function ( item ) {
            item.draw(ctx);
            item.move();
        });
    };

    var reset = function (  ) {
        width = global.width;
        balls = [];
        ballBaseR = width / 100;
        ballMaxR = width / 150;
    };

    return {
        reset: reset,
        draw: draw
    };
});