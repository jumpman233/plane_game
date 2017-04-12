/**
 * Created by lzh on 2017/3/8.
 */

define([], function (  ) {
    'use strict';
    var virtualFuntion = function (  ) {
        throw TypeError('you are using a virtual function!')
    };
    function Graph(  ) {
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.ax = 0;
        this.ay = 0;
        this.loss = 0;
        this.f = 0;
        this.color = '#333';
        this.rotation = 0;
    }
    Graph.prototype = {
        constructor : Graph,
        draw: virtualFuntion,
        move: function (  ) {
            var graph = this;
            graph.vx += graph.ax;
            graph.vy += graph.ay;

            graph.x += graph.vx;
            graph.y += graph.vy;
        },
        isInBound: virtualFuntion
    };

    return Graph;

});