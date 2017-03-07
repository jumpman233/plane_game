/**
 * Created by lzh on 2017/3/1.
 */

define([],function () {
    function Global(  ) {
        this.notLoadedImgCount = 0;
        this.notLoadedAudioCount = 0;
        this.canvasElement = null;
        this.context = null;
        this.width = 0;
        this.height = 0;
    }
    Global.prototype = {
        constructor: Global,
        init: function ( params ) {
            var defer = $.Deferred();
            if(params.canvasId){
                this.canvasElement = $('#'+params.canvasId)[0];
                this.context = this.canvasElement.getContext('2d');
                this.width = this.context.canvas.width;
                this.height = this.context.canvas.height;
            }
            defer.resolve();
            return defer;
        }
    };

    return new Global();
});