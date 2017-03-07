/**
 * Created by lzh on 2017/3/7.
 */

define(['util'],function ( util ) {
    function virtualFunc(  ) {
        throw Error('this method is virtual!');
    }

    function BehNode(  ) {
        this.childList = [];
        this.parentNode = null;
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
        console.log("??")
        for(var i in seq.childList){
            if(! seq.childList[i].execute.call(seq.childList[i], arguments)){
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
        var sel = this;
        for(var i in sel.childList){
            if(sel.childList[i].execute.call(sel.childList[i], arguments)){
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
        this.act();
        return true;
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
        console.log(this);
        return this.cond();
    };

    return {
        sequence: Sequence,
        selector: Selector,
        action: Action,
        condition: Condition
    };
});