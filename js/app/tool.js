/**
 * Created by lzh on 2017/2/28.
 */

define(['util',
'position'],function ( util, Position ) {

    /**
     * Tool
     * the object can float in the screen
     * @param params
     * @constructor
     */
    function Tool(params) {

        if(!params) return;

        if(params.width){
            this.width = params.width;
        } else{
            this.width = 40;
        }
        if(params.height){
            this.height = params.height;
        } else{
            this.height = 30;
        }
        if(params.src){
            this.src = params.src;
        }
        if(params.name){
            this.name = params.name;
        }
        if(params.position){
            this.position = params.position;
        } else{
            this.position = new Position(0,0);
        }
        if(params.weight){
            this.weight = params.weight;
        }
        this.img = null;
        this.isInit = false;
        this.xMove = 3;
        this.yMove = 0.3;
        this.existTime = 15;
        this.extraTime = null;
    }

    Tool.prototype = {
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
        },
        init: function () {
            var tool = this;
            if(Math.random()<=0.5){
                tool.xMove = Math.abs(tool.xMove);
            } else{
                tool.xMove = - Math.abs(tool.xMove)
            }
        },
        draw: function (ctx) {
            var tool = this;
            if(tool.extraTime<=0){
                return;
            }
            ctx.drawImage(
                tool.img,
                tool.position.x - tool.width / 2,tool.position.y - tool.height / 2,
                tool.width,tool.height);
            tool.position.x += tool.xMove;
            tool.position.y += tool.yMove;
            if((tool.position.x + tool.width / 2 >= ctx.canvas.width && tool.xMove > 0) ||
                (tool.position.x - tool.width / 2 <= 0 && tool.xMove < 0)){
                tool.xMove = -tool.xMove;
            }
            if(tool.extraTime!=null){
                tool.extraTime--;
            }
        }
    };
    return Tool;
});