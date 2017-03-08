/**
 * Created by lzh on 2017/3/8.
 */

define(['graph', 'util'], function ( Graph, util ) {
    function Ball(  ) {
        Graph.apply(this, arguments);
        this.radius = 5;
    }
    Ball.prototype = util.copy(Graph.prototype);
    Ball.prototype.constructor = Ball;
    Ball.prototype.draw= function ( ctx ) {
            var ball = this;
            ctx.save();
            ctx.translate(ball.x, ball.y);
            ctx.fillStyle = ball.color;
            ctx.beginPath();
            ctx.arc(0,0, ball.radius, 0, Math.PI*2);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
    };
    Ball.prototype.isInBound= function ( ctx ) {
        var width = ctx.canvas.width,
            height = ctx.canvas.height,
            ball = this,
            x = ball.x,
            y = ball.y;
        return x + ball.radius / 2 <= width && x - ball.radius / 2 >= 0&& y + ball.radius <= height && y - ball.radius >= 0;
    };

    return Ball;
});