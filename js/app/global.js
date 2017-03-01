/**
 * Created by lzh on 2017/3/1.
 */

define([],function () {
    function Global(  ) {
        this.notLoadedImgCount = 0;
        this.notLoadedAudioCount = 0;
    }
    Global.prototype = {
        constructor: Global
    };

    return new Global();
});