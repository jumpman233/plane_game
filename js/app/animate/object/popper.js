/**
 * Created by lzh on 2017/4/10.
 */

define(['position'], function ( Position ) {
    'use strict';
    function Popper( x, y, text ) {
        this.position = new Position(x, y);
        this.text = text;
        this.fontSize = 16;
        this.fontFamily = 'Tahoma Arial';
        this.textAlign = 'center';
        this.fontColor = '#ddd';
        this.rectColor = '#222';
        this.display = false;
    }
    Popper.prototype = {
        constructor: Popper,
        getFont: function (  ) {
            return this.fontSize + 'px' + ' ' + this.fontFamily;
        },
        draw: function ( ctx ) {
            var popper = this;

            ctx.save();
            ctx.fillStyle = popper.rectColor;
            ctx.translate(popper.position.x, popper.position.y)
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(5,-5);
            ctx.lineTo(60,-5);
            ctx.lineTo(60,-40);
            ctx.lineTo(-60,-40);
            ctx.lineTo(-60, -5);
            ctx.lineTo(-5,-5);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
            ctx.save();
            ctx.font = popper.getFont();
            ctx.fillStyle = popper.fontColor;
            ctx.textAlign = popper.textAlign;
            ctx.fillText(popper.text, popper.position.x, popper.position.y - 18);
            ctx.restore();
        }
    };
    return Popper;
});