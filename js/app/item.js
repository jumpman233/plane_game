/**
 * Created by lzh on 2017/2/28.
 */

define(['util'], function ( util ) {
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
        }
    };
    return Item;
});