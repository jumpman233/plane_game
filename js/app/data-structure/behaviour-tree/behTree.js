/**
 * Created by lzh on 2017/3/7.
 */

define(['behNode'],function ( behNode ) {
    'use strict';
    function BehTree(  ) {
        this.root = null;
    }
    BehTree.prototype = {
        constructor: BehTree,
        execute: function (  ) {
            var args = arguments;
            if(typeof args == 'object' && args.length ==1){
                args = arguments[0];
            }
            if(this.root){
                this.root.execute.call(this.root, args);
            }
        }
    };
    return BehTree;
});