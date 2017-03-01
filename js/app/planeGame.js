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
'sound'], function ( jquery, util, Position,Screen, Warehouse, Player, GameEventHandler, global, dataManager ,sound) {
    'use strict';

    function PlaneGame(params) {
        this.bulletList = [];
        this.player = null;
        this.geh = null;
        this.frameNum = 0;
        this.warehouse = null;
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
            this.frameTime = 1000 / this.fps;
        } else{
            this.fps = 50;
            this.frameTime = 1000 / this.fps;
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
                this.frameTime = 1000 / this.fps;
            } else{
                this.fps = 50;
                this.frameTime = 1000 / this.fps;
            }
            defer.resolve();
            return defer;
        },
        mainMenu:function () {
            var game = this;
            var context = game.context;
            var width = context.canvas.width;
            var height = context.canvas.height;
            game.playing = false;

            var startGameFunc = function (  ) {
                game.playing = true;
                $('#'+game.canvasElement.id).css('cursor','none');
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
            $('#'+game.canvasElement.id).css('cursor','none');
        },
        start: function () {
            var game = this;

            game.mainMenu();
        },
        test1: function () {
            var game = this;
            var warehouse = game.warehouse;
            var time = 0;
            game.playing = true;
            game.pause = false;
            if(game.backgroundAudio){
                game.backgroundAudio.pause();
            }
            game.backgroundAudio = util.playAudio({
                src: "audio/game_music.mp3",
                loop: true
            });
            game.gaming = window.setInterval(function () {
                if(game.pause){
                    return;
                }

                time += game.frameTime;
                game.frameNum++;

                var x = Math.random()*game.context.canvas.width;
                if(Math.random() < 1 / fps / 2){
                    var plane = warehouse.getPlaneByType(2);
                    plane.shootTime = plane.shootRate;
                    plane.position.x = x;
                    plane.position.y = 0;
                    plane.direction = 180;
                    plane.role = 'enemy';
                    plane.canShoot = true;
                    plane.bulletStyle = warehouse.getBulletStyleByType(2);
                    plane.curBullet = 0;
                    dataManager.resolvePlane(plane);
                }
                if(Math.random() < 1 / fps / 10){
                    var missile = warehouse.getMissileByType(1);
                    missile.position.x = x;
                    missile.position.y = 0;
                    missile.position.direction = 180;
                    missile.target = Player.plane;
                    dataManager.resolveMissile(missile);
                }

                Screen.draw();

                dataManager.judge(function ( dea ) {
                    console.log("dead!");
                    console.log(dea);
                },function (  ) {
                    game.gameOver();
                });
            },game.frameTime);
        },
        createTool: function (plane,fps) {
            var game = this;
            var warehouse = game.warehouse;
            var allWeight = 0;
            var position = plane.position;

            var rand = Math.random();
            if(rand>plane.toolDrop){
                return;
            }

            for(var i in warehouse.toolList){
                var tool = warehouse.toolList[i];
                allWeight += tool.weight;
            }
            rand = Math.random() * allWeight;
            for(var i in warehouse.toolList){
                var tool = warehouse.toolList[i];
                rand -= tool.weight;
                if(rand<=0){
                    var newTool = util.copy(tool);
                    newTool.init();
                    newTool.extraTime = fps * newTool.existTime;
                    newTool.position = util.copy(position);
                    return newTool;
                }
            }
        },
        gameOver: function () {
            var game = this;

            game.backgroundAudio.pause();
            game.bulletList.splice(0,game.bulletList.length);
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

            var defer = $.Deferred();
            sound.addSoundChangeEvent(function (  ) {
                if(game.backgroundAudio){
                    game.backgroundAudio.volume = util.getCurSound();
                }
            });

            game.warehouse = Warehouse;

            game.getConfig(config);

            global.init({
                canvasId: config.canvasId
            });

            Warehouse
                .init(game.src)
                .then(function (  ) {
                    Screen.init({
                        canvasElement: game.canvasElement,
                        context: game.context
                    });
                })
                .then(function (  ) {
                    Player.init({
                        plane: Warehouse.getPlaneByType(1)
                    });
                })
                .then(function (  ) {
                })
                .then(function (  ) {
                    //if all the image and audio load is done ,the game's init is completed
                    var interval = window.setInterval(function (  ) {
                        if(global.notLoadedImgCount == 0
                        && global.notLoadedAudioCount == 0){
                            window.clearInterval(interval);
                            defer.resolve();
                        }
                    }, 200);
                });

            return defer;
        }
    };

    return new PlaneGame();

});