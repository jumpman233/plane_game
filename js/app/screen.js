/**
 * Created by lzh on 2017/2/28.
 */

define(['util',
'warehouse',
'position',
'dataManager',
'player',
'global'],function ( util, Warehouse, Position, dataManager, player, global ) {
    function Screen(  ) {
        this.optWidth = 200;
        this.optHeight = 30;
        this.optFont = 16;
        this.optionsFunc = []; //use to remove elements
        this.options = [];
        this.backgoundImg = null;
        this.position = 0;
    }
    Screen.prototype = {
        constructor: Screen,
        init: function (  ) {
            this.canvasElement = global.canvasElement;
            this.context = global.context;
            this.backgoundImg = Warehouse.getItemByName("background");
        },
        removeAllOptions: function (  ) {
            var screen = this;
            for(var i in screen.optionsFunc){
                var func = screen.optionsFunc[i];
                if(func.name == 'menuMouseMove'){
                    global.canvasElement.removeEventListener('mousemove',func);
                } else if(func.name == 'menuMouseDown'){
                    global.canvasElement.removeEventListener('mousedown',func);
                }
            }
            screen.optionsFunc = [];
            screen.options = [];
            console.log(screen.optionsFunc);
        },
        pauseMenu: function ( resumeFunc, exitFunc ) {
            var screen = this;
            var context = global.context;
            var width = global.width;
            var height = global.height;
            context.fillStyle = 'rgba(102,102,102,0.4)';
            context.fillRect(0,0,width,height);
            context.font = "20px Georgia";
            context.fillStyle = '#000';
            context.textAlign = 'center';
            context.fillText("Pause",width/2,height/2-100);
            screen.drawMenuOption('Resume', width/2, height/2, resumeFunc);
            screen.drawMenuOption('Exit', width/2, height/2 + 50, exitFunc);
        },
        mainMenu: function (  ) {
            
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
                        util.setCursor('pointer');
                        flag = true;
                        break;
                    }
                }
                if(!flag){
                    util.setCursor('default');
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
            global.canvasElement.addEventListener('mousemove',menuMouseMove,false);
            global.canvasElement.addEventListener('mousedown', menuMouseDown, false);
        },
        drawScore: function () {
            var screen = this;
            var context = global.context;
            context.font = "16px Georgia";
            context.textAlign = 'left';
            context.fillText("Score: " + player.score,10,20);
        },
        drawLife: function () {
            var screen = this;

            var lifeItem = Warehouse.getItemByName("life");
            var pos = new Position(0,global.context.canvas.height - lifeItem.height);
            for(var i = 0; i < player.curLife; i++){
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
        },
        drawFightBk: function () {
            var game = this;
            var ctx = global.context;
            ctx.globalAlpha = 0.8;
            ctx.drawImage(game.backgoundImg.img,0, -ctx.canvas.height*2+game.position,ctx.canvas.width,ctx.canvas.height*2);
            ctx.drawImage(game.backgoundImg.img,0, -ctx.canvas.height*4+game.position,ctx.canvas.width,ctx.canvas.height*2);
            ctx.drawImage(game.backgoundImg.img,0, game.position,ctx.canvas.width,ctx.canvas.height*2);
            ctx.globalAlpha = 1;

            game.position++;
            if(game.position>=ctx.canvas.height*2){
                game.position = 0;
            }
        },

        draw: function () {
            var screen = this;
            global.context.clearRect(0,0,screen.width,screen.height);

            screen.drawFightBk();
            screen.drawScore();
            screen.drawLife();

            player.plane.draw(global.context);

            for(var i in dataManager.enemy_bullets){
                var bullet = dataManager.enemy_bullets[i];
                bullet.draw(global.context);
                bullet.move(global.context);
            }
            for(var i in dataManager.player_bullets){
                var bullet = dataManager.player_bullets[i];
                bullet.draw(global.context);
                bullet.move(global.context);
            }

            for (var i in dataManager.enemy_planes){
                var plane = dataManager.enemy_planes[i];
                plane.draw(global.context, screen.frameNum);
                plane.move();
            }

            for (var i in dataManager.tools){
                dataManager.tools[i].draw(global.context);
            }

            for(var i in dataManager.missiles){
                var missile = dataManager.missiles[i];
                missile.draw(global.context);
                missile.move();
            }
        }
    };
    return new Screen();
});