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
'ballBkAnimate',
'storeMenu',
'fightBk',
'gameOverAnimate',
'rankMenu'],function ( util, Warehouse, Position, dataManager,
                       player, global, Rect, Text, IM,
                       menuAnimate,bkAnimate, hardAnimate, ballBkAnimate,
                       storeMenu, fightBk, gameOverAnimate, rankMenu ) {
    'use strict';
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

                global.canvasElement.removeEventListener('mousedown',func);
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
            screen.setOptionsMouseEvent();
        },
        mainMenu: function (startFunc, storeFunc, rankFunc) {
            var screen = this,
                defer = $.Deferred();

            var startGameClickEvent = function (  ) {
                screen
                    .removeMainMenu(true)
                    .then(startFunc);
            };
            var storeGameClickEvent = function (  ) {
                screen.removeMainMenu(false)
                    .then(storeFunc);
            };
            var rankClickEvent= function (  ) {
                screen.removeMainMenu(false)
                    .then(rankFunc);
            };
            screen
                .drawMainMenu(function ( x, y ) {
                    screen.setOptionEvent(x, y, startGameClickEvent);
                }, function ( x, y ) {
                    screen.setOptionEvent(x, y, storeGameClickEvent);
                }, function ( x, y ) {
                    screen.setOptionEvent(x, y, rankClickEvent);
                });
            return defer;
        },
        storeMenu: function ( list, callback ) {
            var screen = this,
                defer = $.Deferred();

            callback.backClick = function (  ) {
                storeMenu
                    .remove()
                    .then(function (  ) {
                        IM.clearIntervalList();
                        defer.resolve();
                    });
            };
            var draw = function (  ) {
                global.clearRect();
                storeMenu.draw();
            };

            storeMenu.init(list, callback);
            screen.startMenuBk();
            IM.addToTop(draw);

            return defer;
        },
        hardMenu: function ( params ) {
            if(!params || !params.easy || !params.medium || !params.hard || !params.hell){
                throw  TypeError('Screen hardMenu(): params are not right!');
            }
            var defer = $.Deferred(),
                screen = this,
                flag1 = false,
                flag2 = false;

            var checkFinish = function ( str ) {
                if(flag1 && flag2){
                    defer.resolve(str);
                    IM.clearIntervalList();
                }
            };

            var removeAnimate = function ( str ) {
                hardAnimate.remove();
                ballBkAnimate.remove();
                hardAnimate.removeEvent();
                util.fadeTo(16, 16, 16)
                    .then(function (  ) {
                        flag1 = true;
                        checkFinish(str);
                    });

                IM.addInterval(function (  ) {
                    if(hardAnimate.isRemoved() && ballBkAnimate.isRemoved()){
                        flag2 = true;
                        checkFinish(str);
                    }
                });
            };

            IM.clearIntervalList();

            hardAnimate.init(global.context, function() {
                removeAnimate(params.easy);
            } , function (  ) {
                removeAnimate(params.medium);
            },function (  ) {
                removeAnimate(params.hard);
            },function (  ) {
                removeAnimate(params.hell);
            });

            ballBkAnimate.init(global.context);

            IM.addInterval(function (  ) {
                global.clearRect();
                ballBkAnimate.draw();
                hardAnimate.draw();
            });

            return defer;
        },
        rankMenu: function ( data, backEvent ) {
            var screen = this;

            var checkRemoved = function (  ) {
                return rankMenu.isRemoved();
            };

            rankMenu.init(data, function (  ) {
                IM.addInterval(function (  ) {
                    if(checkRemoved()){
                        IM.clearIntervalList();
                        backEvent();
                    }
                });
                rankMenu.remove();
            });

            IM.addInterval(function (  ) {
                global.clearRect();

                rankMenu.draw();

                if(bkAnimate.isPlaying()){
                    bkAnimate.draw(global.context);
                }
            });
        },
        gameOverMenu: function ( params, onceAgainEvent, returnMainEvent, resolveMon ) {
            global.setToDefaultBKColor();
            global.context.clearRect(0,0,global.width,global.height);

            gameOverAnimate.init(params, function (  ) {
                removeInter()
                    .then(function (  ) {
                        return util.fadeTo(0, 0, 0, 5);
                    })
                    .then(function (  ) {
                        onceAgainEvent();
                    });
            }, function (  ) {
                removeInter()
                    .then(function (  ) {
                        returnMainEvent();
                    })
            }, resolveMon);

            IM.clearIntervalList();

            var removeInter = function (  ) {
                var defer = $.Deferred();
                gameOverAnimate.remove();
                IM.addInterval(function (  ) {
                    if(gameOverAnimate.isRemoved()){
                        IM.removeInterval('removeGameOver');
                        IM.removeInterval(draw);
                        defer.resolve();
                    }
                }, 'removeGameOver');
                return defer;
            };

            var draw = function (  ) {
                global.clearRect();
                gameOverAnimate.draw(global.context);
            };

            IM.addInterval(draw);

            // player.plane.position  = new Position(global.width/2,global.height-100);
            // player.plane.drawImg();
            // global.context.font = "30px Courier New";
            // global.context.fillStyle = "#333";
            // global.context.textAlign = 'center';
            // global.context.fillText("Game Over",global.width/2,global.height/2);
        },
        startMenuBk: function (  ) {
            if(!bkAnimate.isPlaying() || !IM.haveInterval('bk')){
                var draw = function (  ) {
                    bkAnimate.draw(global.context);
                };

                IM.addInterval(function (  ) {
                    draw();
                }, 'bk');
            }
        },
        drawMainMenu: function ( startListener, storeListener, rankClickListener ) {
            var defer = $.Deferred();
            global.setToDefaultBKColor();
            menuAnimate.mainMenu.init(startListener, storeListener, rankClickListener);
            var draw = function (  ) {
                global.clearRect();
                menuAnimate.mainMenu.draw(global.context);
                if(menuAnimate.mainMenu.complete()){
                    defer.resolve();
                }
            };

            if(!bkAnimate.isPlaying()){
                bkAnimate.reset();
            }
            this.startMenuBk();

            IM.addToTop(draw);

            return defer;
        },
        removeMainMenu: function ( bk ) {
            var defer = $.Deferred(),
                inter = null;

            menuAnimate.mainMenu.remove();
            if(bk === true){
                bkAnimate.remove();

                inter = function (  ) {
                    if(menuAnimate.mainMenu.isRemoved() && bkAnimate.isRemoved()){
                        defer.resolve();
                        IM.clearIntervalList();
                    }
                };
                IM.addInterval(inter);
            } else{
                inter = function (  ) {
                    if(menuAnimate.mainMenu.isRemoved()){
                        IM.clearIntervalList();
                        defer.resolve();
                    }
                };
                IM.addInterval(inter);
            }

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

            function menuClick ( event ) {
                var pos = util.getEventPosition(event);
                if(rect.isInclude(pos.x, pos.y)){
                    screen.removeAllOptions();
                    util.setCursor('default');
                    screen.removeOptionsMouseEvent();
                    callback();
                }
            }
            screen.optionsFunc.push(menuClick);
            global.canvasElement.addEventListener('click', menuClick, false);

            return defer;
        },
        setOptionsMouseEvent: function (  ) {
            var screen = this;

            screen.mouseMoveEvent = function ( e ) {
                var pos = util.getEventPosition(e);

                var flag = false;
                for(var i = 0; i < screen.options.length; i++){
                    if(screen.options[i].isInclude(pos.x, pos.y)){
                        util.setCursor('pointer');
                        flag = true;
                    }
                }
                if(!flag){
                    util.setCursor('default');
                }
            };

            screen.mouseClick = function ( e ) {
                var pos = util.getEventPosition(e);

                for(var i =0 ;i < screen.options.length; i++){
                    if(screen.options[i].isInclude(pos.x, pos.y)){
                        screen.optionsFunc[i](e);
                        screen.removeOptionsMouseEvent();
                    }
                }
            };

            global.canvasElement.addEventListener('mousemove', screen.mouseMoveEvent);
            global.canvasElement.addEventListener('click', screen.mouseClick);
        },
        removeOptionsMouseEvent: function (  ) {
            var screen = this;

            for(var i = 0; i < screen.optionsFunc.length; i++){
                global.canvasElement.removeEventListener('click', screen.optionsFunc[i]);
            }
            screen.options = [];
            screen.optionsFunc = [];
        },
        drawMenuOption: function ( name, x, y, func ) {
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

            screen.optionsFunc.push(func);
            screen.options.push(rect);

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
        draw: function () {
            var screen = this;
            fightBk.draw(global.context);
            screen.drawScore();
            screen.drawLife();


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

            player.draw(global.context);
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
        }
    };
    return new Screen();
});