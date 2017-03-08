/**
 * Created by lzh on 2017/2/28.
 */

define(['jquery',
    'util',
    'position',
    'screen',
    'warehouse',
    'player',
    'gameEventHandler',
    'global',
    'dataManager',
    'sound',
    'randomBuild',
    'intervalManager',
    'loadAnimate',
    'bkAnimate'],
    function ( jquery, util, Position,Screen, Warehouse, Player, GameEventHandler, global, dataManager ,sound, randomBuild, IntervalManager, loadAnimate, bkAnimate) {
        'use strict';

        function PlaneGame(params) {
            this.player = null;
            this.geh = null;
            this.isPause = false;
            this.playing = false;
            this.backgoundImg = null;
            this.backgroundAudio = null;

            if (!params) return;

            if (params.backgroundSrc) {
                this.backgroundSrc = params.backgroundSrc;
            }
            if(params.src){
                this.src = params.src;
            }
            if (params.fps) {
                this.fps = params.fps;
            } else{
                this.fps = 30;
            }
        }

        PlaneGame.prototype = {
            constructor : PlaneGame,
            getConfig: function ( params ) {
                var defer = $.Deferred();
                if (!params) return;

                if (params.backgroundSrc) {
                    this.backgroundSrc = params.backgroundSrc;
                }
                if(params.src){
                    this.src = params.src;
                }
                if (params.fps) {
                    this.fps = params.fps;
                } else{
                    this.fps = 20;
                }
                defer.resolve();
                return defer;
            },
            mainMenu:function () {
                var game = this;
                game.playing = false;

                var startGameFunc = function (  ) {
                    game.playing = true;
                    util.setCursor('none');
                    game.test1();
                };
                Screen.mainMenu(startGameFunc);
            },
            pause: function (  ) {
                var game = this;
                game.isPause = true;

                var resumeFunc = function (  ) {
                    game.resume.call(game);
                };
                var exitFunc = function (  ) {
                    global.context.clearRect(0,0,global.width,global.height);
                    window.clearInterval(game.gaming);
                    sound.stopBackgroundMusic();
                    game.mainMenu.call(game);
                };

                Screen.pauseMenu(resumeFunc,exitFunc);
            },
            resume: function (  ) {
                var game = this;
                game.isPause = false;
                util.setCursor('none');
            },
            start: function () {
                var game = this;

                game.mainMenu();
            },
            test1: function () {
                var game = this;
                game.playing = true;
                game.isPause = false;
                sound.playBackgroundMusic();
                GameEventHandler.keydown(function ( e ) {
                    if(e.keyCode == 27 && !game.isPause){
                        game.pause();
                    }
                });
                var fps = 50;

                var gameTest = function () {
                    if(game.isPause){
                        return;
                    }

                    var plane = randomBuild.createEnemyPlane(1/fps/2);
                    var missile = randomBuild.createMissile(1/fps/10);
                    if(plane){
                        dataManager.resolveEnemy(plane);
                    }
                    if(missile){
                        dataManager.resolveMissile(missile);
                    }

                    Player.shoot();

                    Screen.draw();

                    dataManager.judge(function ( plane ) {
                        var tool = randomBuild.createTool(plane.toolDrop);
                        if(tool){
                            tool.position = plane.position;
                            dataManager.resolveTool(tool);
                        }
                    },function (  ) {
                        game.gameOver();
                    });
                };

                IntervalManager.setInterval(gameTest, 1000 / fps);
            },
            gameOver: function () {
                var game = this;

                sound.backgroundAudio.pause();
                global.context.clearRect(0,0,global.width,global.height);
                Player.plane.position  = new Position(global.width/2,global.height-100);
                Player.plane.drawImg();
                global.context.font = "30px Courier New";
                global.context.fillStyle = "#333";
                global.context.textAlign = 'center';
                global.context.fillText("Game Over",global.width/2,global.height/2);
                game.isPause = true;
            },
            init: function (config) {
                var game = this;

                var startTime = new Date().getTime();

                var defer = $.Deferred();

                var context = $('#' + config.canvasId)[0].getContext('2d');

                IntervalManager.setInterval(function (  ) {
                    loadAnimate.loading(context);
                }, 30);

                game.warehouse = Warehouse;

                game
                    .getConfig(config)
                    .then(function (  ) {
                         return global.init({
                             canvasId: config.canvasId
                         });
                    })
                    .then(function (  ) {
                        return Warehouse.init(game.src);
                    })
                    .then(function (  ) {
                        return Screen.init();
                    })
                    .then(function (  ) {
                        return Player.init({
                            plane: Warehouse.getPlaneByType(1)
                        });
                    })
                    .then(function (  ) {
                        return sound.init({
                            backgroundAudio: Warehouse.getAudioByName('backgroundMusic')
                        });
                    })
                    .then(function (  ) {
                        //if all the image and audio load is done ,the game's init is completed
                        game.ifInit(function (  ) {
                            console.log('all resource is loaded! cost '+(new Date().getTime()-startTime)+' ms');
                            IntervalManager.removeInterval();
                            IntervalManager.setInterval(function (  ) {
                                if(loadAnimate.removeLoad(context)){
                                    IntervalManager.removeInterval();
                                    IntervalManager.setInterval(function (  ) {
                                        bkAnimate(context);
                                    }, 20);
                                    defer.resolve();
                                }
                            }, 20);
                        });
                    });

                return defer;
            },
            ifInit: function ( func ) {
                if(typeof func == 'function'){
                    var interval = window.setInterval(function (  ) {
                        if(global.notLoadedImgCount == 0
                            && global.notLoadedAudioCount == 0){
                            window.clearInterval(interval);
                            func();
                        }
                    }, 500);
                } else{
                    throw TypeError('planeGame ifInit(): param is not right!');
                }
            }
        };

        return new PlaneGame();

});