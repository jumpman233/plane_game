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
        if (params.audioName){
            this.audioName = params.audioName;
        }
        this.audio = null;
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
        },
        clone: function (  ) {
            var newStyle = new BulletStyle(),
                oldStyle = this;

            for(var i in oldStyle){
                if(oldStyle[i] && oldStyle[i].clone){
                    newStyle[i] = oldStyle[i].clone();
                } else{
                    newStyle[i] = oldStyle[i];
                }
            }

            return newStyle;
        }
    };
    return BulletStyle;
});