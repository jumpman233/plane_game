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
        this.bulletList = [];
        this.itemList = [];
        this.toolList = [];
        this.missileList = [];
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
                    return util.copy(list[i]);
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

    return Warehouse;
});