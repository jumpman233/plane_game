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
'global'], function ( jquery, util, Position,Screen, Warehouse, Player, GameEventHandler, global ) {
    'use strict';

    function PlaneGame(params) {
        this.bulletList = [];
        this.player = null;
        this.geh = null;
        this.frameNum = 0;
        this.warehouse = null;
        this.pause = false;
        this.playing = false;
        this.position = 0;
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
        initPlayer: function () {
            var game = this;
            var warehouse = game.warehouse;
            game.player = new Player();
            game.player.score = 0;
            game.player.maxLife = 3;
            game.player.curLife = game.player.maxLife;
            game.geh = new GameEventHandler({
                target: game.canvasElement
            });

            var player = game.player;
            var geh = game.geh;

            player.plane = warehouse.getPlaneByType(1);
            player.plane.curBullet = 0;
            player.plane.role = 'player';

            geh.mouseMove(function (e) {
                player.plane.position = util.getEventPosition(e);
            });
            geh.keydown(function ( e ) {
                if(e.keyCode == 27 && game.playing){
                    if(!game.pause){
                        game.pause = true;
                        game.pauseMenu();
                    } else{
                        game.resume();
                        game.removeAllOptions();
                    }
                }
            });
        },
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
            Screen.drawMenuOption('Start Game', width/2,height/2,startGameFunc);
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
        draw: function (planeList,toolList,missileList) {
            var game = this;
            game.context.clearRect(0,0,game.width,game.height);

            Screen.drawFightBk();
            Screen.drawScore(game.player.score);
            Screen.drawLife(game.player.curLife);

            game.player.plane.draw(game.context);

            for(var i in game.bulletList){
                game.bulletList[i].draw(game.context);
                game.bulletList[i].move(game.context);
            }

            for (var i in planeList){
                planeList[i].draw(game.context, game.frameNum);
                planeList[i].move();
            }

            for (var i in toolList){
                toolList[i].draw(game.context);
            }

            for(var i in missileList){
                missileList[i].draw(game.context);
                missileList[i].move();
            }
        },
        testAllModules: function () {
            var game = this;
            var warehouse = game.warehouse;
            var bulletList = warehouse.getBulletTypeList();
            var planeList = warehouse.getPlaneTypeList();
            game.ifInit(function () {
                var x = 0;
                var y = 0;
                game.context.beginPath();
                for(var i in planeList){
                    planeList[i].position.x = x;
                    planeList[i].position.y = y;
                    game.drawImage(planeList[i]);
                    x += planeList[i].width / 2 + 30;
                    if (x>=500){
                        y+=100;
                    }
                }
                for(var i in bulletList){
                    bulletList[i].position.x = x;
                    bulletList[i].position.y = y;
                    game.drawImage(bulletList[i]);
                    x += bulletList[i].width / 2 + 30;
                    if (x>=500){
                        y+=100;
                    }
                }
                game.context.closePath();
            });
        },
        planeListCheck: function (list) {
            for(var i in list){
                var plane = list[i];
                if(plane.canDestroy){
                    list.splice(i,1);
                }
            }
        },
        dirtyCheck: function (list) {
            var game = this;
            if(list[0] && list[0].className == 'missile'){
                for(var i in list){
                    var obj  = list[i];
                    var x = list[i].position.x + list[i].width / 2;
                    var y = list[i].position.y + list[i].height / 2;
                    if((x - obj.width / 2 - game.width > 0       ||
                        x + obj.width / 2 < 0                   ||
                        y - obj.height / 2 - game.height > 0    ||
                        y + obj.height / 2 < 0                  )&&
                        obj.restFollow<=0){
                        list.splice(i,1);
                    }
                }
            } else{
                for(var i in list){
                    var obj  = list[i];
                    var x = list[i].position.x + list[i].width / 2;
                    var y = list[i].position.y + list[i].height / 2;
                    if(x - obj.width / 2 - game.width > 0       ||
                        x + obj.width / 2 < 0                   ||
                        y - obj.height / 2 - game.height > 0    ||
                        y + obj.height / 2 < 0){
                        list.splice(i,1);
                    }
                }
            }
        },
        test1: function () {
            var game = this;
            var warehouse = game.warehouse;
            var context = game.context;
            var time = 0;
            var planeList = [];
            var toolList = [];
            var missileList = [];
            game.position = 0;
            game.playing = true;
            game.pause = false;
            if(game.backgroundAudio){
                game.backgroundAudio.pause();
            }
            game.backgroundAudio = util.playAudio({
                src: "audio/game_music.mp3",
                loop: true
            });
            game.ifInit(function () {
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
                        planeList.push(plane);
                    }
                    if(Math.random() < 1 / fps / 10){
                        var missile = warehouse.getMissileByType(1);
                        missile.position.x = x;
                        missile.position.y = 0;
                        missile.position.direction = 180;
                        missile.target = game.player.plane;
                        missileList.push(missile);
                    }

                    game.draw(planeList,toolList,missileList);

                    game.judge(planeList,toolList,missileList);

                    game.dirtyCheck(game.bulletList);
                    game.dirtyCheck(planeList);
                    game.dirtyCheck(toolList);
                    game.dirtyCheck(missileList);

                    game.planeListCheck(planeList);

                },game.frameTime);
            });
        },
        drawFightBk: function () {
            var game = this;
            var ctx = game.context;
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
        //do some check just like collision test
        judge: function (planeList,toolList,missileList) {
            var game = this;

            //check if player has collision with tools
            for(var i in toolList){
                var tool = toolList[i];
                if(util.collisionTest(game.player.plane,tool)){
                    game.player.getTool(tool);
                    toolList.splice(i,1);
                }
            }

            //check if player's bullets have collision with enemies
            //if true, it's possible to appear a tool
            //check if enemies have collision with player's plane
            //if true, player's life will be reduced

            for(var i in planeList){
                var plane = planeList[i];
                for (var j in game.bulletList){
                    var bullet = game.bulletList[j];
                    if(bullet.parent != plane &&
                        bullet.parent.role != plane.role &&
                        util.collisionTest(plane,bullet)){

                        plane.getShot(bullet);
                        if(plane.isDead){
                            var newTool = game.createTool(plane,game.fps);
                            if(newTool){
                                toolList.push(newTool);
                            }
                            game.player.score += plane.score;
                        }
                        game.bulletList.splice(j,1);
                        break;
                    }
                }
                if(plane && util.collisionTest(plane,game.player.plane)){
                    planeList.splice(i,1);
                    game.bulletList.splice(i,1);
                    game.player.curLife--;
                }
            }
            //check if enemies' bullets have collision with player's plane
            for(var i in game.bulletList){
                if(util.collisionTest(game.player.plane,game.bulletList[i])&&
                    game.bulletList[i].parent != game.player.plane){
                    game.bulletList.splice(i,1);
                    game.player.curLife--;
                }
            }
            for(var i in missileList){
                if(util.collisionTest(game.player.plane,missileList[i])){
                    missileList.splice(i,1);
                    game.player.curLife--;
                }
            }
            if(game.player.curLife == 0){
                game.gameOver();
            }
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
            game.player.plane.position  = new Position(game.width/2,game.height-100);
            game.player.plane.drawImg(game.context);
            game.context.font = "30px Courier New";
            game.context.fillStyle = "#333";
            game.context.textAlign = 'center';
            game.context.fillText("Game Over",game.width/2,game.height/2);
            game.pause = true;
        },
        init: function (config) {
            var game = this;

            var defer = $.Deferred();
            addSoundChangeEvent(function (  ) {
                if(game.backgroundAudio){
                    game.backgroundAudio.volume = util.getCurSound();
                }
            });

            game.warehouse = Warehouse;

            game.getConfig(config);
            Warehouse
                .init(game.src)
                .then(function (  ) {
                    Screen.init({
                        canvasElement: game.canvasElement,
                        context: game.context
                    });
                })
                .then(function (  ) {
                    game.initPlayer();
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

    $('#soundImg').click(function () {
        if($('#soundSlider').attr('display') == 'false'){
            $('#soundSlider').attr('display', 'true');
            $('#soundSlider').css('display','inline-block');
            $('#sound').css('left','780px');
        } else{
            $('#soundSlider').attr('display', 'false');
            $('#soundSlider').css('display','none');
            $('#sound').css('left','884px');
        }
    });

    function addSoundChangeEvent(func) {
        if(typeof func == 'function'){
            $('#soundSlider').change(func);
        }
    }

    return new PlaneGame();

});