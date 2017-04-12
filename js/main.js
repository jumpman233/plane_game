/**
 * Created by lzh on 2017/2/28.
 */

require.config({
    paths: {
        'jquery': 'lib/jquery',
        'util': 'app/util',
        'plane': 'app/data-structure/object/plane',
        'flyObject': 'app/data-structure/object/fly-object',
        'position': 'app/data-structure/object/position',
        'missile': 'app/data-structure/object/missile',
        'bullet': 'app/data-structure/object/bullet',
        'item': 'app/data-structure/object/item',
        'tool': 'app/data-structure/object/tool',
        'warehouse': 'app/manager/warehouse',
        'bulletStyle': 'app/data-structure/object/bulletStyle',
        'gameEventHandler': 'app/manager/gameEventHandler',
        'planeGame': 'app/manager/planeGame',
        'screen': 'app/manager/screen',
        'sound': 'app/manager/sound',
        'global': 'app/global',
        'dataManager': 'app/manager/dataManager',
        'player': 'app/data-structure/object/player',
        'randomBuild': 'app/manager/randomBuild',
        'behTree': 'app/data-structure/behaviour-tree/behTree',
        'behNode': 'app/data-structure/behaviour-tree/behNode',
        'enemy': 'app/data-structure/object/enemy',
        'intervalManager': 'app/manager/intervalManager',
        'loadAnimate': 'app/animate/loadAnimate',
        'ball': 'app/animate/object/ball',
        'rect': 'app/animate/object/rect',
        'graph': 'app/animate/object/graph',
        'text': 'app/animate/object/text',
        'regularTriangle': 'app/animate/object/regularTriangle',
        'bkAnimate': 'app/animate/bkAnimate',
        'menuAnimate': 'app/animate/menuAnimate',
        'hardAnimate': 'app/animate/hardAnimate',
        'aniImage': 'app/animate/object/aniImage',
        'ballBkAnimate': 'app/animate/ballBkAnimate',
        'storeMenu': 'app/animate/storeMenu',
        'popper': 'app/animate/object/popper',
        'fightBk': 'app/animate/fightBk',
        'gameOverAnimate': 'app/animate/object/gameOverAnimate'
    }
});

require(['planeGame','bkAnimate'],function ( PlaneGame, bkAnimate) {
    var fps = 50;
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
        try{
            PlaneGame.start();
        }
        catch (e){
            console.log("e");
        }
    });

    // planeGame.testAllModules();
});