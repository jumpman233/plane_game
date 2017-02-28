/**
 * Created by lzh on 2017/2/28.
 */

define(['util',
'warehouse',
'position'],function ( util, Warehouse, Position ) {
    function Screen(  ) {
        this.optWidth = 200;
        this.optHeight = 30;
        this.optFont = 16;
        this.optionsFunc = []; //use to remove elements
        this.options = [];
    }
    Screen.prototype = {
        constructor: Screen,
        init: function ( params ) {
            if(params.canvasElement){
                this.canvasElement = params.canvasElement;
                this.context = params.context;
            }
        },
        removeAllOptions: function (  ) {
            var screen = this;
            for(var i in screen.optionsFunc){
                var func = screen.optionsFunc[i];
                if(func.name == 'menuMouseMove'){
                    screen.canvasElement.removeEventListener('mousemove',func);
                } else if(func.name == 'menuMouseDown'){
                    screen.canvasElement.removeEventListener('mousedown',func);
                }
            }
            screen.optionsFunc = [];
            screen.options = [];
            console.log(screen.optionsFunc);
        },
        drawMenuOption: function ( name, x, y, callback ) {
            var screen = this;
            var context = screen.context;
            var rectX = x - screen.optWidth/2;
            var rectY = y - screen.optHeight/2-5;
            context.strokeRect(rectX, rectY, screen.optWidth, screen.optHeight);
            context.font = screen.optFont + "px Georgia";
            context.fillText(name, x, y);
            screen.options.push({
                rectX: rectX,
                rectY: rectY,
                width: screen.optWidth,
                height: screen.optHeight
            });
            function menuMouseMove (event) {
                var pos = util.getEventPosition(event);
                var flag = false;
                for(var i in screen.options){
                    var opt = screen.options[i];
                    if(util.checkInRect(pos, opt.rectX, opt.rectY, opt.width, opt.height)){
                        $('#'+screen.canvasElement.id).css('cursor','pointer');
                        flag = true;
                        break;
                    }
                }
                if(!flag){
                    $('#'+screen.canvasElement.id).css('cursor','default');
                }
            }
            function menuMouseDown ( event ) {
                var pos = util.getEventPosition(event);
                if(util.checkInRect(pos, rectX, rectY, screen.optWidth, screen.optHeight)){
                    screen.removeAllOptions();
                    for(var i in screen.optionsFunc){
                        var func = screen.optionsFunc[i];
                        if(func == menuMouseDown || func == menuMouseMove){
                            screen.optionsFunc.splice(i,1);
                        }
                    }
                    callback();
                }
            }
            screen.optionsFunc.push(menuMouseMove);
            screen.optionsFunc.push(menuMouseDown);
            screen.canvasElement.addEventListener('mousemove',menuMouseMove,false);
            screen.canvasElement.addEventListener('mousedown', menuMouseDown, false);
        },
        drawScore: function (value) {
            var screen = this;
            var context = screen.context;
            context.font = "16px Georgia";
            context.textAlign = 'left';
            context.fillText("Score: " + value,10,20);
        },
        drawLife: function (value) {
            var screen = this;

            var lifeItem = Warehouse.getItemByName("life");
            var pos = new Position(0,screen.context.canvas.height - lifeItem.height);
            for(var i = 0; i < value; i++){
                screen.drawImage({
                    img: lifeItem.img,
                    height: lifeItem.height,
                    width: lifeItem.width,
                    position: pos
                });
                pos.x += lifeItem.width;
            }
        },
        drawImage: function (obj) {
            if(!obj.img) return;

            var image = {
                width: 10,
                height: 10,
                x: 0,
                y: 0
            };
            if(obj.width){
                image.width = obj.width;
            }
            if(obj.height){
                image.height = obj.height;
            }
            if(obj.position && obj.position.x){
                image.x = obj.position.x;
            }
            if(obj.position && obj.position.y){
                image.y = obj.position.y;
            }
            this.context.beginPath();
            this.context.drawImage(obj.img, image.x,image.y,image.width,image.height);
            this.context.closePath();
        }
    };
    return new Screen();
});