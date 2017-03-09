/**
 * Created by lzh on 2017/3/9.
 */

define(['util', 'ball'], function ( util, Ball ) {
    var balls = [],
        perCreate = 1,
        perLen = 0,
        baseLen = 0,
        context = null,
        width = 0,
        height = 0,
        frameNum = 0,
        baseColor = 100;

    var createBalls = function (  ) {
        for(var i = 0; i < perCreate; i++){
            var ball = new Ball();
            var randomColor = Math.floor(baseColor + Math.random() * 64);
            ball.color = util.resolveColor(randomColor, randomColor, randomColor, Math.floor((Math.random()*0.5 + 0.5)*10) / 10);
            ball.radius = baseLen + Math.random() * baseLen;
            ball.x = perLen * i + Math.random() * perLen;
            ball.y = - baseLen * 2;
            ball.vy = (Math.random() + 1);
            balls.push(ball);
        }
    };

    var init = function ( ctx ) {
        if(!ctx) {
            throw TypeError('BallBkAnimate init(): param is not right!');
        }

        context = ctx;
        width = ctx.canvas.width;
        height = ctx.canvas.height;
        baseLen = Math.ceil(width / perCreate / 100);
        perLen = width / perCreate;
    };

    var draw = function (  ) {
        if(frameNum++ %  10 == 0){
            createBalls();
        }
        for(var i in balls){
            var ball = balls[i];
            ball.draw(context);
            ball.move();
        }

        for(var i in balls){
            if(!ball.isInBound(context) && ball.y > height){
                balls.splice(i, 1);
            }
        }
    };

    return {
        init: init,
        draw: draw
    }

});