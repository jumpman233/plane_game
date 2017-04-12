/**
 * Created by lzh on 2017/2/28.
 */

define(['util'], function ( util ) {
    'use strict';
    /**
     * class Item
     * static image
     * @param params
     * @constructor
     */
    function Item(params) {
        if(!params) return;

        if(params.width){
            this.width = params.width;
        }
        if(params.height){
            this.height = params.height;
        }
        if(params.src){
            this.src = params.src;
        }
        if(params.name){
            this.name = params.name;
        }
        this.img = null;
    }
    Item.prototype = {
        loadImg: function () {
            var item = this;
            item.img = util.initImage({
                width: item.width,
                height: item.height,
                src: item.src
            });
        },
        clone: function (  ) {
            var newItem = new Item(),
                oldItem = this;

            for(var i in oldItem){
                if(oldItem[i] && oldItem[i].clone){
                    newItem[i] = oldItem[i].clone();
                } else {
                    newItem[i] = oldItem[i];
                }
            }

            return newItem;
        }
    };
    return Item;
});