/**
 * Created by lzh on 2017/3/8.
 */

define(['graph', 'util'], function ( Graph, util ) {
    'use strict';
    function RegularTriangle(  ) {
        Graph.apply(this, arguments);
        this.len = 1;
        this.rv = 0;
    }
    RegularTriangle.prototype = util.copy(Graph.prototype);
    RegularTriangle.prototype.constructor = RegularTriangle;
    RegularTriangle.prototype.draw = function ( ctx ) {
        var tri = this;
        var radius_60 = Math.PI / 3;
        var x1 = - tri.len / 2,
            y1 = tri.len / 2 * Math.tan(radius_60 / 2),
            x2 = tri.len / 2,
            y2 = tri.len / 2 * Math.tan(radius_60 / 2),
            x3 = 0,
            y3 = - (tri.len * Math.sin(radius_60) - y1);
        ctx.save();
        ctx.strokeStyle = tri.color;
        ctx.fillStyle = tri.color;
        ctx.translate(tri.x, tri.y);
        ctx.rotate(tri.rotation);
        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
        ctx.lineTo(x3,y3);
        ctx.lineTo(x1,y1);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        ctx.restore();
    };
    RegularTriangle.prototype.isInBound = function ( ctx ) {
        var tri = this,
            width = ctx.canvas.width,
            height = ctx.canvas.height;
        return tri.x <= width && tri.x >= 0 &&
                tri.y <= height && tri.y + tri.len * 2 >= 0;
    };
    RegularTriangle.prototype.move = function (  ) {
        var tr = this;

        Graph.prototype.move.call(tr);
        tr.rotation += tr.rv;
    };

    return RegularTriangle;
});