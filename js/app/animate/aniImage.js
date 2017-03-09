/**
 * Created by lzh on 2017/3/9.
 */

define(['graph', 'util'], function ( Graph, util ) {
    function AniImage( img, width, height ) {
        Graph.apply(this, arguments);
        this.img = img;
        this.width = width || 20;
        this.height = height || 20;
    }
    AniImage.prototype = util.copy(Graph.prototype);
    AniImage.prototype.constructor = AniImage;
    AniImage.prototype.draw = function ( ctx ) {
        var img = this;

        ctx.save();
        ctx.translate(img.x, img.y);
        ctx.drawImage(img.img, -img.width / 2, -img.height / 2, img.width, img.height);
        ctx.restore();
    };
    AniImage.prototype.isInBound = function ( ctx ) {
        var width = ctx.canvas.width,
            height = ctx.canvas.height,
            img = this;
        return img.x - img.width / 2 >= 0 && img.x + img.width <= width &&
                img.y - img.height / 2 >= 0 && img.y + img.height <= height;
    };
    AniImage.prototype.isInclude = function ( x, y ) {
        var img = this;
        return img.x - img.width / 2 <= x && img.x + img.width / 2 >= x &&
                img.y -img.height / 2 <= y && img.y + img.height / 2 <= y;
    };

    return AniImage;
});