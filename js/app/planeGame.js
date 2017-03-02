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
    'randomBuild'], function ( jquery, util, Position,Screen, Warehouse, Player, GameEventHandler, global, dataManager ,sound, randomBuild) {
    'use strict';

    function PlaneGame(params) {
        this.bulletList = [];
        this.player = null;
        this.geh = null;
        this.pause = false;
        this.playing = false;
        this.backgoundImg = null;
        this.backgroundAudio = null;

        if (!params) return;

        if (params.backgroundSrc) {
            this.backgroundSrc = params.backgroundSrc;
        }
        if (params.canvasElement) {
            this.canvasElement = params.canvasElement;
            this.width = this.canvasElement.getAttribute('width');
            this.height = this.canvasElement.getAttribute('height');
            this.context = this.canvasElement.getContext('2d');
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
            var context = global.context;
            var width = global.width;
            var height = global.height;
            game.playing = false;

            var startGameFunc = function (  ) {
                game.playing = true;
                $('#'+global.canvasElement.id).css('cursor','none');
                game.test1();
            };

            context.font = "20px Georgia";
            context.textAlign = 'center';
            context.fillText("Fight In Sky",width/2,height/2-100);
            Screen.drawMenuOption('Start Game', width/2,height/2, startGameFunc);
        },
        pauseMenu: function (  ) {
            var game = this;
            var context = game.context;
            var width = context.canvas.width;
            var height = context.canvas.height;
            context.fillStyle = 'rgba(102,102,102,0.4)';
            context.fillRect(0,0,width,height);
            context.font = "20px Georgia";
            context.fillStyle = '#000';
            context.textAlign = 'center';
            context.fillText("Pause",width/2,height/2-100);
            var resumeFunc = function (  ) {
                console.log("!");
                game.resume.call(game);
            };
            var exitFunc = function (  ) {
                game.context.clearRect(0,0,game.context.canvas.width,game.context.canvas.height);
                window.clearInterval(game.gaming);
                game.mainMenu.call(game);
            };
            Screen.drawMenuOption('Resume', width/2, height/2, resumeFunc);
            Screen.drawMenuOption('Exit', width/2, height/2 + 50, exitFunc);
        },
        resume: function (  ) {
            var game = this;
            game.pause = false;
            $('#'+global.canvasElement.id).css('cursor','none');
        },
        start: function () {
            var game = this;

            game.mainMenu();
        },
        test1: function () {
            var game = this;
            game.playing = true;
            game.pause = false;
            sound.playBackgoundMusic();
            var fps = 50;
            game.gaming = window.setInterval(function () {
                if(game.pause){
                    return;
                }

                var plane = randomBuild.createEnemyPlane(1/fps/2);
                var missile = randomBuild.createMissile(1/fps/10);
                if(plane){
                    dataManager.resolvePlane(plane);
                }
                if(missile){
                    dataManager.resolveMissile(missile);
                }

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
            }, 1000 / fps);
        },
        gameOver: function () {
            var game = this;

            sound.backgroundAudio.pause();
            game.context.clearRect(0,0,game.width,game.height);
            Player.plane.position  = new Position(game.width/2,game.height-100);
            Player.plane.drawImg(game.context);
            game.context.font = "30px Courier New";
            game.context.fillStyle = "#333";
            game.context.textAlign = 'center';
            game.context.fillText("Game Over",game.width/2,game.height/2);
            game.pause = true;
        },
        init: function (config) {
            var game = this;

            var startTime = new Date().getTime();

            var defer = $.Deferred();

            game.warehouse = Warehouse;

            game.getConfig(config);

            global.init({
                canvasId: config.canvasId
            });

            Warehouse
                .init(game.src)
                .then(function (  ) {
                    Screen.init();
                })
                .then(function (  ) {
                    Player.init({
                        plane: Warehouse.getPlaneByType(1)
                    });
                })
                .then(function (  ) {
                    sound.init({
                        backgroundAudio: Warehouse.getAudioByName('backgroundMusic')
                    });
                })
                .then(function (  ) {
                    //if all the image and audio load is done ,the game's init is completed
                    var interval = window.setInterval(function (  ) {
                        if(global.notLoadedImgCount == 0
                        && global.notLoadedAudioCount == 0){
                            window.clearInterval(interval);
                            console.log('all resource is loaded! cost '+(new Date().getTime()-startTime)+' ms');
                            defer.resolve();
                        }
                    }, 200);
                });

            return defer;
        }
    };

    return new PlaneGame();

});