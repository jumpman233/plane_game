/**
 * Created by lzh on 2017/3/7.
 */

define(['behNode',
    'behTree',
    'util',
    'flyObject',
    'dataManager',
    'global',
    'sound'],function ( behNode,  BehTree, util, FlyObject, dm, global, sound) {
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
        this.target = null;

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
        ifRetreat: function ( enemy ) {
            return enemy.curHp <= enemy.hp / 4;
        },
        retreat: function ( enemy ) {
            if(!enemy || !enemy.plane) enemy.throwNoPlaneError();

            var plane = enemy.plane;
            switch (enemy.moveType){
                case 'straight':
                    plane.speed += 0.2;
                    Enemy.prototype.straightMove(enemy);
                    break;
                case 'patrol':
                    var dy = plane.position.y,
                        dx_r = plane.position.x,
                        dx_l = global.width - plane.position.x;
                    if(dy <= dx_l && dy <= dx_r){
                        plane.position.y -= plane.speed;
                    } else if(dx_l <= dy && dx_l <= dx_r){
                        plane.position.x -= plane.speed;
                    } else if(dx_r <= dy && dx_r <= dx_l){
                        plane.position.x += plane.speed;
                    }
                    break;
            }
        },
        avoid: function ( enemy ) {
            if(!enemy || !enemy.plane) enemy.throwNoPlaneError();


        },
        attack: function ( enemy ) {
            if(!enemy.plane) enemy.throwNoPlaneError();

            enemy.plane.shoot();
        },
        move: function( enemy ){
            if(!enemy || !enemy.moveType) { throw TypeError('Enemy move(): param is not right!')}
            switch (enemy.moveType){
                case 'straight':
                    Enemy.prototype.straightMove(enemy);
                    break;
                case 'patrol':
                    Enemy.prototype.patrolMove(enemy);
                    break;
                case 'toTarget':
                    Enemy.prototype.moveToTarget(enemy);
                    break;
                default:
                    throw TypeError("Enemy move(): moveType is not found!");
            }
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
        //if the enemy's move type is 'patrol', when its first move, its patrolY would be init.
        //and it will move straight to patrolY until it arrives, and then, it will move horizontal
        patrolMove: function ( enemy ) {
            var plane = enemy.plane;
            var pos = plane.position;
            if(enemy.patrolY == 0){
                enemy.patrolY = Math.random() * global.height/4 + plane.height;
                plane.toRight = (pos.x >= global.width/2)? 1 : -1;
            }
            if(pos.y + plane.speed < enemy.patrolY){
                pos.y += plane.speed;
            } else{
                pos.y = enemy.patrolY;
                if(pos.x + plane.width / 2 >= global.width ){
                    plane.toRight = -1;
                } else if(pos.x - plane.width / 2 <= 0){
                    plane.toRight = 1;
                }
                pos.x += plane.speed * plane.toRight;
            }
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

    atkSeq.addChild(atkAction);
    atkAction.act = Enemy.prototype.attack;

    moveSel.addChild(retreatSeq);
    // moveSel.addChild(avoidSeq);
    moveSel.addChild(normalMove);
    normalMove.act = Enemy.prototype.move;

    retreatSeq.addChild(retreatHpCond);
    retreatSeq.addChild(retreatAction);

    retreatHpCond.cond = Enemy.prototype.ifRetreat;
    retreatAction.act = Enemy.prototype.retreat;

    avoidSeq.addChild(avoidSel);
    avoidSeq.addChild(avoidAction);

    avoidSel.addChild(avoidCond);

    getShotSeq.addChild(getShotCond);

    getShotCond.cond = Enemy.prototype.ifGetShot;

    Enemy.prototype.behTree.root = rootSel;

    return Enemy;
});