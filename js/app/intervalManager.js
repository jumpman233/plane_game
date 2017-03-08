/**
 * Created by lzh on 2017/3/8.
 */

/**
 * there is only one interval running request, so I write IntervalManager to manage
 */
define([], function (  ) {
    function IntervalManager(  ) {
        this.interval = null;
    }

    IntervalManager.prototype.setInterval = function ( func, frame ) {
        if(this.ifInterRunning()){
            throw Error('IntervalManager setInterval: interval is running!');
        } else{
            if(typeof func == 'function' && typeof frame == 'number'){
                this.interval = window.setInterval(func, frame);
            } else{
                throw TypeError('IntervalManager setInterval(): params are not right!');
            }
        }
    };
    IntervalManager.prototype.removeInterval = function (  ) {
        if(typeof this.interval == 'number'){
            window.clearInterval(this.interval);
            this.interval = null;
        }
    };
    IntervalManager.prototype.ifInterRunning = function (  ) {
        return this.interval != null;
    };

    return new IntervalManager();
});