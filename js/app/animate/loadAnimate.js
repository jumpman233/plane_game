/**
 * Created by lzh on 2017/3/8.
 */

define(['ball', 'text'],function ( Ball , Text) {
    'use strict';
    var b1 = new Ball();
    var b2 = new Ball();
    var text = new Text();
    text.text = 'Loading';
    b1.radius = 10;
    b1.x = 0;
    b1.y = 0;
    b2.radius = 10;
    b2.x = b1.x;
    b2.y = b1.y;

    var pointNum = 1,
        frame = 0,
        angle = 0,
        x = 0,
        y = 0,
        removed = false;

    //for remove function
    b1.vy = - (Math.random() * 10 + 5);
    b2.vy = - (Math.random() * 10 + 5);
    b1.vx = Math.random() * 10 * (Math.random() < 0.5? -1 : 1);
    b2.vx = Math.random() * 10 * (Math.random() < 0.5? -1 : 1);
    b1.ay = Math.random() + 1;
    b2.ay = Math.random() + 1;
    text.vx = Math.random() * 5 + 5 * (Math.random() < 0.5? -1 : 1);
    text.vy = - (Math.random() * 10 + 5);
    text.ay = Math.random() + 1;

    var drawLoading = function ( context ) {
        x = context.canvas.width / 2;
        y = context.canvas.height / 2;
        text.x = context.canvas.width / 2;
        text.y = context.canvas.height / 2 + 60;
        frame++;

        b1.x = x + Math.sin(angle) * 40;
        b2.x = x - Math.sin(angle) * 40;
        b1.y = b2.y = y;

        b1.radius = 10 + Math.cos(angle) * 3;
        b2.radius = 10 - Math.cos(angle) * 3;

        for(var i = 0; i < pointNum; i++){
            text.text += '.';
        }

        context.clearRect(0,0, x*2, y*2);
        b1.draw(context);
        b2.draw(context);
        text.draw(context);

        text.text = 'Loading';

        if(frame%20==0){
            pointNum++;
            if(pointNum % 3 == 0){
                pointNum = 0;
            }
        }
        angle += 0.1;
    };

    var removeLoading = function ( context ) {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        text.draw(context);
        b1.draw(context);
        b2.draw(context);
        text.move();
        b1.move();
        b2.move();
        if(!text.isInBound(context) && !b1.isInBound(context) && !b2.isInBound(context)){
            removed = true;
        }
    };

    return {
        draw: drawLoading,
        remove: removeLoading,
        isRemoved: function (  ) {
            return removed;
        }
    };
});