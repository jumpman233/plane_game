/**
 * Created by lzh on 2017/2/28.
 */

define(['util',
'warehouse',
'position',
'dataManager',
'player',
'global',
'rect',
'text',
'intervalManager',
'menuAnimate',
'bkAnimate',
'hardAnimate',
'ballBkAnimate'],function ( util, Warehouse, Position, dataManager, player, global, Rect, Text, IM,menuAnimate,bkAnimate, hardAnimate, ballBkAnimate ) {
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
            var defer = $.Deferred();
            this.canvasElement = global.canvasElement;
            this.context = global.context;
            this.backgoundImg = Warehouse.getItemByName("background");
            defer.resolve();
            return defer;
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
        mainMenu: function ( params ) {
            if(!params || !params.startGame){
                throw  TypeError('Screen mainMenu(): params are not right!');
            }

            var screen = this,
                width = global.width,
                height = global.height,
                defer = $.Deferred();

            var clickEvent = function (  ) {
                screen
                    .removeMainMenu()
                    .then(function (  ) {
                        defer.resolve(params.startGame);
                    });
            };
            screen
                .drawMainMenu()
                .then(function (  ) {
                    screen.setOptionEvent(width/2, height/2 , clickEvent);
                });
            return defer;
        },
        hardMenu: function ( params ) {
            if(!params || !params.easy || !params.medium || !params.hard || !params.hell){
                throw  TypeError('Screen hardMenu(): params are not right!');
            }
            IM.clearIntervalList();
            hardAnimate.init(global.context);
            ballBkAnimate.init(global.context);

            IM.addInterval(function (  ) {
                global.clearRect();
                hardAnimate.draw();
                ballBkAnimate.draw();
            });
        },
        drawMainMenu: function (  ) {
            var defer = $.Deferred();
            var draw = function (  ) {
                global.clearRect();
                bkAnimate.draw(global.context);
                menuAnimate.mainMenu.draw(global.context);
                if(menuAnimate.mainMenu.complete()){
                    defer.resolve();
                }
            };

            IM.addInterval(draw);
            return defer;
        },
        removeMainMenu: function (  ) {
            var defer = $.Deferred();

            menuAnimate.mainMenu.remove();
            bkAnimate.remove();

            var inter = function (  ) {
                if(menuAnimate.mainMenu.isRemoved() && bkAnimate.isRemoved()){
                    IM.removeInterval(inter);
                    defer.resolve();
                }
            };

            IM.addInterval(inter);
            return defer;
        },
        setOptionEvent: function ( x, y, callback ) {
            if(typeof callback !== 'function'){
                throw TypeError('Screen setOptionEvent(): params are not right!');
            }
            var rect = new Rect(),
                screen = this,
                defer = $.Deferred();

            rect.x = x - screen.optWidth/2;
            rect.y = y - screen.optHeight/2;
            rect.width = screen.optWidth;
            rect.height = screen.optHeight;

            screen.options.push(rect);

            function menuMouseMove (event) {
                var pos = util.getEventPosition(event);
                var flag = false;
                for(var i in screen.options){
                    var opt = screen.options[i];
                    if(opt.isInclude(pos.x, pos.y)){
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
                if(rect.isInclude(pos.x, pos.y)){
                    screen.removeAllOptions();
                    util.setCursor('default');
                    callback();
                }
            }
            screen.optionsFunc.push(menuMouseMove);
            screen.optionsFunc.push(menuMouseDown);
            global.canvasElement.addEventListener('mousemove',menuMouseMove,false);
            global.canvasElement.addEventListener('mousedown', menuMouseDown, false);

            return defer;
        },
        drawMenuOption: function ( name, x, y ) {
            var screen = this;
            var context = global.context;
            var rect = new Rect();
            var text = new Text();
            rect.x = x - screen.optWidth/2;
            rect.y = y - screen.optHeight/2;
            rect.width = screen.optWidth;
            rect.height = screen.optHeight;

            text.fontSize = screen.optFont;
            text.fontFamily = 'Georgia';
            text.text = name;
            text.x = x;
            text.y = y + text.fontSize / 3;

            rect.draw(context);
            text.draw(context);
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
            // screen.drawFightBk();
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

            for (var i in dataManager.enemies){
                dataManager.enemies[i].update();
                var plane = dataManager.enemies[i].plane;
                plane.draw();
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