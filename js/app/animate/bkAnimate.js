/**
 * Created by lzh on 2017/3/8.
 */

define(['regularTriangle', 'util'], function ( Triangle, util ) {
    var shapeList = [],
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
        baseColor = 70;

    var createTr = function ( baseX ) {
        var tr = new Triangle();
        var randomColor = Math.floor(baseColor + Math.random() * 128);
        tr.len = Math.random() * 30 + base_len;
        tr.color = util.resolveColor(randomColor, randomColor, randomColor);
        // tr.color = 'rgba(255,255,1,1)';
        tr.rotation = Math.random() * Math.PI * 2;
        tr.x = Math.random() * max_x_w + baseX;
        tr.y = height + tr.len;
        tr.rv = Math.random() * 3 / 180 * Math.PI *
            (Math.random() < 0.5 ? 1 : -1);
        tr.vy = -speed;
        return tr;
    };

    var draw = function ( ctx ) {
        frameNum++;
        //the origin state
        if(shapeList.length == 0 && !isInit){
            speed = 5;
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
        if(createCd-- <= 0){
            shapeList.push(createTr(max_x_l));
            shapeList.push(createTr(max_x_r));
            createCd = base_len / speed;
        }

        ctx.clearRect(0, 0, width, height);

        for(var i in shapeList){
            var shape = shapeList[i];
            shape.draw(ctx);
            shape.vy = -speed;
            shape.move();
            if(!shape.isInBound(ctx) && shape.y < height){
                shapeList.splice(i, 1);
                speed = 1;
                finishInit = true;
            }
        }
        return finishInit;
    };

    return draw;
});