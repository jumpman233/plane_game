/**
 * Created by lzh on 2017/2/28.
 */


define([],function (  ) {

    /**
     * Position
     * mark a coordinate
     * attributes:
     x: number
     y: number
     */
    function Position(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    Position.prototype = {
        className: "position",
        constructor: Position,
        calDis: function (sta,des) {
            if(undefined === sta.x  && undefined === sta.y){
                throw TypeError("calDis(): sta is not Position type!");
            }
            if(undefined !== des && undefined === des.x && undefined === des.y){
                throw TypeError("calDis(): des is not Position type!");
            }
            if(undefined === des && typeof this.x === 'number' && typeof this.y === 'number'){
                des = sta;
                sta = this;
            }
            var dp = this.calDif(sta, des);
            return Math.sqrt(Math.pow(dp.x, 2) + Math.pow(dp.y, 2));
        },
        calDif: function (sta,des) {
            if(undefined === sta.x  && undefined === sta.y){
                throw TypeError("calDis(): sta is not Position type!");
            }
            if(undefined !== des && undefined === des.x && undefined === des.y){
                throw TypeError("calDis(): des is not Position type!");
            }
            if(undefined === des && typeof this.x === 'number' && typeof this.y === 'number'){
                des = sta;
                sta = this;
            }
            return new Position(des.x - sta.x, des.y - sta.y);
        },
        includeAng: function (sta, des, dir) {
            if(undefined === sta.x  && undefined === sta.y){
                throw TypeError("calDis(): sta is not Position type!");
            }
            if(undefined !== des && undefined === des.x && undefined === des.y){
                throw TypeError("calDis(): des is not Position type!");
            }
            if(undefined === des && typeof this.x === 'number' && typeof this.y === 'number'){
                des = sta;
                sta = this;
            }
            if(undefined === dir){
                dir = 0;
            }
            var dp = this.calDif(sta, des);
            var dis = this.calDis(sta, des);
            var inAng = 0;
            if(sta.y >= des.y && sta.x <= des.x){
                var sin = Math.abs(dp.x / dis);
                inAng = Math.asin(sin) * 180 / Math.PI;
            } else if(sta.y < des.y && sta.x <= des.x){
                var sin = Math.abs(dp.y / dis);
                inAng = Math.asin(sin) / Math.PI * 180 + 90;
            } else if(sta.y <= des.y && sta.x >= des.x){
                var sin = Math.abs(dp.x / dis);
                inAng = Math.asin(sin) / Math.PI * 180 + 180;
            } else if(sta.y >= des.y && sta.x >= des.x){
                var sin = Math.abs(dp.y / dis);
                inAng = Math.asin(sin) / Math.PI * 180 + 270;
            }
            return inAng-dir;
        },
        clone: function (  ) {
            return new Position(this.x, this.y);
        }
    };
    return Position;
});