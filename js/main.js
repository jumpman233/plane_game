/**
 * Created by lzh on 2017/2/28.
 */

fps = 30;

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
        'gameEventHandler': 'app/gameEventHandler',
        'planeGame': 'app/planeGame',
        'screen': 'app/screen',
        'sound': 'app/sound',
        'global': 'app/global',
        'dataManager': 'app/dataManager',
        'player': 'app/player',
        'randomBuild': 'app/randomBuild',
        'behTree': 'app/behTree',
        'behNode': 'app/behNode',
        'enemy': 'app/enemy',
        'intervalManager': 'app/intervalManager',
        'loadAnimate': 'app/animate/loadAnimate',
        'ball': 'app/animate/ball',
        'rect': 'app/animate/rect',
        'graph': 'app/animate/graph',
        'text': 'app/animate/text',
        'regularTriangle': 'app/animate/regularTriangle',
        'bkAnimate': 'app/animate/bkAnimate',
        'menuAnimate': 'app/animate/menuAnimate'
    }
});

require(['planeGame','bkAnimate'],function ( PlaneGame, bkAnimate) {
    var config = {
        canvasElement: $('#myCanvas')[0],
        canvasId: 'myCanvas',
        src:{
            planeDataSrc: 'json/plane.json',
            bulletDataSrc: 'json/bullet.json',
            bulletStyleSrc: 'json/bullet-style.json',
            itemDataSrc: 'json/item.json',
            toolDataSrc: 'json/tool.json',
            missileDataSrc: 'json/missile.json',
            audioDataSrc: 'json/audio.json',
            enemyDataSrc: 'json/enemy.json'
        },
        fps: fps
    };
    // var context = $('#myCanvas')[0].getContext('2d');

    PlaneGame.init(config).then(function (  ) {
        PlaneGame.start();
    });

    // planeGame.testAllModules();
});