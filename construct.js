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
            if(Array.isArray(obj)) return obj;
            if(typeof obj != 'object') return obj;

            var newObj = new Object();
            for(var i in obj){
                if(obj[i] instanceof Image){
                    newObj[i] = obj[i];
                } else{
                    newObj[i] = util.copy(obj[i]);
                }
            }
            return newObj;
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
        if (params.rotate) {
            this.rotate = params.rotate;
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
        drawImg: function (ctx) {
            ctx.beginPath();
            ctx.drawImage(this.img, this.position.x - this.width/2, this.position.y - this.height/2, this.width, this.height);
            ctx.closePath();
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

        this.bulletList = [];
    }

    Plane.prototype = $util.copy(FlyObject.prototype);
    Plane.prototype.constructor = Plane;
    Plane.prototype.className = 'plane';
    Plane.prototype.list = [];
    Plane.prototype.init = function () {
        var plane = this;
        var bulletStyle = new BulletStyle();
        plane.bulletStyle = bulletStyle.getByType(plane.bulletType);
        this.loadImg();
    };
    Plane.prototype.drawPlane = function (ctx) {
        this.drawImg(ctx);
    };
    Plane.prototype.drawBullet = function (ctx) {
        var plane = this;
        for(var i in plane.bulletList){
            plane.bulletList[i].draw(ctx);
            plane.bulletList[i].move(ctx);
        }
    };
    Plane.prototype.draw = function (ctx, frameNum) {
        var plane = this;
        plane.drawPlane(ctx);

        if(frameNum % plane.shootRate == 0){
            var bulList = plane.bulletStyle.getBullets(1);
            for (var i = 0 ;i<bulList.length;i++){
                bulList[i].position = $util.copy(plane.position);
                bulList[i].parent = plane;
                plane.bulletList.push(bulList[i]);
            }
        }
        plane.drawBullet(ctx);
    };
    Plane.prototype.getByType = function (type) {
        var list = new Plane().list;
        for(var i in list){
            if(type == list[i].type){
                return list[i];
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
        if (params.direction){
            this.direction = params.direction;
        } else{
            this.direction = 0;
        }
        this.parent = null;
    }

    Bullet.prototype = $util.copy(FlyObject.prototype);
    Bullet.prototype.constructor = Bullet;
    Bullet.prototype.className = 'bullet';
    Bullet.prototype.list = [];
    Bullet.prototype.init = function () {
        this.loadImg();
    };
    Bullet.prototype.draw = function (ctx) {
        this.drawImg(ctx);
    };
    Bullet.prototype.move = function () {
        var bullet = this;
        bullet.position.y -= bullet.speed * Math.cos(bullet.direction / 360 * Math.PI * 2);
        bullet.position.x += bullet.speed * Math.sin(bullet.direction / 360 * Math.PI * 2);
    };
    Bullet.prototype.getByType = function (type) {
        var list = new Bullet().list;
        for(var i in list){
            if(list[i].type == type){
                return list[i];
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
    }
    BulletStyle.prototype = {
        constructor: BulletStyle,
        list: [],
        init: function () {
            var bullet = new Bullet();
            var bulletStyle = this;
            for(var i in bulletStyle.list){
                var styles = bulletStyle.list[i].style;
                for(var j in styles){
                    var style = styles[j];
                    for(var k in style){
                        style[k].bullet = $util.copy(bullet.getByType(style[k].type));
                        style[k].bullet.direction = style[k].direction;
                        style[k].bullet.speed = style[k].speed;
                    }
                }
            }
            console.log(bulletStyle);
        },
        getByType: function (type) {
            var list = this.list
            for(var i in list){
                if(list[i].type == type){
                    return list[i];
                }
            }
        },
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
        }
        this.planeDataList = new Plane().list;
        this.bulletDataList = new Bullet().list;
        this.isInit = false;
        this.player = null;
        this.geh = null;
        this.frameNum = 0;
        this.totTime = 0;
    }

    PlaneGame.prototype = {
        getPlaneData: function () {
            var game = this;
            console.log('开始获取：' + game.planeDataSrc);
            $.ajax({
                url: this.planeDataSrc,
                cache: false,
                async: false,
                type: "GET",
                dataType: 'json',
                success: function (data) {
                    console.log('获取成功：' + game.planeDataSrc);
                    for(var i in data){
                        game.planeDataList.push(new Plane(data[i]));
                    }
                },
                error: function (response) {
                    console.log('获取失败：' + game.planeDataSrc);
                }
            })
        },
        getBulletData: function () {
            var game = this;
            if(!game.bulletDataSrc) {
                throw Error('PlaneGame: bulletDataSrc is not defined!');
            }
            console.log('开始获取：' + game.bulletDataSrc);
            $.ajax({
                url: game.bulletDataSrc,
                cache: false,
                async: false,
                type: "GET",
                dataType: 'json',
                success: function (data) {
                    console.log('获取成功：' + game.bulletDataSrc);
                    for(var i in data){
                        game.bulletDataList.push(new Bullet(data[i]));
                    }
                },
                error: function () {
                    console.log('获取失败：' + game.bulletDataSrc);
                }
            })
        },
        getBulletStyleData: function () {
            var game = this;
            if(!game.bulletStyleSrc){
                throw Error('PlaneGame: bulletStyleDataSrc is not defined!');
            }
            console.log('开始获取：' + game.bulletStyleSrc);
            $.ajax({
                url: game.bulletStyleSrc,
                async: false,
                cache: false,
                type: "GET",
                dataType: 'json',
                success: function (data) {
                    console.log('获取成功：' + game.bulletStyleSrc);
                    var bs = new BulletStyle();
                    for(var i in data){
                        bs.list.push(new BulletStyle(data[i]));
                    }
                },
                error: function (error) {
                    throw Error('获取失败:' + game.bulletStyleSrc);
                }
            })
        },
        initBulletData: function () {
            var game = this;
            for(var i in game.bulletDataList){
                game.bulletDataList[i].init();
            }
        },
        initBulletStyleData: function () {
            var list = new BulletStyle().list;
            for(var i in list){
                list[i].init();
            }
        },
        initPlaneData: function () {
            var game = this;
            for(var i in game.planeDataList){
                game.planeDataList[i].init();
            }
        },
        initPlayer: function () {
            var game = this;
            game.player = new Player();
            game.geh = new GameEventHandler();

            var player = game.player;
            var geh = game.geh;

            player.plane = game.planeDataList[0];

            geh.mouseMove(function (e) {
                player.plane.position.x = e.pageX;
                player.plane.position.y = e.pageY;
            });
        },
        start: function () {
            var game = this;
            var time = 0;
            game.ifInit(function () {
                window.setInterval(function () {
                    time += game.frameTime;
                    game.frameNum++;
                    game.draw(game.frameNum);
                },game.frameTime);
            })
        },
        draw: function (frameNum) {
            var game = this;
            game.context.clearRect(0,0,game.width,game.height);

            game.player.plane.draw(game.context,frameNum);
        },
        testAllModules: function () {
            var game = this;
            game.ifInit(function () {
                var x = 0;
                var y = 0;
                game.context.beginPath();
                for(var i in game.planeDataList){
                    game.planeDataList[i].position.x = x;
                    game.planeDataList[i].position.y = y;
                    game.drawImage(game.planeDataList[i]);
                    x += game.planeDataList[i].width / 2 + 30;
                    if (y>=300){
                        y+=100;
                    }
                }
                for(var i in game.bulletDataList){
                    game.bulletDataList[i].position.x = x;
                    game.bulletDataList[i].position.y = y;
                    game.drawImage(game.bulletDataList[i]);
                    x += game.bulletDataList[i].width / 2 + 30;
                    if (y>=300){
                        y+=100;
                    }
                }
                game.context.closePath();
            });
        },
        testPlayer: function () {
          var game = this;
          game.ifInit(function () {

          });
        },
        checkInit: function () {
            var game = this;
            if(game.isInit) return true;

            var flag = true;
            for(var i in game.bulletDataList){
                if(!game.bulletDataList[i].isInit){
                    flag = false;
                }
            }
            for(var i in game.planeDataList){
                if(!game.planeDataList[i].isInit){
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
            game.getBulletData();
            game.getPlaneData();
            game.getBulletStyleData();
            game.initBulletData();
            game.initBulletStyleData();
            game.initPlaneData();
            game.initPlayer();
        }
    };

    function Player() {
        this.plane = null;
        this.lives = null;
    }

    function GameEventHandler() {
        this.planeGame = null;
    }
    GameEventHandler.prototype = {
        mouseMove:function (funcObj) {
            var gve = this;
            document.addEventListener('mousemove', funcObj, false);
        },
        constructor: GameEventHandler
    };

    var config = {
        canvasElement: $('#myCanvas')[0],
        planeDataSrc: 'plane.json',
        bulletDataSrc: 'bullet.json',
        bulletStyleSrc: 'bullet-style.json',
        fps: '20'
    };

    var planeGame = new PlaneGame(config);
    var gve = new GameEventHandler();
    gve.planeGame = planeGame;
    planeGame.init();
     //planeGame.testAllModules();
    // planeGame.test();
    planeGame.start();
}());
//};
