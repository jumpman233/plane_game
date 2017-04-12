/**
 * Created by lzh on 2017/3/8.
 */

define(['graph', 'util'], function ( Graph, util ) {
    'use strict';
    function Text( text ) {
        if(text && typeof text !== 'string'){
            throw TypeError('Text constructor: param \'text\' is not String!');
        }
        Graph.apply(this, arguments);

        this.fontSize = '20';
        this.fontFamily = 'Tahoma Arial';
        this.textAlign = 'center';
        this.color = '#444';
        this.text = text || '';
        this.scale = 1;
    }

    Text.prototype = util.copy(Graph.prototype);
    Text.prototype.constructor = Text;
    Text.prototype.getFont = function (  ) {
        return this.fontSize + 'px' + ' ' + this.fontFamily;
    };
    Text.prototype.draw = function ( context ) {
        var text = this;
        context.save();
        context.fillStyle = text.color;
        context.textAlign = text.textAlign;
        context.translate(text.x, text.y);
        context.scale(text.scale, text.scale);
        context.font = text.getFont();
        context.fillText(text.text, 0, 0);
        context.restore();
    };
    Text.prototype.isInBound = function ( context ) {
        var width = context.canvas.width,
            height = context.canvas.height,
            text = this;
        return text.x <= width && text.x >= 0 && text.y >= 0 && text.y <= height;
    };

    return Text;
});