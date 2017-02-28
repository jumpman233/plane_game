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
        this.isInit = false;
    }
    Item.prototype = {
        loadImg: function () {
            var obj = this;
            obj.img = util.initImage({
                width: obj.width,
                height: obj.height,
                src: obj.src,
                onload: function () {
                    obj.isInit = true;
                }
            });
        }
    };
    return Item;
});