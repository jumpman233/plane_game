/**
 * Created by lzh on 2017/3/7.
 */

define(['util'],function ( util ) {
    'use strict';
    function virtualFunc(  ) {
        throw TypeError('this method is virtual!');
    }

    function BehNode(  ) {
        this.childList = [];
        this.parentNode = null;
        if(typeof arguments[0] == 'object' && arguments.length >= 0){
            this.name = arguments[0][0];
        }
    }
    BehNode.prototype = {
        constructor: BehNode,
        execute: virtualFunc,
        addChild: function ( child) {
            child.parentNode = this;
            this.childList.push(child);
        },
        addChildren: function () {
            var node = this;
            if(arguments[0].length >= 0){
                var array = arguments[0];
                for(var i in array){
                    if(array[i] instanceof BehNode){
                        array[i].parentNode = node;
                        node.childList.push(array[i]);
                    }
                }
            }
        }
    };

    function Sequence(  ) {
        BehNode.call(this,arguments);
    }
    Sequence.prototype = util.inherit(BehNode.prototype);
    Sequence.prototype.constructor= Sequence;
    Sequence.prototype.execute= function (  ) {
        var seq = this;
        var args = arguments;
        if(typeof args == 'object' && args.length ==1){
            args = arguments[0];
        }
        for(var i in seq.childList){
            if(! seq.childList[i].execute.call(seq.childList[i], args)){
                return false;
            }
        }
        return true;
    };

    function Selector(  ) {
        BehNode.call(this,arguments);
    }
    Selector.prototype = util.inherit(BehNode.prototype);
    Selector.prototype.constructor = Selector;
    Selector.prototype.execute = function () {
        var args = arguments;
        if(typeof args == 'object' && args.length ==1){
            args = arguments[0];
        }
        var sel = this;
        for(var i in sel.childList){
            if(sel.childList[i].execute.call(sel.childList[i], args)){
                return true;
            }
        }
        return false;
    };

    function Action( func ) {
        BehNode.call(this,arguments);

        if(typeof func == 'function'){
            this.act = func;
        }
    }
    Action.prototype = util.inherit(BehNode.prototype);
    Action.prototype.constructor = Action;
    Action.prototype.execute = function () {
        var args = arguments;
        if(typeof args == 'object' && args.length ==1){
            args = arguments[0];
        }
        if(typeof this.act == 'function'){
            this.act.call(this,args);
            return true;
        } else{
            throw TypeError('Action execute act is not a function!');
        }
    };

    function Condition( func ) {
        BehNode.call(this,arguments);

        if(typeof func == 'function'){
            this.cond = func;
        }
    }
    Condition.prototype = util.inherit(util.inherit(BehNode.prototype));
    Condition.prototype.constructor = Condition;
    Condition.prototype.execute = function (  ) {
        var args = arguments;
        if(typeof args == 'object' && args.length ==1){
            args = arguments[0];
        }
        if(typeof this.cond == 'function'){
            return this.cond.call(this,args);
        } else{
            throw TypeError('Condition execute cond is not function!');
        }
    };

    return {
        sequence: Sequence,
        selector: Selector,
        action: Action,
        condition: Condition
    };
});