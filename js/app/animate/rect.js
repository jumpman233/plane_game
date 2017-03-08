/**
 * Created by lzh on 2017/3/8.
 */

define([], function (  ) {
    function Rect(  ) {
        this.x = 0;
        this.y = 0;
        this.width = 10;
        this.height = 10;
        this.fillColor = '#fff';
        this.strokeColor = '#000';
    }
    Rect.prototype = {
        constructor: Rect,
        draw: function ( ctx ) {
            var rect = this;
            ctx.save();
            ctx.translate(rect.x, rect.y);
            ctx.fillStyle = rect.fillColor;
            ctx.strokeStyle = rect.strokeColor;
            ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
            ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
            ctx.restore();
        },
        isInBound: function ( ctx ) {

        }
    };

    return Rect;
});