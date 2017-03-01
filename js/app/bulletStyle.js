/**
 * Created by lzh on 2017/2/28.
 */

define(['util'], function ( util ) {
    'use strict';
    function BulletStyle(params){
        if(!params) return;

        if(params.type){
            this.type = params.type;
        }
        if(params.style){
            this.style = params.style;
        }
        if (params.audioSrc){
            this.audioSrc = params.audioSrc;
            this.audio = util.initAudio({
                src: this.audioSrc
            });
        }
    }
    BulletStyle.prototype = {
        constructor: BulletStyle,
        getBullets: function (index) {
            var style = this.style[index];
            var list = [];
            for(var i in style){
                list.push(util.copy(style[i].bullet));
            }
            return list;
        }
    };
    return BulletStyle;
});