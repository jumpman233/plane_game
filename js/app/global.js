/**
 * Created by lzh on 2017/3/1.
 */

define([],function () {
    'use strict';
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
        this.frameNum = 0;
        this.difficuly = '';
        this.defaultBGColor = '#ddd';
        this.selectColor = '#ddd';
        this.selectDefaultColor = '#fff';
    }
    Global.prototype = {
        constructor: Global,
        init: function ( params ) {
            if(!params.fps || !params.canvasId){
                throw TypeError('Global init():params are not right!');
            }

            var defer = $.Deferred(),
                width = window.innerWidth,
                height = window.innerHeight;
            this.canvasElement = $('#'+params.canvasId)[0];
            this.canvasElement.width = width;
            this.canvasElement.height = height;
            this.context = this.canvasElement.getContext('2d');
            this.width = this.canvasElement.width;
            this.height = this.canvasElement.height;
            Object.defineProperty(this, 'fps', {
                writable: false,
                configurable: false,
                enumerable: true,
                value: params.fps
            });
            defer.resolve();
            return defer;
        },
        setToDefaultBKColor: function (  ) {
            this.canvasElement.style.backgroundColor = this.defaultBGColor;
        },
        clearRect: function (  ) {
            if(this.context){
                this.context.clearRect(0, 0, this.width, this.height);
            }
        }
    };

    return new Global();
});