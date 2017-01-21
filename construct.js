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
                return (obj1.position.x + obj1.width > obj2.position.x) &&
                    (obj1.position.y < obj2.position.y + obj2.height) &&
                    (obj2.position.x + obj2.width > obj1.position.x) &&
                    (obj2.position.y < obj1.position.y + obj1.height)
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
        constructor: Position,
        toString: function () {
            return '(' + this.x + ',' + this.y + ')';
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
        if (params.direction) {
            this.rotate = params.rotate;
        }
        this.isInit = false;
    }

    console.log("!!");
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
        drawImg: function (ctx) {
            var obj = this;
            ctx.save();
            ctx.translate(obj.position.x, obj.position.y);
            ctx.rotate(obj.direction/180*Math.PI);
            ctx.drawImage(obj.img, - this.width/2, - obj.height/2, obj.width, obj.height);
            ctx.restore();
        },
        move: function (ctx) {
            var obj = this;
            obj.position.y -= obj.speed * Math.cos(obj.direction / 360 * Math.PI * 2);
            obj.position.x += obj.speed * Math.sin(obj.direction / 360 * Math.PI * 2);
        }
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
        if (params.maxHp) {
            this.maxHp = params.maxHp;
        }
        if(params.shootRate){
            this.shootRate = params.shootRate;
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
        if(undefined != params.score){
            this.score = params.score;
        } else{
            this.score = 1;
        }
        this.bulletList = [];
    }

    Plane.prototype = $util.copy(FlyObject.prototype);
    Plane.prototype.constructor = Plane;
    Plane.prototype.className = 'plane';
    Plane.prototype.drawPlane = function (ctx) {
        this.drawImg(ctx);
    };
    Plane.prototype.draw = function (ctx, frameNum) {
        var plane = this;
        plane.drawPlane(ctx);

        if(frameNum % plane.shootRate == 0 && plane.canShoot && plane.curBullet != undefined){
            var bulList = plane.bulletStyle.getBullets(plane.curBullet);
            for (var i = 0 ;i<bulList.length;i++){
                bulList[i].position = $util.copy(plane.position);
                bulList[i].move(ctx);
                bulList[i].move(ctx);
                bulList[i].parent = plane;
                $game.bulletList.push(bulList[i]);
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
        bullet.position.y -= bullet.speed * Math.cos(bullet.direction / 360 * Math.PI * 2);
        bullet.position.x += bullet.speed * Math.sin(bullet.direction / 360 * Math.PI * 2);
    };

    function BulletStyle(params){
        if(!params) return;

        if(params.type){
            this.type = params.type;
        }
        if(params.style){
            this.style = params.style;
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
        if (params.planeDataSrc) {
            this.planeDataSrc = params.planeDataSrc;
        }
        if (params.bulletDataSrc) {
            this.bulletDataSrc = params.bulletDataSrc;
        }
        if (params.bulletStyleSrc) {
            this.bulletStyleSrc = params.bulletStyleSrc;
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
    }

    PlaneGame.prototype = {
        initPlayer: function () {
            var game = this;
            var warehouse = game.warehouse;
            game.player = new Player();
            game.geh = new GameEventHandler();

            var player = game.player;
            var geh = game.geh;

            player.plane = warehouse.getPlaneByType(1);
            player.plane.curBullet = 0;
            player.plane.role = 'player';

            geh.mouseMove(function (e) {
                player.plane.position.x = e.pageX;
                player.plane.position.y = e.pageY;
            });
            geh.keydown(function (e) {
                if(e.keyCode == 32){
                    game.pause = !game.pause;
                }
            })
        },
        menu:function () {
            var game = this;
            var context = game.context;
            context.font = "20px Georgia";
            context.textAlign = 'center';
            context.fillText("Fight In Sky",400,30);
            context.strokeRect(300,80,200,30);
            context.font = "16px Georgia";
            context.fillText("Start Game",400,100);
            game.canvasElement.addEventListener('mousemove',function (event) {
                var pos = $util.getEventPosition(event);
                // console.log($('#'+game.canvasElement.id));
                if(pos.x >= 300 && pos.x <= 500 && pos.y >= 80 && pos.y <= 110){
                    $('#'+game.canvasElement.id).css('cursor','pointer');
                } else{
                    $('#'+game.canvasElement.id).css('cursor','default');
                }
            });
        },
        start: function () {
            var game = this;
            var time = 0;
            game.ifInit(function () {
                game.menu();
            })
        },
        draw: function (frameNum) {
            var game = this;
            game.context.clearRect(0,0,game.width,game.height);

            game.player.plane.draw(game.context,frameNum);

            for(var i in game.bulletList){
                game.bulletList[i].draw(game.context);
                game.bulletList[i].move(game.context);
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
        dirtyCheck: function (list) {
            var game = this;
            for(var i in list){
                var obj  = list[i];
                var x = list[i].position.x + list[i].width / 2;
                var y = list[i].position.y + list[i].height / 2;
                if(x - obj.width / 2 - game.width > 0 ||
                x + obj.width / 2 < 0 ||
                y - obj.height / 2 - game.height > 0 ||
                y + obj.height / 2 < 0){
                    list.splice(i,1);
                }
            }
        },
        test1: function () {
            var game = this;
            var warehouse = game.warehouse;
            var time = 0;
            var planeList = [];
            game.ifInit(function () {
                window.setInterval(function () {
                    if(game.pause)
                        return;

                    time += game.frameTime;
                    game.frameNum++;

                    game.draw(game.frameNum);


                    var x = Math.random()*200;
                    if(game.frameNum % 50 == 0){
                        var plane = warehouse.getPlaneByType(1);
                        plane.position.x = x;
                        plane.position.y = 0;
                        plane.direction = 180;
                        plane.role = 'enemy';
                        plane.canShoot = true;
                        plane.bulletStyle = warehouse.getBulletStyleByType(2);
                        plane.curBullet = 0;
                        planeList.push(plane);
                    }

                    for (var i in planeList){
                        planeList[i].draw(game.context, game.frameNum);
                        planeList[i].move();
                    }

                    for(var i in planeList){
                        for (var j in game.bulletList){
                            if(game.bulletList[j].parent != planeList[i] && $util.collisionTest(planeList[i],game.bulletList[j])){
                                planeList.splice(i,1);
                                break;
                            }
                        }
                    }
                    for(var i in game.bulletList){
                        if($util.collisionTest(game.player.plane,game.bulletList[i])&&
                        game.bulletList[i].parent != game.player.plane){
                            game.bulletList.splice(0,game.bulletList.length);
                            planeList.splice(0,planeList.length);
                            game.context.clearRect(0,0,game.width,game.height);
                            game.player.plane.position  = new Position(game.width/2,game.height-100);
                            game.player.plane.drawImg(game.context);
                            game.context.font = "30px Courier New";
                            game.context.fillStyle = "#333";
                            game.context.textAlign = 'center';
                            game.context.fillText("Game Over",game.width/2,game.height/2);
                            game.pause = true;
                        }
                    }
                    game.dirtyCheck(game.bulletList);
                    game.dirtyCheck(planeList);
                },game.frameTime);
            });
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
            if(obj.position.x){
                image.x = obj.position.x;
            }
            if(obj.position.y){
                image.y = obj.position.y;
            }
            this.context.beginPath();
            this.context.drawImage(obj.img, image.x,image.y,image.width,image.height);
            this.context.closePath();
        },
        init: function () {
            var game = this;

            game.warehouse = new Warehouse();
            game.warehouse.init({
                bulletDataSrc: game.bulletDataSrc,
                bulletStyleSrc: game.bulletStyleSrc,
                planeDataSrc: game.planeDataSrc
            });
            console.log(game.warehouse);

            game.initPlayer();
        }
    };

    function Warehouse() {
        this.bulletTypeList = [];
        this.planeTypeList = [];
        this.bulletStyleList = [];
        this.planeList = [];
        this.bulletList = [];
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
            for(var i in bulletStyle){
                var styles = bulletStyle[i];
                for(var j in styles){
                    var style = styles[j];
                    console.log(style);
                    for(var k in style){
                        style[k].bullet = warehouse.getBulletByType(style[k].type);
                        style[k].bullet.direction = style[k].direction;
                        style[k].bullet.speed = style[k].speed;
                    }
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
            if(!params.bulletDataSrc || !params.bulletStyleSrc || !params.planeDataSrc){
                throw Error('warehouse init: the attribute are not right!');
            }
            this.initBulletData(params.bulletDataSrc);
            this.initBulletStyleData(params.bulletStyleSrc);
            this.initPlaneData(params.planeDataSrc);
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
        this.lives = null;
        this.score = 0;
    }
    Player.prototype.initPlayer = function (plane) {
        if(plane instanceof Plane){
            this.plane = plane;
        }
        this.score = 0;
    };

    function GameEventHandler() {
        this.planeGame = null;
    }
    GameEventHandler.prototype = {
        mouseMove:function (funcObj,f) {
            var gve = this;
            document.addEventListener('mousemove', funcObj, false);
        },
        keydown: function (funcObj) {
            document.addEventListener('keydown', funcObj, false);
        },
        constructor: GameEventHandler
    };

    var config = {
        canvasElement: $('#myCanvas')[0],
        planeDataSrc: 'plane.json',
        bulletDataSrc: 'bullet.json',
        bulletStyleSrc: 'bullet-style.json',
        fps: '30'
    };

    var $game = new PlaneGame(config);
    var gve = new GameEventHandler();
    gve.planeGame = $game;
    $game.init();
    // planeGame.testAllModules();
    //planeGame.start();
    $game.start();
    // $game.test1();
}());
//};
