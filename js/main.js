/**
 * Created by lzh on 2017/2/28.
 */

fps = 50;

require.config({
    paths: {
        'jquery': 'lib/jquery',
        'util': 'app/util',
        'plane': 'app/plane',
        'flyObject': 'app/fly-object',
        'position': 'app/position',
        'missile': 'app/missile',
        'bullet': 'app/bullet',
        'item': 'app/item',
        'tool': 'app/tool',
        'warehouse': 'app/warehouse',
        'bulletStyle': 'app/bulletStyle',
        'player': 'app/player',
        'gameEventHandler': 'app/gameEventHandler',
        'planeGame': 'app/planeGame',
        'screen': 'app/screen',
        'sound': 'app/sound'
    }
});

require(['planeGame'],function ( PlaneGame ) {
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
    PlaneGame.getConfig(config);
    PlaneGame.init(config).then(function (  ) {
        PlaneGame.start();
    });

    // planeGame.testAllModules();
});