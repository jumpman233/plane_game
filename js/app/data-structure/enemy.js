/**
 * Created by lzh on 2017/3/7.
 */

define(['behNode',
    'behTree',
    'util',
    'flyObject',
    'dataManager',
    'global',
    'sound',
    'position'],function ( behNode,  BehTree, util, FlyObject, dm, global, sound, Position) {
    'use strict';
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
        this.secureDis = 0;
        this.watchAng = 0;
        this.avoidCd = 150;
        this.avoidReduce = 0;

        this.deadDuring = 10;
    }
    Enemy.prototype = {
        constructor: Enemy,
        init: function ( params ) {
            if(!params) throw TypeError("Enemy init(): param is not right");

            var needParam = ['type','plane', 'hp', 'speed', 'score', 'toolDrop', 'moveType', 'watchAng'];

            if(!util.paramInclude(needParam, params)){
                    throw TypeError('Enemy init(): params are not right!');
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
                    // plane.speed += 0.2;
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
        ifAvoid: function(enemy){
            if(!enemy || !enemy.plane) enemy.throwNoPlaneError();

            return global.difficuly === 'hard' || global.difficuly === 'hell';
        },
        avoid: function ( enemy ) {
            if(!enemy || !enemy.plane) enemy.throwNoPlaneError();
            var player_bullets = dm.player_bullets,
                plane = enemy.plane;

            switch (enemy.moveType){
                case 'straight':
                    var angList = [];
                    for(var i = 0; i < player_bullets.length; i++){
                        var dis = Position.prototype.calDis(enemy.plane.position, player_bullets[i].position);
                        var ang = Position.prototype.includeAng(plane.position, player_bullets[i].position, plane.direction);
                        if(dis <= enemy.secureDis && Math.abs(ang) <= enemy.watchAng / 2){
                            angList.push(ang);
                        }
                    }
                    if(angList.length >= 1){
                        var minAng = Number.POSITIVE_INFINITY;
                        for(var i = 0; i < angList.length; i++){
                            if(Math.abs(angList[i]) < Math.abs(minAng)){
                                minAng = angList[i];
                            }
                        }
                        if(minAng <= 0){
                            plane.direction += plane.maxRotate;
                        } else{
                            plane.direction -= plane.maxRotate;
                        }
                    } else{
                        plane.rotateToAngle(plane.originDirection);
                    }
                    if(plane.direction < 90){
                        plane.direction = 90;
                    } else if(plane.direction > 270){
                        plane.direction = 270;
                    }
                    break;
                case 'patrol':
                    if(enemy.avoidReduce > 0){
                        enemy.avoidReduce--;
                        break;
                    }
                    var min = Number.POSITIVE_INFINITY,
                        minIndex = 0;
                    for(var i = 0; i < player_bullets.length; i++){
                        var pa_dis = Position.prototype.calDis(enemy.plane.position, player_bullets[i].position);
                        if(min > pa_dis){
                            min = pa_dis;
                            minIndex = i;
                        }
                    }
                    if(min < enemy.secureDis){
                        if(player_bullets[minIndex].position.x < plane.position.x) {
                            enemy.plane.toRight = 1;
                        } else{
                            enemy.plane.toRight = -1;
                        }
                        enemy.avoidReduce = enemy.avoidCd;
                    } else{
                    }
                    break;
                default:
                    break;
            }

            enemy.move(enemy);
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
                plane.toRight = (pos.x >= global.width / 2) ? 1 : -1;
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
        clone: function (  ) {
            var newEnemy = new Enemy(),
                oldEnemy = this;

            for(var i in oldEnemy){
                if(oldEnemy[i] != null && typeof oldEnemy[i] == 'object' && oldEnemy[i].clone){
                    newEnemy[i] = oldEnemy[i].clone();
                } else{
                    newEnemy[i] = oldEnemy[i];
                }
            }

            return newEnemy;
        },
        behTree: new BehTree()
    };
    Object.defineProperty(Enemy.prototype, 'className', {
        writable: false,
        configurable: false,
        enumerable: false,
        value: 'Enemy'
    });

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
    moveSel.addChild(avoidSeq);
    moveSel.addChild(normalMove);
    normalMove.act = Enemy.prototype.move;

    retreatSeq.addChild(retreatHpCond);
    retreatSeq.addChild(retreatAction);

    retreatHpCond.cond = Enemy.prototype.ifRetreat;
    retreatAction.act = Enemy.prototype.retreat;

    avoidSeq.addChild(avoidSel);
    avoidSeq.addChild(avoidAction);

    avoidSel.addChild(avoidCond);
    avoidCond.cond = Enemy.prototype.ifAvoid;
    avoidAction.act = Enemy.prototype.avoid;

    getShotSeq.addChild(getShotCond);

    getShotCond.cond = Enemy.prototype.ifGetShot;

    Enemy.prototype.behTree.root = rootSel;

    return Enemy;
});