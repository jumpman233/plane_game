/**
 * Created by lzh on 2017/3/7.
 */

define(['behNode', 'behTree', 'util', 'flyObject', 'dataManager'],function ( behNode,  BehTree, util, FlyObject, dm) {
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
        this.patrolY = 0;
        this.isDead = false;

        this.deadDuring = 10;
    }
    Enemy.prototype = {
        constructor: Enemy,
        init: function ( params ) {
            if(!params) throw TypeError("Enemy init(): param is not right");

            var needParam = ['type','plane', 'hp', 'speed', 'score', 'toolDrop', 'moveType'];

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
            this.behTree.execute(this);
        },
        ifDead: function ( enemy ) {
            return enemy.curHp <= 0 || !util.isInCanvas(enemy.plane);
        },
        deadAct: function ( enemy ) {
            if(enemy.deadDuring-- <= 0){
                enemy.isDead = true;
            }
            enemy.plane.img = enemy.plane.deadImg;
        },
        retreatCond: function (  ) {
            return this.curHp <= this.hp / 4;
        },
        avoid: function (  ) {

        },
        attack: function ( enemy ) {
            if(!enemy.plane) enemy.throwNoPlaneError();

            enemy.plane.shoot();
            return true;
        },
        straightMove: function ( enemy ) {
            if(!enemy.plane) enemy.throwNoPlaneError();

            FlyObject.prototype.move.call(enemy.plane);
        },
        //check if player's bullets have collision with enemies
        //if true, it's possible to appear a tool
        //check if enemies have collision with player's plane
        //if true, player's life will be reduced
        ifGetShot: function ( enemy ) {
            var e_plane = enemy.plane,
                result = false;
            for(var i in dm.player_bullets){
                var bullet = dm.player_bullets[i];
                if(e_plane && util.collisionTest(bullet, e_plane)){
                    enemy.getShot(bullet);
                    dm.player_bullets.splice(i, 1);
                    result = true;
                }
            }
            return result;
        },
        getShot: function ( bullet ) {
            var enemy = this;
            if(bullet && bullet.damage){
                enemy.curHp -= bullet.damage;
            }
        },
        patrolMove: function (  ) {

        },
        moveToTarget: function (  ) {

        },
        throwNoPlaneError: function (  ) {
            throw TypeError('Enemy: no plane param error')
        },
        behTree: new BehTree()
    };

    var rootSel = new Selector('rootSel'),
        deadSeq = new Sequence('deadSeq'),
        deadCond = new Condition('deadCond'),
        deadAction = new Action('deadAction'),
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
        avoidAction = new Action('avoidAction'),
        getShotSeq = new Sequence('getShotSeq'),
        getShotCond = new Condition('getShotCond');

    rootSel.addChild(deadSeq);
    rootSel.addChild(mainSeq);

    deadSeq.addChild(deadCond);
    deadSeq.addChild(deadAction);

    deadCond.cond = Enemy.prototype.ifDead;
    deadAction.act = Enemy.prototype.deadAct;

    mainSeq.addChild(atkSeq);
    mainSeq.addChild(moveSel);
    mainSeq.addChild(getShotSeq);

    atkSeq.addChild(atkCdCond);
    // atkSeq.addChild(atkAction);
    atkCdCond.cond = Enemy.prototype.attack;

    // moveSel.addChild(retreatSeq);
    // moveSel.addChild(avoidSeq);
    moveSel.addChild(normalMove);
    normalMove.act = Enemy.prototype.straightMove;

    retreatSeq.addChild(retreatSel);
    retreatSeq.addChild(retreatAction);

    retreatSel.addChild(retreatHpCond);

    avoidSeq.addChild(avoidSel);
    avoidSeq.addChild(avoidAction);
    avoidSel.addChild(avoidCond);

    getShotSeq.addChild(getShotCond);

    getShotCond.cond = Enemy.prototype.ifGetShot;

    Enemy.prototype.behTree.root = rootSel;

    return Enemy;
});