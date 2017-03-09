/**
 * Created by lzh on 2017/3/8.
 */

/**
 * there is only one interval running request, so I write IntervalManager to manage
 */
define([], function (  ) {
    function IntervalManager(  ) {
        this.interval = null;
        this.interList = [];
    }

    IntervalManager.prototype.addInterval = function ( func ) {
        if(typeof func == 'function'){
            this.interList.push(func);
        } else{
            throw TypeError('IntervalManager addInterval(): param is not right!');
        }
    };
    IntervalManager.prototype.removeInterval = function ( func ) {
        if(!func) return;

        for(var i in this.interList){
            if(func == this.interList[i]){
                this.interList.splice(i, 1);
                return true;
            }
        }
        return false;
    };
    IntervalManager.prototype.clearIntervalList = function (  ) {
        this.interList = [];
    };
    IntervalManager.prototype.start = function ( fps ) {
        var im = this;
        if(!fps){
            fps = 20;
        }

        var interFunc = function (  ) {
            for(var i in im.interList){
                im.interList[i]();
            }
        };

        im.interval = window.setInterval(interFunc, fps)
    };
    IntervalManager.prototype.stop = function (  ) {
        window.clearInterval(this.interval);
    };

    return new IntervalManager();
});