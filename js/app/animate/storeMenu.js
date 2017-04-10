/**
 * Created by lzh on 2017/4/9.
 */

define(['global', 'rect', 'text', 'util'], function ( global, Rect, Text, util ) {
    var storeText = new Text,
        backText = new Text,
        backRect = new Rect,
        storeTextTarget = {x: 0, y: 0},
        backTextTarget = {x: 0, y: 0},
        backRectTarget = {x: 0, y: 0},
        optWidth = 0,
        optHeight = 0,
        options = [],
        inComplete = false,
        isRemoved = false,
        removing = false,
        isInit = false,
        backEvent = null;

    var easeMove = function ( sta, tar ) {
        if(sta && sta.x !== undefined && sta.y !== undefined && tar && tar.x !== undefined && tar.y !== undefined){
            sta.x += (tar.x - sta.x) * 0.04;
            sta.y += (tar.y - sta.y) * 0.04;
        } else {
            throw TypeError('easeMove(): params are not right!');
        }
    };

    var Option = function ( params ) {
        this.optText = new Text();
        this.optRect = new Rect();
        this.valueText = new Text();
        this.upgradeText = new Text();
        this.upgradeRect = new Rect();

        this.optTextTarget = {x: 0, y: 0};
        this.optRectTarget = {x: 0, y: 0};
        this.valueTextTarget = {x: 0, y: 0};
        this.upgradeTextTarget = {x: 0, y: 0};
        this.upgradeRectTarget = {x: 0, y: 0};

        this.getValue = null;
        this.clickEvent = null;

        this.inComplete = false;

        this.init(params);
    };
    Option.prototype = {
        constructor: Option,
        init: function ( params ) {
            var opt = this,
                upgradeWidth = params.optWidth / 3,
                upgradeHeight = params.optHeight,
                textOffsetY = params.optHeight * 0.6;

            opt.getValue = params.getValue;

            opt.optText.text = params.optText;
            opt.optText.fontSize = params.fontSize;
            opt.optTextTarget.x = params.x + params.fontSize * opt.optText.text.length * 0.4;
            opt.optTextTarget.y = params.y + textOffsetY;
            opt.optText.x = params.initX;
            opt.optText.y = params.initY;

            opt.optRect.width = params.optWidth;
            opt.optRect.height = params.optHeight;
            opt.optRectTarget.x = params.x;
            opt.optRectTarget.y = params.y;
            opt.optRect.x = params.initX;
            opt.optRect.y = params.initY;

            opt.valueText.text = '' + opt.getValue();
            opt.valueText.fontSize = params.fontSize;
            opt.valueTextTarget.x = params.x + params.optWidth - opt.valueText.text.length * params.fontSize * 0.4;
            opt.valueTextTarget.y = params.y + textOffsetY;
            opt.valueText.x = params.initX;
            opt.valueText.y = params.initY;

            opt.upgradeText.text = 'upgrade';
            opt.upgradeText.fontSize = params.fontSize;
            opt.upgradeTextTarget.x = params.x + params.optWidth + 10 + 'upgrade'.length * params.fontSize * 0.4;
            opt.upgradeTextTarget.y = params.y + textOffsetY;
            opt.upgradeText.x = params.initX;
            opt.upgradeText.y = params.initY;

            opt.upgradeRect.width = upgradeWidth;
            opt.upgradeRect.height = upgradeHeight;
            opt.upgradeRectTarget.x = params.x + params.optWidth + 10;
            opt.upgradeRectTarget.y = params.y;
            opt.upgradeRect.x = params.initX;
            opt.upgradeRect.y = params.initY;

            opt.clickEvent = function (  ) {
                params.clickEvent();
                opt.valueText.text = '' + opt.getValue();
            };
        },
        draw: function ( ctx ) {
            var opt = this;

            if(!opt.inComplete){
                easeMove(opt.optRect, opt.optRectTarget);
                easeMove(opt.valueText, opt.valueTextTarget);
                easeMove(opt.optText, opt.optTextTarget);
                easeMove(opt.upgradeRect, opt.upgradeRectTarget);
                easeMove(opt.upgradeText, opt.upgradeTextTarget);
                if(opt.optRect.y - opt.optRectTarget.y < 1){
                    opt.inComplete = true;
                }
            }
            opt.optRect.draw(ctx);
            opt.optText.draw(ctx);
            opt.valueText.draw(ctx);
            opt.upgradeRect.draw(ctx);
            opt.upgradeText.draw(ctx);
        },
        move: function (  ) {
            this.optRect.move();
            this.optText.move();
            this.valueText.move();
            this.upgradeRect.move();
            this.upgradeText.move();
        }
    };

    var init = function ( list, backClick ) {
        var width = global.width,
            height = global.height,
            indexH,
            indexW,
            dh,
            fontSize = 20;
        backEvent = backClick;

        inComplete = false;
        isRemoved = false;
        removing = false;
        isInit = false;

        optHeight = global.optHeight * 1.5;
        optWidth = global.optWidth * 1.5;
        dh = optHeight * 2;
        indexH = height / 5 + dh;
        indexW = width / 2 - optWidth / 2;

        options = [];

        if(!Array.isArray(list)){
            throw TypeError('storeMenu init(): params are not right!');
        }
        for(var i in list){
            var obj = {
                optHeight: optHeight,
                optWidth: optWidth,
                optText: list[i].name,
                getValue: list[i].getValue,
                x: indexW,
                y: indexH,
                initX: width / 2,
                initY: height + optHeight,
                fontSize: fontSize,
                clickEvent: list[i].click
            };
            options.push(new Option(obj));
            indexH += dh;
        }

        storeText.text = 'STORE';
        storeText.fontSize = fontSize * 1.4;
        storeText.x = width / 2;
        storeText.y = -optHeight;
        storeTextTarget.x = width / 2;
        storeTextTarget.y = height / 5;

        backText.text = 'BACK';
        backText.fontSize = fontSize;
        backText.x = width / 2;
        backText.y = height + optHeight;
        backTextTarget.x = width / 2;
        backTextTarget.y = indexH + optHeight * 0.7;

        backRect.width = optWidth / 2;
        backRect.height = optHeight;
        backRect.x = width / 2 - backRect.width / 2;
        backRect.y = height + optHeight;
        backRectTarget.x = width / 2 - backRect.width / 2;
        backRectTarget.y = indexH;

    };

    var mouseMoveEvent = function ( e ) {
        var pos = util.getEventPosition(e);

        var flag = true;
        for(var i in options){
            if(options[i].upgradeRect.isInclude(pos.x, pos.y)){
                flag = false;
                util.setCursor('pointer');
                options[i].upgradeRect.fillColor = '#ddd';
            } else{
                options[i].upgradeRect.fillColor = '#fff';
            }
        }
        if(backRect.isInclude(pos.x, pos.y)){
            flag = false;
            util.setCursor('pointer');
            backRect.fillColor = '#ddd';
        } else{
            backRect.fillColor = '#fff';
        }
        if(flag){
            util.setCursor('default');
        }
    };

    var mouseClickEvent = function ( e ) {
        var pos = util.getEventPosition(e);

        for(var i in options){
            if(options[i].upgradeRect.isInclude(pos.x, pos.y)){
                options[i].clickEvent(e);
                options[i].valueText.text = '' + options[i].getValue();
            }
        }
        if(backRect.isInclude(pos.x, pos.y)){
            backEvent();
        }
        util.setCursor('default');
    };

    var draw = function (  ) {

        if(!inComplete && !isInit){
            var flag = true;
            for(var i = 0; i < options.length; i++){
                if(options[i].inComplete === false){
                    flag = false;
                }
            }
            inComplete = flag;
        }

        if(inComplete && !isInit){
            isInit = true;
            global.canvasElement.addEventListener('mousemove', mouseMoveEvent);
            global.canvasElement.addEventListener('click', mouseClickEvent);
        }

        if(removing){
            storeText.move();
            backRect.move();
            backText.move();
            for(var i = 0; i < options.length; i++){
                options[i].move();
            }
        }

        for(var i = 0; i < options.length; i++){
            options[i].draw(global.context);
        }

        storeText.draw(global.context);
        backRect.draw(global.context);
        backText.draw(global.context);

        easeMove(storeText, storeTextTarget);
        easeMove(backRect, backRectTarget);
        easeMove(backText, backTextTarget);
    };

    var removeEvents = function (  ) {
        global.canvasElement.removeEventListener('mousemove', mouseMoveEvent);
        global.canvasElement.removeEventListener('click', mouseClickEvent);
    };

    var remove = function (  ) {
        var defer = $.Deferred();

        removeEvents();

        removing = true;

        backText.vx = backRect.vx = (Math.random() * 10 + 2) * (Math.random() < 0.5 ? 1 : -1);
        backText.vy = backRect.vy = - (Math.random() * 10 + 5);
        backText.ay = backRect.ay =  Math.random() + 1;

        storeText.vx = (Math.random() * 10 + 2) * (Math.random() < 0.5 ? 1 : -1);
        storeText.vy = - (Math.random() * 10 + 5);
        storeText.ay =  Math.random() + 0.5;

        for(var i = 0; i < options.length; i++){
            var vx = (Math.random() * 10 + 2) * (Math.random() < 0.5 ? 1 : -1);
            var vy = - (Math.random() * 10 + 5);
            var ay = Math.random() + 1;
            var opt = options[i];
            opt.optText.vx = opt.optRect.vx = opt.valueText.vx = opt.upgradeText.vx = opt.upgradeRect.vx = vx;
            opt.optText.vy = opt.optRect.vy = opt.valueText.vy = opt.upgradeText.vy = opt.upgradeRect.vy = vy;
            opt.optText.ay = opt.optRect.ay = opt.valueText.ay = opt.upgradeText.ay = opt.upgradeRect.ay = ay;
        }

        var inter = function (  ) {
            if(storeText.y - storeText.fontSize > global.height){
                defer.resolve();
                window.clearInterval(inter);
            }
        };

        window.setInterval(inter, 200);

        return defer;
    };

    return {
        init: init,
        draw: draw,
        remove: remove
    };
});