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
        this.optWidth = 200;
        this.optHeight = 30;
        this.optFont = 16;
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
        },
        clearRect: function (  ) {
            if(this.context){
                this.context.clearRect(0, 0, this.width, this.height);
            }
        }
    };

    return new Global();
});