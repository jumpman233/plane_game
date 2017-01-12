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
            if(typeof obj != 'object') return obj;

            var newObj = new Object();
            for(var i in obj){
                newObj[i] = util.copy(obj[i]);
            }
            return newObj;
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
            this.width = params.width;
            this.height = params.height;
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
        if(params.bulletType){
            this.bulletType = params.bulletType;
        }
    }

    Plane.prototype = $util.copy(FlyObject.prototype);
    Plane.prototype.constructor = Plane;
    Plane.prototype.init = function () {
        this.loadImg();
    };
    Plane.prototype.draw = function (ctx) {
        ctx.beginPath();
        ctx.drawImage(this.img, this.position.x, this.position.y, this.width, this.height);
        ctx.closePath();
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
    }

    Bullet.prototype = $util.copy(FlyObject.prototype);
    Bullet.prototype.constructor = Bullet;
    Bullet.prototype.init = function () {
        this.loadImg();
    };
    Bullet.prototype.draw = function () {

    };


    function PlaneGame(params) {
        if (!params) return;

        if (params.backgroundSrc) {
            planeGame.backgroundSrc = params.backgroundSrc;
        }
        if (params.canvasElement) {
            this.canvasElement = params.canvasElement;
            this.context = this.canvasElement.getContext('2d');
        }
        if (params.planeDataSrc) {
            this.planeDataSrc = params.planeDataSrc;
        }
        if (params.bulletDataSrc) {
            this.bulletDataSrc = params.bulletDataSrc;
        }
        if (params.fps) {
            this.fps = params.fps;
        }
        this.planeDataList = [];
        this.bulletDataList = [];
        this.isInit = false;
        this.player = null;
    }

    PlaneGame.prototype = {
        getPlaneData: function () {
            var game = this;
            console.log('开始获取：' + game.planeDataSrc);
            $.ajax({
                url: this.planeDataSrc,
                cache: false,
                async: false,
                type: "POST",
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
            console.log('开始获取：' + game.bulletDataSrc);
            $.ajax({
                url: game.bulletDataSrc,
                cache: false,
                async: false,
                type: "POST",
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
        initBulletData: function () {
            var game = this;
            for(var i in game.bulletDataList){
                game.bulletDataList[i].init();
            }
            console.log(game.bulletDataList);
        },
        initPlaneData: function () {
            var game = this;
            for(var i in game.planeDataList){
                game.planeDataList[i].init();
            }
            console.log(game.planeDataList);
        },
        initPlayer: function () {
            var game = this;
            game.player = new Player();
            game.player.plane = game.planeDataList[0];
        },
        start: function () {
            var game = this;
            game.ifInit(function () {
                window.setInterval(function () {
                    game.draw();
                }, 1000 / game.fps);
            })
        },
        draw: function () {
            var game = this;
            game.context.clearRect(0,0,1000,1000);

            game.player.plane.draw(game.context);
        },
        testAllModules: function () {
            var game = this;
            game.ifInit(function () {
                var x = 0;
                var y = 0;
                game.context.beginPath();
                for(var i in game.planeDataList){
                    console.log(game.planeDataList[i]);
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
                        console.log("!");
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
            game.initBulletData();
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
        mouse:function () {
            var gve = this;
            document.addEventListener('mousemove',function (e) {
                gve.planeGame.player.plane.position.x = e.pageX;
                gve.planeGame.player.plane.position.y = e.pageY;
            })
        },
        constructor: GameEventHandler
    };

    var config = {
        canvasElement: $('#myCanvas')[0],
        planeDataSrc: 'plane.json',
        bulletDataSrc: 'bullet.json',
        fps: '50'
    };
    var planeGame = new PlaneGame(config);
    var gve = new GameEventHandler();
    gve.planeGame = planeGame;
    gve.mouse();
    planeGame.init();
    // planeGame.testAllModules();
    // planeGame.test();
    planeGame.start();
}());
//};
