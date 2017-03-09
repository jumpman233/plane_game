/**
 * Created by lzh on 2017/3/9.
 */

define(['warehouse', 'aniImage', 'util', 'text', 'global'], function ( warehouse, AniImage, util, Text, global ) {
    var easyImg = null,
        midImg = null,
        hardImg = null,
        hellImg = null,
        easyText = new Text(),
        midText = new Text(),
        hardText = new Text(),
        hellText = new Text(),
        context = null,
        width = 0,
        height = 0,
        imgWidth = 0,
        imgHeight = 0,
        easing = 0.05,
        isInit = false,
        removed = false,
        removing = false,
        complete = false,
        x1, x2, x3, x4,
        y1, y2, y3, y4;

    var init = function ( ctx ) {
        if(!ctx){
            throw TypeError('HardAnimation init(): param is not right!');
        }

        context = ctx;
        width = context.canvas.width;
        height = context.canvas.height;
        imgWidth = width / 10;
        imgHeight = imgWidth * 2 / 3;

        easyImg = new AniImage(warehouse.getItemByName('easy-cloud').img, imgWidth, imgHeight);
        midImg = new AniImage(warehouse.getItemByName('mid-cloud').img, imgWidth, imgHeight);
        hardImg = new AniImage(warehouse.getItemByName('hard-cloud').img, imgWidth, imgHeight);
        hellImg = new AniImage(warehouse.getItemByName('hell-cloud').img, imgWidth, imgHeight);

        x1 = width / 3 + Math.random() * 50 * util.randomPN();
        y1 = height / 3;
        easyImg.x = x1;

        x2 = width * 8 / 12+ Math.random() * 50 * util.randomPN();
        y2 = height * 4 / 12;
        midImg.x = x2;

        x3 = width * 4 / 12+ Math.random() * 50 * util.randomPN();
        y3 = height * 8 / 12;
        hardImg.x = x3;

        x4 = width * 8 / 12+ Math.random() * 50 * util.randomPN();
        y4 = height * 8 / 12;
        hellImg.x = x4;

        hardImg.y = hellImg.y = height + imgHeight;
        easyImg.y = midImg.y = -imgHeight;
        hardText.y = hellText.y = height + imgHeight + global.optFont / 2;
        easyText.y = midText.y = -imgHeight + global.optFont / 2;

        easyText.text = 'easy';
        easyText.color = '#eee';
        easyText.x = x1;

        midText.text = 'mid';
        midText.color = '#eee';
        midText.x = x2;

        hardText.text = 'hard';
        hardText.color = '#eee';
        hardText.x = x3;

        hellText.text = 'hell';
        hellText.color = '#eee';
        hellText.x = x4;

        isInit = true;
    };

    var easeMoveToTarget = function ( x1, y1, x2, y2 ) {
        return {
            dx: easing * (x2 - x1),
            dy: easing * (y2 - y1)
        }
    };

    var draw = function (  ) {
        var d1 = easeMoveToTarget(easyImg.x, easyImg.y, x1, y1),
            d2 = easeMoveToTarget(midImg.x, midImg.y, x2, y2),
            d3 = easeMoveToTarget(hardImg.x, hardImg.y, x3, y3),
            d4 = easeMoveToTarget(hellImg.x, hellImg.y, x4, y4);

        easyImg.x += d1.dx;
        easyImg.y += d1.dy;
        easyText.x += d1.dx;
        easyText.y += d1.dy;

        midImg.x += d2.dx;
        midImg.y += d2.dy;
        midText.x += d2.dx;
        midText.y += d2.dy;

        hardImg.x += d3.dx;
        hardImg.y += d3.dy;
        hardText.x += d3.dx;
        hardText.y += d3.dy;

        hellImg.x += d4.dx;
        hellImg.y += d4.dy;
        hellText.x += d4.dx;
        hellText.y += d4.dy;

        easyImg.draw(context);
        midImg.draw(context);
        hardImg.draw(context);
        hellImg.draw(context);

        easyText.draw(context);
        midText.draw(context);
        hardText.draw(context);
        hellText.draw(context);
    };

    var remove = function (  ) {

    };

    return {
        init: init,
        draw: draw
    }
});