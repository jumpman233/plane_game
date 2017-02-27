/**
 * created by lzh at 2017/1/11
 */

/**
 * FPS: the canvas repaint time per second
 * speed: the object move distance per second(px)
 *
 */


(function () {
    'use strict';

    var fps = 50;
    /**
     * GameUtil
     */
    function GameUtil(){

    }
    GameUtil.prototype = {
        initImage: function(params){
            var image = new Image();
            image.height = params.height;
            image.width = params.width;
            image.src = params.src;
            image.onload = params.onload;
            return image;
        },
        copy: function (obj) {
            var util = this;

            if(obj == undefined) return;
            if(Array.isArray(obj) && obj) {
                var list = [];
                for(var i in obj){
                    list.push(util.copy(obj[i]));
                }
                return list;
            } else if(typeof obj == 'object'){
                var newObj = new Object();
                for(var i in obj){
                    if(obj[i] instanceof Image || obj[i] == Object.getPrototypeOf(obj)[i]){
                        newObj[i] = obj[i];
                    } else{
                        newObj[i] = util.copy(obj[i]);
                    }
                }
                return newObj;
            }
            else {
                return obj;
            }

        },
        collisionTest: function (obj1, obj2) {
            if(obj1.position && obj1.width && obj1.height &&
                obj2.position && obj2.width && obj2.height){
                return Math.abs(obj2.position.x - obj1.position.x) < (obj1.width + obj2.width) / 2 &&
                    Math.abs(obj2.position.y - obj1.position.y) < (obj1.height + obj2.height) / 2
            } else{
                throw Error('GameUtil collisionTest(): params is not right! ');
            }
        },
        getEventPosition: function (e) {
            if(undefined == e){
                return;
            }
            if(e.layerX || e.layerX == 0){
                return new Position(e.layerX,e.layerY);
            }  else if(e.offsetX || e.offsetX == 0){
                return new Position(e.offsetX,e.offsetY);
            }
        },
        checkInRect: function ( pos, rectX, rectY, rectW, rectH ) {
            return pos.x <= rectX+ rectW && pos.x >= rectX &&
                    pos.y >= rectY && pos.y <= rectY + rectH;
        },
        sleep: function (duration) {
            var start = new Date();
            while(true){
                var time = new Date();
                if(time.getTime()-start.getTime() > duration){
                    break;
                }
            }
        },
        then: function(){

        },
        playAudio: function (params) {
            if(!params.src){
                throw Error("playAudio lack of param src!");
            }
            var audio = new Audio(params.src);
            if(params.loop){
                audio.loop = true;
            }
            audio.volume = getCurSound();
            audio.play();
            return audio;
        }
    };
    var $util = new GameUtil();

    /**
     * GameTime
     * manage the game time
     */
    function GameTime(){
        this.curTime = 0;

    }
    GameTime.prototype = {
        constructor: GameTime
    };

    /**
     * Position
     * mark a coordinate
     * attributes:
     x: number
     y: number
     */
    function Position(x, y) {
        this.x = x;
        this.y = y;
    }

    Position.prototype = {
        className: "position",
        constructor: Position,
        calDis: function (sta,des) {
            if(undefined === sta.x  && undefined === sta.y){
                throw Error("calDis(): sta is not Position type!");
            }
            if(undefined !== des && undefined === des.x && undefined === des.y){
                throw Error("calDis(): des is not Position type!");
            }
            if(undefined === des){
                des = this.position;
            }
            var dp = this.calDif(sta, des);
            return Math.sqrt(Math.pow(dp.x, 2) + Math.pow(dp.y, 2));
        },
        calDif: function (sta,des) {
            if(undefined === sta.x  && undefined === sta.y){
                throw Error("calDis(): sta is not Position type!");
            }
            if(undefined !== des && undefined === des.x && undefined === des.y){
                throw Error("calDis(): des is not Position type!");
            }
            if(undefined === des){
                des = this.position;
            }
            return new Position(des.x - sta.x, des.y - sta.y);
        },
        includeAng: function (sta, des, dir) {
            if(undefined === sta.x  && undefined === sta.y){
                throw Error("calDis(): sta is not Position type!");
            }
            if(undefined !== des && undefined === des.x && undefined === des.y){
                throw Error("calDis(): des is not Position type!");
            }
            if(undefined === des){
                des = this.position;
            }
            var dp = this.calDif(sta, des);
            var dis = this.calDis(sta, des);
            var inAng = 0;
            if(sta.y >= des.y && sta.x <= des.x){
                var sin = Math.abs(dp.x / dis);
                inAng = Math.asin(sin) * 180 / Math.PI;
            } else if(sta.y < des.y && sta.x <= des.x){
                var sin = Math.abs(dp.y / dis);
                inAng = Math.asin(sin) / Math.PI * 180 + 90;
            } else if(sta.y <= des.y && sta.x >= des.x){
                var sin = Math.abs(dp.x / dis);
                inAng = Math.asin(sin) / Math.PI * 180 + 180;
            } else if(sta.y >= des.y && sta.x >= des.x){
                var sin = Math.abs(dp.y / dis);
                inAng = Math.asin(sin) / Math.PI * 180 + 270;
            }
            return inAng-dir;
        }
    };

    /**
     * FlyObject
     * a basic class of fly object
     * parent of class 'plane' and 'bullet'
     * attributes:
     position:    position
     speed:        number
     imgSrc:    string
     rotate:    string
     */
    function FlyObject(params) {
        if (!params) return;

        if(params.width){
            this.width = params.width;
        } else {
            this.width = 10;
        }
        if(params.height){
            this.height = params.height;
        } else{
            this.height = 10;
        }


        if(this instanceof Plane){
            console.log(params);
        }
        if (params.x && params.y) {
            this.position = new Position(
                params.x + this.width / 2,
                params.y + this.height / 2);
        } else {
            this.position = new Position(0, 0);
        }
        if (params.speed) {
            this.speed = params.speed;
        } else {
            this.speed = 10;
        }
        if (params.img) {
            this.img = params.img;
        }
        if (params.src) {
            this.src = params.src;
        }
        if (params.direction!=null) {
            this.direction = params.direction;
        }
        if (params.deadImg){
            this.deadImg = params.deadImg;
        }
        if (params.deadSrc) {
            this.deadSrc = params.deadSrc;
        }
        if (params.target) {
            this.target = params.target;
        }
        if (params.maxRotate) {
            this.maxRotate = params.maxRotate;
        } else{
            this.maxRotate = 5;
        }
        this.isInit = false;
    }

    FlyObject.prototype = {
        className: 'flyObject',
        constructor: FlyObject,
        context: null,
        loadImg: function () {
            var obj = this;
            obj.img = $util.initImage({
                width: obj.width,
                height: obj.height,
                src: obj.src,
                onload: function () {
                    obj.isInit = true;
                }
            });
        },
        // if img is null, the obj's img param will be used
        drawImg: function (ctx,img) {
            var obj = this;
            var drawImg = null;
            if(img instanceof Image){
                drawImg = img;
            } else{
                drawImg = obj.img;
            }
            ctx.save();
            ctx.translate(obj.position.x, obj.position.y);
            ctx.rotate(obj.direction/180*Math.PI);
            ctx.drawImage(drawImg, - obj.width/2, - obj.height/2, obj.width, obj.height);
            ctx.restore();
        },
        move: function () {
            var obj = this;
            obj.position.y -= obj.speed * Math.cos(obj.direction / 360 * Math.PI * 2);
            obj.position.x += obj.speed * Math.sin(obj.direction / 360 * Math.PI * 2);
        },
        moveToTarget: function () {
            var obj = this;
            if(obj.hasOwnProperty("target") && obj.target.hasOwnProperty("position")){
                var targetPos = obj.target.position;
                var pos = obj.position;
                var includeAng = Position.prototype.includeAng(pos, targetPos, obj.direction);
                if(Math.abs(includeAng) <= obj.maxRotate){
                    obj.direction += includeAng;
                } else{
                    if((includeAng < 0 && includeAng > -180) || includeAng>180){
                        obj.direction -= obj.maxRotate;
                        if(obj.direction < 0){
                            obj.direction = 360 + obj.direction;
                        }
                    } else{
                        obj.direction += obj.maxRotate;
                        if(obj.direction >= 360){
                            obj.direction -= 360;
                        }
                    }
                }

                obj.position.y -= obj.speed * Math.cos(obj.direction / 180 * Math.PI);
                obj.position.x += obj.speed * Math.sin(obj.direction / 180 * Math.PI);
            }
        }
    };

    /**
     * Missile
     * a object which can follow a target
     * params:
     * maxFollow: the seconds of following time
     * restFollow: rest time of time
     */
    function Missile(params) {
        if(!params) return;

        FlyObject.apply(this, arguments);
        if(params.maxFollow){
            this.maxFollow = params.maxFollow;
        }
        if(params.type){
            this.type = params.type;
        }
        // if there is no global variable called fps, it will create a default fps to build variable restFollow
        if(undefined !== fps){
            fps = 50;
        }
        this.restFollow = this.maxFollow ? this.maxFollow * fps : 5 * fps;
        console.log(this.restFollow);
    }
    Missile.prototype = $util.copy(FlyObject.prototype);
    Missile.prototype.className = "missile";
    Missile.prototype.constructor = Missile;
    Missile.prototype.draw = function (ctx) {
        this.drawImg(ctx,this.img);
    };
    Missile.prototype.move = function () {
        var missile = this;
        if(missile.restFollow <= 0){
            FlyObject.prototype.move.call(missile);
        } else{
            FlyObject.prototype.moveToTarget.call(missile);
        }
        missile.restFollow--;
    };

    /**
     * plane
     * object can shoot
     * child of class 'flyObject'
     * attributes:
     position:    position
     speed:        number
     imgSrc:    string
     rotate:    string
     type:        number
     maxHp:        number
     */
    function Plane(params) {
        if (!params) return;

        FlyObject.apply(this, arguments);
        if (params.type) {
            this.type = params.type;
        }
        if(params.shootRate){
            this.shootRate = params.shootRate;
            this.shootTime = this.shootRate;
        }
        if(params.bulletType){
            this.bulletType = params.bulletType;
        }
        if(params.role){
            this.role = params.role;
        }
        if(params.canShoot){
            this.canShoot = params.canShoot;
        }
        if(params.curBullet){
            this.curBullet = params.curBullet;
        }
        if(params.hp){
            this.hp = params.hp;
        }
        if(undefined != params.score){
            this.score = params.score;
        } else{
            this.score = 1;
        }
        if(params.toolDrop){
            this.toolDrop = params.toolDrop;
        }
        if(params.deadAudioSrc){
            this.deadAudioSrc = params.deadAudioSrc;
        }
        this.bulletList = [];
        this.isDead = false;
        this.animateSave = 0;
        this.canDestroy = false;
    }

    Plane.prototype = $util.copy(FlyObject.prototype);
    Plane.prototype.constructor = Plane;
    Plane.prototype.className = 'plane';
    Plane.prototype.loadImg = function () {
        var obj = this;
        obj.img = $util.initImage({
            width: obj.width,
            height: obj.height,
            src: obj.src,
            onload: function () {
                obj.isInit = true;
            }
        });
        obj.deadImg = $util.initImage({
            width: obj.width,
            height: obj.height,
            src: obj.deadSrc,
            onload: function () {
                obj.isInit = true;
            }
        });
    };
    Plane.prototype.drawPlane = function (ctx) {
        var plane = this;
        if(!plane.isDead){
            plane.drawImg(ctx,plane.img);
        } else{
            plane.animateSave--;
            if(plane.animateSave <= 0){
                plane.canDestroy = true;
            }
            plane.drawImg(ctx,plane.deadImg);
        }
    };
    // if the plane's hp <= 0, func will return true, else return false
    Plane.prototype.getShot = function (bullet) {
        var plane = this;
        if(plane.role == "enemy"){
            plane.hp -= bullet.damage;
            if(plane.hp<=0){
                plane.isDead = true;
                plane.animateSave = 5;
                $util.playAudio({
                    src: plane.deadAudioSrc
                });
            }
        }
    };
    Plane.prototype.move = function () {
        var plane = this;
        if(!plane.isDead && plane.target && plane.target.hasOwnProperty("position")){
            FlyObject.prototype.moveToTarget.call(plane);
        } else if(!plane.isDead){
            FlyObject.prototype.move.call(plane);
        }
    };

    Plane.prototype.draw = function (ctx) {
        var plane = this;
        plane.drawPlane(ctx);

        if(plane.shootTime-- == 0 && plane.canShoot && plane.curBullet != undefined){
            var bulList = plane.bulletStyle.getBullets(plane.curBullet);
            for (var i = 0 ;i<bulList.length;i++){
                bulList[i].position = $util.copy(plane.position);
                bulList[i].parent = plane;
                bulList[i].direction = bulList[i].direction + bulList[i].parent.direction;
                bulList[i].move(ctx);
                bulList[i].move(ctx);
                $game.bulletList.push(bulList[i]);
                plane.shootTime = plane.shootRate;
            }
            if(plane.bulletStyle.audioSrc){
                $util.playAudio({
                    src: plane.bulletStyle.audioSrc
                })
            }
        }
    };

    /**
     * bullet
     * object can be shot
     * child of class 'flyObject'
     * attributes:
     position:    position
     speed:        number
     imgSrc:    string
     rotate:    string
     type:        number
     damage:    number
     */
    function Bullet(params) {
        if (!params) return;

        FlyObject.apply(this, arguments);
        if (params.type) {
            this.type = params.type;
        }
        if (params.damage) {
            this.damage = params.damage;
        }
        this.parent = null;
    }

    Bullet.prototype = $util.copy(FlyObject.prototype);
    Bullet.prototype.constructor = Bullet;
    Bullet.prototype.className = 'bullet';
    Bullet.prototype.draw = function (ctx) {
        this.drawImg(ctx);
    };
    Bullet.prototype.move = function () {
        var bullet = this;
        bullet.position.y -= bullet.speed * Math.cos((bullet.direction) / 360 * Math.PI * 2);
        bullet.position.x += bullet.speed * Math.sin((bullet.direction) / 360 * Math.PI * 2);
    };

    /**
     * class Item
     * static image
     * @param params
     * @constructor
     */
    function Item(params) {
        if(!params) return;

        if(params.width){
            this.width = params.width;
        }
        if(params.height){
            this.height = params.height;
        }
        if(params.src){
            this.src = params.src;
        }
        if(params.name){
            this.name = params.name;
        }
        this.img = null;
        this.isInit = false;
    }
    Item.prototype = {
        loadImg: function () {
            var obj = this;
            obj.img = $util.initImage({
                width: obj.width,
                height: obj.height,
                src: obj.src,
                onload: function () {
                    obj.isInit = true;
                }
            });
        }
    };

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

            obj.img = $util.initImage({
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

    function BulletStyle(params){
        if(!params) return;

        if(params.type){
            this.type = params.type;
        }
        if(params.style){
            this.style = params.style;
        }
        if (params.audioSrc){
            this.audioSrc = params.audioSrc;
        }
    }
    BulletStyle.prototype = {
        constructor: BulletStyle,
        getBullets: function (index) {
            var style = this.style[index];
            var list = [];
            for(var i in style){
                list.push($util.copy(style[i].bullet));
            }
            return list;
        }
    };

    function PlaneGame(params) {
        if (!params) return;

        if (params.backgroundSrc) {
            planeGame.backgroundSrc = params.backgroundSrc;
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
        this.bulletList = [];
        this.isInit = false;
        this.player = null;
        this.geh = null;
        this.frameNum = 0;
        this.warehouse = null;
        this.pause = false;
        this.playing = false;
        this.position = 0;
        this.backgoundImg = null;
        this.backgroundAudio = null;
        this.optWidth = 200;
        this.optHeight = 30;
        this.optFont = 16;
        this.optionsFunc = []; //use to remove elements
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
                player.plane.position = $util.getEventPosition(e);
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
        removeAllOptions: function (  ) {
            var game = this;
            for(var i in game.optionsFunc){
                var func = game.optionsFunc[i];
                game.canvasElement.removeEventListener(func.type,func);
            }
        },
        drawMenuOption: function ( name, x, y, callback ) {
            var game = this;
            var context = game.context;
            var rectX = x - game.optWidth/2;
            var rectY = y - game.optHeight/2-5;
            context.strokeRect(rectX, rectY, game.optWidth, game.optHeight);
            context.font = game.optFont + "px Georgia";
            context.fillText(name, x, y);
            var menuMouseMove = function (event) {
                var pos = $util.getEventPosition(event);
                // console.log($('#'+game.canvasElement.id));
                if($util.checkInRect(pos, rectX, rectY, game.optWidth, game.optHeight)){
                    $('#'+game.canvasElement.id).css('cursor','pointer');
                } else{
                    $('#'+game.canvasElement.id).css('cursor','default');
                }
            };
            var menuMouseDown = function ( event ) {
                var pos = $util.getEventPosition(event);
                if($util.checkInRect(pos, rectX, rectY, game.optWidth, game.optHeight)){
                    game.canvasElement.removeEventListener('mousemove',menuMouseMove);
                    game.canvasElement.removeEventListener('mousedown',menuMouseDown);
                    for(var i in game.optionsFunc){
                        var func = game.optionsFunc[i];
                        if(func == menuMouseDown || func == menuMouseMove){
                            game.optionsFunc.splice(i,1);
                        }
                    }
                    callback();
                }
            };
            menuMouseDown.type = 'mousedown';
            menuMouseMove.type = 'mousemove';
            game.optionsFunc.push(menuMouseDown);
            game.optionsFunc.push(menuMouseMove);
            game.canvasElement.addEventListener('mousemove',menuMouseMove,false);
            game.canvasElement.addEventListener('mousedown', menuMouseDown, false);
        },
        mainMenu:function () {
            var game = this;
            var context = game.context;
            var width = context.canvas.width;
            var height = context.canvas.height;

            var startGameFunc = function (  ) {
                $('#'+game.canvasElement.id).css('cursor','none');
                game.test1();
            };

            context.font = "20px Georgia";
            context.textAlign = 'center';
            context.fillText("Fight In Sky",width/2,height/2-100);
            game.drawMenuOption('Start Game', width/2,height/2,startGameFunc);
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
                game.resume.call(game);
            };
            game.drawMenuOption('Resume', width/2, height/2, resumeFunc);
        },
        resume: function (  ) {
            var game = this;
            game.pause = false;
            $('#'+game.canvasElement.id).css('cursor','none');
        },
        start: function () {
            var game = this;
            game.ifInit(function () {
                game.mainMenu();
            })
        },
        draw: function (planeList,toolList,missileList) {
            var game = this;
            game.context.clearRect(0,0,game.width,game.height);

            game.drawFightBk();
            game.drawScore();
            game.drawLife();

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
            game.backgroundAudio = $util.playAudio({
                src: "audio/game_music.mp3",
                loop: true
            });
            game.backgoundImg = warehouse.getItemByName("background");
            game.ifInit(function () {
                window.setInterval(function () {
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
            ctx.drawImage(game.backgoundImg.img,0, -ctx.canvas.height*2+game.position,ctx.canvas.width,ctx.canvas.height*2);
            ctx.drawImage(game.backgoundImg.img,0, -ctx.canvas.height*4+game.position,ctx.canvas.width,ctx.canvas.height*2);
            ctx.drawImage(game.backgoundImg.img,0, game.position,ctx.canvas.width,ctx.canvas.height*2);

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
                if($util.collisionTest(game.player.plane,tool)){
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
                        $util.collisionTest(plane,bullet)){

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
                if(plane && $util.collisionTest(plane,game.player.plane)){
                    planeList.splice(i,1);
                    game.bulletList.splice(i,1);
                    game.player.curLife--;
                }
            }
            //check if enemies' bullets have collision with player's plane
            for(var i in game.bulletList){
                if($util.collisionTest(game.player.plane,game.bulletList[i])&&
                    game.bulletList[i].parent != game.player.plane){
                    game.bulletList.splice(i,1);
                    game.player.curLife--;
                }
            }
            for(var i in missileList){
                if($util.collisionTest(game.player.plane,missileList[i])){
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
                    var newTool = $util.copy(tool);
                    newTool.init();
                    newTool.extraTime = fps * newTool.existTime;
                    newTool.position = $util.copy(position);
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
        randomMode: function () {

        },
        createEnermy: function (type) {
            var game = this;
            return warehouse.getPlaneByType(type);
        },
        checkInit: function () {
            var game = this;
            var warehouse = game.warehouse;
            var bulletDataList = warehouse.getBulletTypeList();
            var planeDataList = warehouse.getPlaneTypeList();
            if(game.isInit) return true;

            var flag = true;
            for(var i in bulletDataList){
                if(!bulletDataList[i].isInit){
                    flag = false;
                }
            }
            for(var i in planeDataList){
                if(!planeDataList[i].isInit){
                    flag = false;
                }
            }
            return flag;
        },
        ifInit: function (callback) {
            var game = this;
            if(game.isInit){
                callback();
            } else{
                var interval = window.setInterval(function () {
                    if(game.isInit){
                        window.clearTimeout(interval);
                        callback();
                    } else{
                        game.isInit = game.checkInit();
                    }
                },100,0);
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
        drawLife: function () {
            var game = this;

            var lifeItem = game.warehouse.getItemByName("life");
            var pos = new Position(0,game.context.canvas.height - lifeItem.height);
            for(var i = 0; i < game.player.curLife; i++){
                game.drawImage({
                    img: lifeItem.img,
                    height: lifeItem.height,
                    width: lifeItem.width,
                    position: pos
                });
                pos.x += lifeItem.width;
            }
        },
        drawScore: function () {
            var game = this;
            var context = game.context;
            context.font = "16px Georgia";
            context.textAlign = 'left';
            context.fillText("Score: " + game.player.score,10,20);
        },
        init: function () {
            var game = this;

            addSoundChangeEvent(function (  ) {
                if(game.backgroundAudio){
                    game.backgroundAudio.volume = getCurSound();
                }
            });

            game.warehouse = new Warehouse();
            game.warehouse.init(game.src);
            console.log(game.warehouse);

            game.initPlayer();
        }
    };

    function Warehouse() {
        this.bulletTypeList = [];
        this.planeTypeList = [];
        this.bulletStyleList = [];
        this.bulletList = [];
        this.itemList = [];
        this.toolList = [];
        this.missileList = [];
    }
    Warehouse.prototype = {
        constructor: Warehouse,
        getBulletTypeList: function () {
            return $util.copy(this.bulletTypeList);
        },
        getPlaneTypeList: function () {
            return $util.copy(this.planeTypeList);
        },
        getBulletStyleList: function () {
            return $util.copy(this.bulletStyleList);
        },
        getBulletByType: function (type) {
            var warehouse = this;
            var list = warehouse.bulletTypeList;
            for(var i in list){
                if(list[i].type == type){
                    return $util.copy(list[i]);
                }
            }
        },
        getMissileByType: function (type) {
            var warehouse = this;
            var list = warehouse.missileList;
            for(var i in list){
                if(list[i].type == type){
                    return $util.copy(list[i]);
                }
            }
        },
        getPlaneByType: function (type) {
            var warehouse = this;
            var list = warehouse.planeTypeList;
            for(var i in list){
                if(list[i].type == type){
                    return $util.copy(list[i]);
                }
            }
        },
        getBulletStyleByType: function (type) {
            var warehouse = this;
            var list = warehouse.bulletStyleList;
            for(var i in list){
                if(list[i].type == type){
                    return $util.copy(list[i]);
                }
            }
        },
        initBullet: function (bullet) {
            bullet.loadImg();
        },
        initBulletStyle: function (bulletStyle) {
            var warehouse = this;
            for(var i in bulletStyle.style){
                var styles = bulletStyle.style[i];
                for(var j in styles){
                    var style = styles[j];
                    style.bullet = warehouse.getBulletByType(style.type);
                    style.bullet.direction = style.direction;
                    style.bullet.speed = style.speed;
                }
            }

        },
        initPlane: function (plane) {
            var warehouse = this;
            plane.bulletStyle = warehouse.getBulletStyleByType(plane.bulletType);
            plane.loadImg();
        },
        initBulletData: function (src) {
            var warehouse = this;

            warehouse.getData(src,function (data) {
               warehouse.bulletTypeList = [];
               for(var i in data){
                   warehouse.bulletTypeList.push(new Bullet(data[i]));
               }
            });

            for(var i in warehouse.bulletTypeList){
                warehouse.initBullet(warehouse.bulletTypeList[i]);
            }
        },
        initBulletStyleData: function (src) {
            var warehouse = this;

            warehouse.getData(src,function (data) {
                warehouse.bulletStyleList = [];
                for(var i in data){
                    warehouse.bulletStyleList.push(new BulletStyle(data[i]));
                }
            });

            for(var i in warehouse.bulletStyleList){
                warehouse.initBulletStyle(warehouse.bulletStyleList[i]);
            }
        },
        initPlaneData: function (src) {
            var warehouse = this;

            warehouse.getData(src,function (data) {
               warehouse.planeTypeList = [];
               for (var i in data){
                   warehouse.planeTypeList.push(new Plane(data[i]));
               }
            });

            for(var i in warehouse.planeTypeList){
                warehouse.initPlane(warehouse.planeTypeList[i]);
            }
        },
        initItem: function(src){
            var warehouse = this;

            warehouse.getData(src,function (data) {
                for(var i in data){
                    warehouse.itemList.push(new Item(data[i]));
                }
            });

            for(var i in warehouse.itemList){
                warehouse.itemList[i].loadImg();
            }
        },
        initTool: function (src) {
            var warehouse = this;

            warehouse.getData(src,function (data) {
                for(var i in data){
                    warehouse.toolList.push(new Tool(data[i]));
                }
            });

            for(var i in warehouse.toolList){
                warehouse.toolList[i].loadImg();
            }
        },
        initMissile: function (src) {
            var warehouse = this;

            warehouse.getData(src,function (data) {
                for(var i in data){
                    warehouse.missileList.push(new Missile(data[i]));
                }
            });

            for(var i in warehouse.missileList){
                warehouse.missileList[i].loadImg();
            }
        },
        getItemByName: function (name) {
            var list = this.itemList;
            for(var i in list){
                if(list[i].name==name){
                    return $util.copy(list[i]);
                }
            }
        },
        getData: function (src, callback) {
            if(undefined == src){
                throw Error('Warehouse getData: src is not defined!');
            }
            console.log('开始获取：' + src);
            $.ajax({
                url: src,
                async: false,
                cache: false,
                type: "GET",
                dataType: 'json',
                success: function (data) {
                    console.log('获取成功：' + src);
                    callback(data);
                },
                error: function (error) {
                    throw Error('获取失败:' + src);
                }
            });
        },
        init: function (params) {
            var warehouse = this;

            if(!params.bulletDataSrc    ||
            !params.bulletStyleSrc      ||
            !params.planeDataSrc        ||
            !params.itemDataSrc         ||
            !params.toolDataSrc         ||
            !params.missileDataSrc){
                throw Error('warehouse init: the attribute are not right!');
            }
            warehouse.initBulletData(params.bulletDataSrc);
            warehouse.initBulletStyleData(params.bulletStyleSrc);
            warehouse.initPlaneData(params.planeDataSrc);
            warehouse.initItem(params.itemDataSrc);
            warehouse.initTool(params.toolDataSrc);
            warehouse.initMissile(params.missileDataSrc);
        }
       };

    function Manager() {
        this.planeList = [];
        this.bulletList = [];
        this.warehouse = null;
    }
    Manager.prototype.createPlane = function (plane,position) {
        var planeList = this.planeList;
        var newPlane = null;
        if(typeof plane == 'number'){
            newPlane = warehouse.getPlaneByType(plane);
        } else if (plane instanceof Plane) {
            newPlane = $util.copy(plane);
        } else{
            throw Error('Manage createPlane: plane is not the right param');
        }
        if(! (position instanceof Position)){
            throw Error('Manage createPlane: position is not the right param');
        }
        newPlane.position = $util.copy(position);
        planeList.push(newPlane);
    };
    Manager.prototype.getAllBullet = function () {
        var manager = this;
        manager.bulletList = [];
        for(var i in manager.planeList){
            var plane = manager.planeList[i];
            for(var j in plane.bulletList){
                manager.bulletList.push(plane.planeList[i]);
            }
        }
    };
    Manager.prototype.digest = function () {
        var manager = this;
        var planeList = manager.planeList;
        var bulletList = manager.bulletList;
        for(var i in planeList){
            for(var j in bulletList){
                if($util.collisionTest(planeList[i],planeList[j])){
                    planeList.splice();
                }
            }
        }
    };

    function Player() {
        this.plane = null;
        this.maxLife = 0;
        this.curLife = 0;
        this.score = 0;
    }
    Player.prototype = {
        getTool: function (tool) {
            var player = this;
            var plane = player.plane;
            switch (tool.name){
                case "upgrade":
                    if(plane.curBullet < plane.bulletStyle.style.length-1){
                        plane.curBullet++;
                    }
                    break;
                case "addLife":
                    if(player.curLife < player.maxLife){
                        player.curLife++;
                    }
                    break;
                default:
                    break;
            }
        }
    };

    function GameEventHandler(params) {
        if(params && params.target){
            this.target = params.target;
        } else{
            throw Error('GameEventHandler: constructor lack attribute target!');
        }
    }
    GameEventHandler.prototype = {
        mouseMove:function (funcObj) {
            this.target.addEventListener('mousemove', funcObj, false);
        },
        keydown: function (funcObj) {
            $(document)[0].addEventListener('keydown', funcObj, false);
        },
        mouseDown:function (funcObj) {
            this.target.addEventListener('mousedown', funcObj, false);
        },
        constructor: GameEventHandler
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
    function getCurSound(  ) {
        return $('#soundSlider')[0].valueAsNumber;
    }

    var config = {
        canvasElement: $('#myCanvas')[0],
        src:{
            planeDataSrc: 'json/plane.json',
            bulletDataSrc: 'json/bullet.json',
            bulletStyleSrc: 'json/bullet-style.json',
            itemDataSrc: 'json/item.json',
            toolDataSrc: 'json/tool.json',
            missileDataSrc: 'json/missile.json'
        },
        fps: fps
    };
    var $game = new PlaneGame(config);
    $game.init();
    // planeGame.testAllModules();
    //planeGame.start();
    $game.start();
    // $game.test1();
}());
//};
