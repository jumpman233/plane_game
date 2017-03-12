/**
 * Created by lzh on 2017/2/28.
 */

fps = 30;

require.config({
    paths: {
        'jquery': 'lib/jquery',
        'util': 'app/util',
        'plane': 'app/data-structure/plane',
        'flyObject': 'app/data-structure/fly-object',
        'position': 'app/data-structure/position',
        'missile': 'app/data-structure/missile',
        'bullet': 'app/data-structure/bullet',
        'item': 'app/data-structure/item',
        'tool': 'app/data-structure/tool',
        'warehouse': 'app/warehouse',
        'bulletStyle': 'app/data-structure/bulletStyle',
        'gameEventHandler': 'app/gameEventHandler',
        'planeGame': 'app/planeGame',
        'screen': 'app/screen',
        'sound': 'app/sound',
        'global': 'app/global',
        'dataManager': 'app/dataManager',
        'player': 'app/data-structure/player',
        'randomBuild': 'app/randomBuild',
        'behTree': 'app/data-structure/behTree',
        'behNode': 'app/data-structure/behNode',
        'enemy': 'app/data-structure/enemy',
        'intervalManager': 'app/intervalManager',
        'loadAnimate': 'app/animate/loadAnimate',
        'ball': 'app/animate/ball',
        'rect': 'app/animate/rect',
        'graph': 'app/animate/graph',
        'text': 'app/animate/text',
        'regularTriangle': 'app/animate/regularTriangle',
        'bkAnimate': 'app/animate/bkAnimate',
        'menuAnimate': 'app/animate/menuAnimate',
        'hardAnimate': 'app/animate/hardAnimate',
        'aniImage': 'app/animate/aniImage',
        'ballBkAnimate': 'app/animate/ballBkAnimate'
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
            enemyDataSrc: 'json/enemy.json',
            difficultyDataSrc: 'json/difficulty.json'
        },
        fps: fps
    };
    // var context = $('#myCanvas')[0].getContext('2d');

    PlaneGame.init(config).then(function (  ) {
        PlaneGame.start();
    });

    // planeGame.testAllModules();
});