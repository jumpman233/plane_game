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
        'behNode': 'app/behNode'
    }
});

require(['planeGame','behNode', 'behTree'],function ( PlaneGame, behNode, BehTree ) {
    var tree = new BehTree;
    var Sequence = behNode.sequence,
        Selector = behNode.selector,
        Action = behNode.action,
        Condition = behNode.condition;
    tree.root = new Sequence();
    var sel1 = new Selector();
    var act1 = new Action();
    var cond1 = new Condition();
    act1.act = function (  ) {
        console.log("!??");
    };
    cond1.cond = function () {
        console.log("222");
        return false;
    };
    tree.root.addChild(sel1);
    sel1.addChild(cond1);
    sel1.addChild(act1);
    tree.execute();

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
            audioDataSrc: 'json/audio.json'
        },
        fps: fps
    };
    PlaneGame.getConfig(config);
    PlaneGame.init(config).then(function (  ) {
        PlaneGame.start();
    });

    // planeGame.testAllModules();
});