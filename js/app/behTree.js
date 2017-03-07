/**
 * Created by lzh on 2017/3/7.
 */

define(['behNode'],function ( behNode ) {
    function BehTree(  ) {
        this.root = null;
    }
    BehTree.prototype = {
        constructor: BehTree,
        execute: function (  ) {
            if(this.root){
                console.log(this.root.execute);
                this.root.execute.call(this.root, arguments);
            }
        }
    };
    return BehTree;
});