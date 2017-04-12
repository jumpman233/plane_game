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
    'bkAnimate',
    'menuAnimate'],
    function ( jquery, util, Position,Screen, Warehouse, player, GameEventHandler, global, dataManager ,sound, randomBuild, IntervalManager, loadAnimate, bkAnimate, menuAnimate) {
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
                defer.resolve();
                return defer;
            },
            mainMenu:function () {
                var game = this;
                sound.playBackgroundMusic();

                Screen
                    .mainMenu()
                    .then(function ( opt ) {
                        switch (opt){
                            case 0:
                                game.hardChoose();
                                break;
                            case 1:
                                game.storeMenu();
                                break;
                        }
                    });
            },
            storeMenu: function (  ) {
                var game = this,
                    list = [],
                    callback = {};
                list.push({
                    name: 'speed',
                    getValue: function (  ) {
                        return player.getData().speed;
                    },
                    click: function (  ) {
                        player.upgrade('speed');
                    }
                },{
                    name: 'damage',
                    getValue: function (  ) {
                        return player.getData().damage;
                    },
                    click: function (  ) {
                        player.upgrade('damage');
                    }
                });
                callback.getMoney = function (  ) {
                    return player.getData().money;
                };
                callback.getCost = function(str){
                    return player.getCost(str);
                };

                Screen.storeMenu(list, callback)
                    .then(function (  ) {
                        return game.mainMenu();
                    });
            },
            hardChoose: function (  ) {
                var game = this;
                Screen
                    .hardMenu({
                        easy: 'easy',
                        medium: 'medium',
                        hard: 'hard',
                        hell: 'hell'
                    })
                    .then(function ( difficulty ) {
                        var num = 0;
                        global.difficuly = difficulty;
                        switch (difficulty){
                            case 'easy':
                                num = 0;
                                break;
                            case 'medium':
                                num = 1;
                                break;
                            case 'hard':
                                num = 2;
                                break;
                            case 'hell':
                                num = 3;
                                break;
                        }
                        randomBuild.setCurDiff(num);
                        game.test1();
                    })
            },
            pause: function (  ) {
                var game = this;
                game.isPause = !game.isPause;

                var resumeFunc = function (  ) {
                    game.resume.call(game);
                };
                var exitFunc = function (  ) {
                    global.context.clearRect(0,0,global.width,global.height);
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
                global.frameNum = 0;
                player.ready();
                dataManager.reset();
                util.setCursor('none');

                GameEventHandler.keydown(function ( e ) {
                    if(e.keyCode == 27){
                        if(!game.isPause){
                            game.resume();
                        } else{
                            game.pause();
                        }
                    }
                });

                var gameTest = function () {
                    global.frameNum++;
                    if(game.isPause){
                        return;
                    }
                    global.clearRect();

                    var planes = randomBuild.createEnemyPlane();
                    // var missile = randomBuild.createMissile(1/fps/10);
                    if(planes !== undefined){
                        dataManager.resolveEnemy(planes);
                    }
                    // if(missile){
                    //     dataManager.resolveMissile(missile);
                    // }

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

                IntervalManager.clearIntervalList();
                IntervalManager.addInterval(gameTest);
            },
            gameOver: function () {
                var game = this,
                    playerData = player.getData();

                Screen.gameOverMenu({
                    scoreValue: player.score,
                    moneyValue: playerData.money
                }, function (  ) {
                    game.test1();
                }, function (  ) {
                    game.mainMenu();
                }, function ( money ) {
                    player.setData('money', money);
                });
                game.isPause = true;
            },
            init: function (config) {
                var game = this,
                    startTime = new Date().getTime(),
                    defer = $.Deferred(),
                    context = $('#' + config.canvasId)[0].getContext('2d');

                var loading = function (  ) {
                    loadAnimate.draw(context);
                };

                var removeLoad = function (  ) {
                    loadAnimate.remove(context);
                    if(loadAnimate.isRemoved()){
                        IntervalManager.clearIntervalList();
                        defer.resolve();
                    }
                };

                IntervalManager.start(1000 / config.fps);
                IntervalManager.addInterval(loading);

                game
                    .getConfig(config)
                    .then(function (  ) {
                         return global.init({
                             canvasId: config.canvasId,
                             fps: config.fps
                         });
                    })
                    .then(function (  ) {
                        menuAnimate.init();
                        return Warehouse.init(game.src);
                    })
                    .then(function (  ) {
                        return Screen.init();
                    })
                    .then(function (  ) {
                        return player.init({
                            plane: Warehouse.getPlaneByType(1)
                        });
                    })
                    .then(function (  ) {
                        return sound.init({
                            backgroundAudio: Warehouse.getAudioByName('backgroundMusic')
                        });
                    })
                    .then(function (  ) {
                        return randomBuild.init(Warehouse);
                    })
                    .then(function (  ) {
                        //if all the image and audio load is done ,the game's init is completed
                        game.ifInit(function (  ) {
                            console.log('all resource is loaded! cost '+(new Date().getTime()-startTime)+' ms');
                            IntervalManager.removeInterval(loading);
                            IntervalManager.addInterval(removeLoad);
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