/**
 * Created by lzh on 2017/3/8.
 */

define(['regularTriangle', 'util'], function ( Triangle, util ) {
    var shapeList = [],
        max_speed = 10,
        speed = 1,
        width = 0,
        height = 0,
        max_x_l = 0,
        max_x_r = 0,
        max_x_w = 0,
        base_len = 50,
        frameNum = 0,
        createCd = 0,
        isInit = false,
        finishInit = false,
        baseColor = 70,
        removing = false,
        removed = false;

    var createTr = function ( baseX ) {
        var tr = new Triangle();
        var randomColor = Math.floor(baseColor + Math.random() * 128);
        tr.len = Math.random() * 30 + base_len;
        tr.color = util.resolveColor(randomColor, randomColor, randomColor, Math.floor((Math.random()*0.5 + 0.5)*10) / 10);
        tr.rotation = Math.random() * Math.PI * 2;
        tr.x = Math.random() * max_x_w + baseX;
        tr.y = height + tr.len;
        tr.rv = Math.random() * 3 / 180 * Math.PI *
            (Math.random() < 0.5 ? 1 : -1);
        tr.vy = -speed;
        return tr;
    };

    var reset = function (  ) {
        isInit = false;
        finishInit = false;
        removing = false;
        removed = false;
        shapeList = [];
    };

    var draw = function ( ctx ) {
        frameNum++;
        //the origin state
        if(shapeList.length == 0 && !isInit){
            speed = max_speed;
            width = ctx.canvas.width;
            height = ctx.canvas.height;
            max_x_l = 0;
            max_x_r = width / 5 * 3.5;
            max_x_w = width / 5 * 1.5;
            shapeList.push(createTr(max_x_l));
            shapeList.push(createTr(max_x_r));
            createCd = base_len / speed;
            isInit = true;
        }
        if(createCd-- <= 0 && !removing){
            shapeList.push(createTr(max_x_l));
            shapeList.push(createTr(max_x_r));
            createCd = base_len / speed;
        }

        for(var i in shapeList){
            var shape = shapeList[i];
            shape.draw(ctx);
            shape.vy = -speed;
            shape.move();
            if(!shape.isInBound(ctx) && shape.y < height){
                shapeList.splice(i, 1);
                if(!finishInit){
                    speed = 1;
                    finishInit = true;
                }
            }
        }
        if(shapeList.length == 0 && isInit){
            removed = true;
        }
    };

    return {
        draw: draw,
        remove: function (  ) {
            removing = true;
            speed = max_speed;
        },
        isRemoved: function (  ) {
            return removed;
        },
        reset: reset
    };
});