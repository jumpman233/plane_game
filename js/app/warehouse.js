/**
 * Created by lzh on 2017/2/28.
 */

define(['util',
    'plane',
    'flyObject',
    'position',
    'missile',
    'bullet',
    'item',
    'tool',
    'bulletStyle'],function ( util, Plane, FlyObject, Position, Missile, Bullet, Item, Tool , BulletStyle) {
    function Warehouse() {
        this.bulletTypeList = [];
        this.planeTypeList = [];
        this.bulletStyleList = [];
        this.itemList = [];
        this.toolList = [];
        this.missileList = [];
        this.src = {};
        this.audioList = [];
    }
    Warehouse.prototype = {
        constructor: Warehouse,
        getBulletTypeList: function () {
            return util.copy(this.bulletTypeList);
        },
        getPlaneTypeList: function () {
            return util.copy(this.planeTypeList);
        },
        getBulletStyleList: function () {
            return util.copy(this.bulletStyleList);
        },
        getAudioByName: function ( name ) {
            var warehouse = this;
            for(var i in warehouse.audioList){
                if(warehouse.audioList[i].name == name){
                    return warehouse.audioList[i];
                }
            }
        },
        getBulletByType: function (type) {
            var warehouse = this;
            var list = warehouse.bulletTypeList;
            for(var i in list){
                if(list[i].type == type){
                    return util.copy(list[i]);
                }
            }
        },
        getMissileByType: function (type) {
            var warehouse = this;
            var list = warehouse.missileList;
            for(var i in list){
                if(list[i].type == type){
                    return util.copy(list[i]);
                }
            }
        },
        getPlaneByType: function (type) {
            var warehouse = this;
            var list = warehouse.planeTypeList;
            for(var i in list){
                if(list[i].type == type){
                    return util.copy(list[i]);
                }
            }
        },
        getBulletStyleByType: function (type) {
            var warehouse = this;
            var list = warehouse.bulletStyleList;
            for(var i in list){
                if(list[i].type == type){
                    return util.copy(list[i]);
                }
            }
        },
        getConfig: function ( params ) {
            var defer = $.Deferred();
            if(!params.bulletDataSrc    ||
                !params.bulletStyleSrc      ||
                !params.planeDataSrc        ||
                !params.itemDataSrc         ||
                !params.toolDataSrc         ||
                !params.missileDataSrc  ||
                !params.audioDataSrc ){
                throw Error('warehouse init: the attribute are not right!');
            }
            var warehouse = this;

            warehouse.src = {
                bulletDataSrc: params.bulletDataSrc,
                bulletStyleSrc: params.bulletStyleSrc,
                planeDataSrc: params.planeDataSrc,
                itemDataSrc: params.itemDataSrc,
                toolDataSrc: params.toolDataSrc,
                missileDataSrc: params.missileDataSrc,
                audioDataSrc: params.audioDataSrc
            };
            defer.resolve(this);
            return defer;
        },
        initBullet: function (bullet) {
            bullet.loadImg();
        },
        initBulletStyle: function (bulletStyle) {
            var warehouse = this;
            bulletStyle.audio = warehouse.getAudioByName(bulletStyle.audioName);
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
            plane.deadAudio = warehouse.getAudioByName(plane.deadAudioName);
            plane.loadImg();
        },
        initBulletData: function () {
            var warehouse = this;
            return warehouse.getData(warehouse.src.bulletDataSrc).then(function (data) {
                warehouse.bulletTypeList = [];

                for(var i in data){
                    warehouse.bulletTypeList.push(new Bullet(data[i]));
                }

                for(var i in warehouse.bulletTypeList){
                    warehouse.initBullet(warehouse.bulletTypeList[i]);
                }
            });
        },
        initBulletStyleData: function () {
            var warehouse = this;

            var resFunc = function (data) {
                warehouse.bulletStyleList = [];
                for(var i in data){
                    warehouse.bulletStyleList.push(new BulletStyle(data[i]));
                }

                for(var i in warehouse.bulletStyleList){
                    warehouse.initBulletStyle(warehouse.bulletStyleList[i]);
                }
            };
            return warehouse.getData(warehouse.src.bulletStyleSrc).then(resFunc);
        },
        initPlaneData: function () {
            var warehouse = this;
            var resFunc = function (data) {
                warehouse.planeTypeList = [];
                for (var i in data){
                    warehouse.planeTypeList.push(new Plane(data[i]));
                }

                for(var i in warehouse.planeTypeList){
                    warehouse.initPlane(warehouse.planeTypeList[i]);
                }
            };
            return warehouse.getData(warehouse.src.planeDataSrc).then(resFunc);
        },
        initItem: function(){
            var warehouse = this;

            var resFunc = function (data) {
                for(var i in data){
                    warehouse.itemList.push(new Item(data[i]));
                }
                for(var i in warehouse.itemList){
                    warehouse.itemList[i].loadImg();
                }
            };
            return warehouse.getData(warehouse.src.itemDataSrc).then(resFunc);

        },
        initTool: function () {
            var warehouse = this;
            var resFunc = function (data) {
                for(var i in data){
                    warehouse.toolList.push(new Tool(data[i]));
                }
                for(var i in warehouse.toolList){
                    warehouse.toolList[i].loadImg();
                }
            };
            return warehouse.getData(warehouse.src.toolDataSrc).then(resFunc);
        },
        initMissile: function () {
            var warehouse = this;

            var resFunc = function (data) {
                for(var i in data){
                    warehouse.missileList.push(new Missile(data[i]));
                }
                for(var i in warehouse.missileList){
                    warehouse.missileList[i].loadImg();
                }
            };
            return warehouse.getData(warehouse.src.missileDataSrc).then(resFunc);
        },
        initAudio: function (  ) {
            var warehouse = this;
            return warehouse.getData(warehouse.src.audioDataSrc).then(function (data) {
                warehouse.bulletTypeList = [];

                for(var i in data){
                    var audio = util.initAudio(data[i]);
                    audio.name = data[i].name;
                    warehouse.audioList.push(audio);
                }
            });
        },
        getItemByName: function (name) {
            var list = this.itemList;
            for(var i in list){
                if(list[i].name==name){
                    return util.copy(list[i]);
                }
            }
        },
        getData: function (src, callback) {
            var defer = $.Deferred();
            if(undefined == src){
                throw Error('Warehouse getData: src is not defined!');
            }
            console.log('开始获取：' + src);
            $.ajax({
                url: src,
                async: true,
                cache: false,
                type: "GET",
                dataType: 'json',
                success: function (data) {
                    console.log('获取成功：' + src);
                    defer.resolve(data);
                    if(typeof callback =='function'){
                        callback(data);
                    }
                },
                error: function (error) {
                    throw Error('获取失败:' + src);
                }
            });
            return defer;
        },
        init: function (params) {
            var warehouse = this;
            var defer = $.Deferred();

            warehouse
                .getConfig(params)
                .then(function (  ) {
                    return warehouse.initAudio();
                })
                .then( function(){
                    return warehouse.initBulletData();
                } )
                .then( function (  ) {
                    return warehouse.initBulletStyleData();
                })
                .then( function (  ) {
                    return warehouse.initPlaneData();
                })
                .then( function (  ) {
                    return warehouse.initItem();
                })
                .then( function (  ) {
                    return warehouse.initTool();
                })
                .then( function (  ) {
                    return warehouse.initMissile();
                })
                .then(function (  ) {
                    defer.resolve();
                    console.log(warehouse);
                });

            return defer;
        }
    };
    return new Warehouse();
});