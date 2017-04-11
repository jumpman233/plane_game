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
        baseColor = 100,
        baseSpeed = 1,
        removing = false,
        removed = false;

    var createBalls = function (  ) {
        for(var i = 0; i < perCreate; i++){
            var ball = new Ball();
            var randomColor = Math.floor(baseColor + Math.random() * 64);
            ball.color = util.resolveColor(randomColor, randomColor, randomColor, Math.floor((Math.random()*0.5 + 0.5)*10) / 10);
            ball.radius = baseLen + Math.random() * baseLen;
            ball.x = perLen * i + Math.random() * perLen;
            ball.y = - baseLen * 2;
            ball.vy = (Math.random() + baseSpeed);
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
        if(frameNum++ %  10 == 0 && !removing && !removed){
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
        if(balls.length == 0 && removing){
            removed = true;
        }
    };

    var remove = function (  ) {
        removing = true;
        baseSpeed = 3;
        for(var i in balls){
            balls[i].vy = baseSpeed * 2 + Math.random() * 2;
        }
    };

    return {
        init: init,
        draw: draw,
        remove: remove,
        isRemoved: function (  ) {
            return removed;
        }
    }

});