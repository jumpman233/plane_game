/**
 * Created by lzh on 2017/3/7.
 */

define(['behNode', 'behTree', 'util'],function ( behNode,  BehTree, util) {
    var Sequence = behNode.sequence,
        Selector = behNode.selector,
        Action = behNode.action,
        Condition = behNode.condition;

    function Enemy(  ) {
        this.plane = null;
        this.hp = 0;
        this.speed = 0;
        this.score = 0;
        this.toolDrop = 0;
        this.moveType = '';
        this.curHp = 0;
    }
    Enemy.prototype = {
        constructor: Enemy,
        init: function ( params ) {
            if(!params) throw TypeError("Enemy init(): param is not right");

            var needParam = ['plane', 'hp', 'speed', 'score', 'toolDrop', 'moveType'];

            if(!util.paramInclude(needParam, params)){
                throw TypeError('Enemy init(): param is not right!');
            }

            var enemy = this;

            for(var i in needParam){
                var str = needParam[i];
                enemy[str] = params[str];
            }

            enemy.curHp = enemy.hp;
        },
        update: function (  ) {

        },
        isdead: function (  ) {
            return this.curHp <= 0;
        },
        retreatCond: function (  ) {
            return this.curHp <= this.hp / 4;
        },
        avoid: function (  ) {

        },
        attack: function (  ) {
            
        },
        behTree: new BehTree()
    };

    var rootSel = new Selector('rootSel'),
        aliveCond = new Condition('aliveCond'),
        mainSeq = new Sequence('mainSeq'),
        atkSeq = new Sequence('atkSeq'),
        atkCdCond = new Condition('atkCdCond'),
        atkAction = new Action('atkAction'),
        moveSel = new Selector('moveSel'),
        normalMove = new Action('normalMove'),
        retreatSeq = new Sequence('retreatSeq'),
        retreatSel = new Selector('retreatSel'),
        retreatHpCond = new Condition('retreatHpCond'),
        retreatAction = new Action('retreatAction'),
        avoidSeq = new Sequence('avoidSeq'),
        avoidSel = new Selector('avoidSel'),
        avoidCond = new Condition('avoidCond'),
        avoidAction = new Action('avoidAction');

    rootSel.addChild(aliveCond);
    rootSel.addChild(mainSeq);

    mainSeq.addChild(atkSeq);
    mainSeq.addChild(moveSel);

    atkSeq.addChild(atkCdCond);
    atkSeq.addChild(atkAction);

    moveSel.addChild(retreatSeq);
    moveSel.addChild(avoidSeq);
    moveSel.addChild(normalMove);

    retreatSeq.addChild(retreatSel);
    retreatSeq.addChild(retreatAction);

    retreatSel.addChild(retreatHpCond);

    avoidSeq.addChild(avoidSel);
    avoidSeq.addChild(avoidAction);

    avoidSel.addChild(avoidCond);
    
    Enemy.prototype.behTree.root = rootSel;

    return Enemy;
});