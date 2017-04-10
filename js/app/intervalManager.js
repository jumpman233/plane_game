/**
 * Created by lzh on 2017/3/8.
 */

/**
 * there is only one interval running request, so I write IntervalManager to manage
 */
define(['global'], function ( global ) {
    function IntervalManager(  ) {
        this.interval = null;
        this.interList = [];
    }

    IntervalManager.prototype.addToTop = function ( func ) {
        if(typeof func == 'function'){
            this.interList.unshift(func);
        } else{
            throw TypeError('IntervalManager addInterval(): param is not right!');
        }
    };
    IntervalManager.prototype.addInterval = function ( func, name ) {
        if(typeof func == 'function'){
            if(typeof name === 'string'){
                func.f_name = name;
            }
            this.interList.push(func);
        } else{
            throw TypeError('IntervalManager addInterval(): param is not right!');
        }
    };
    IntervalManager.prototype.haveInterval = function ( func ) {
        if(typeof func !== 'function' && typeof func !== 'string') return;

        for(var i in this.interList){
            if(func == this.interList[i] || func === this.interList[i].f_name){
                return true;
            }
        }
        return false;
    };
    IntervalManager.prototype.removeInterval = function ( func ) {
        if(typeof func !== 'function' && typeof func !== 'string') return;

        for(var i in this.interList){
            if(func == this.interList[i] || func === this.interList[i].f_name){
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
            throw Error('IntervalManager start(): no attr fps!')
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