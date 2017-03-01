/**
 * Created by lzh on 2017/2/28.
 */

define([],function (  ) {
    function Sound(  ) {
    }
    Sound.prototype = {
        constructor: Sound,
        init: function (  ) {
            $('#soundImg').click(function () {
                if($('#soundSlider').attr('display') == 'false'){
                    $('#soundSlider').attr('display', 'true');
                    $('#soundSlider').css('display','inline-block');
                    $('#sound').css('left','780px');
                } else{
                    $('#soundSlider').attr('display', 'false');
                    $('#soundSlider').css('display','none');
                    $('#sound').css('left','884px');
                }
            });
        },
        addSoundChangeEvent: function (func) {
            if(typeof func == 'function'){
                $('#soundSlider').change(func);
            }
        }
    };
    return new Sound();
});