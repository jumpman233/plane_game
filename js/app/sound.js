/**
 * Created by lzh on 2017/2/28.
 */

define([],function (  ) {
    function Sound(  ) {
        this.backgroundAudio = null;
    }
    Sound.prototype = {
        constructor: Sound,
        init: function ( params ) {
            var sound = this;
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
            if(params.backgroundAudio){
                sound.backgroundAudio = params.backgroundAudio;
                sound.backgroundAudio.loop = sound;
            }
            this.addSoundChangeEvent(function (  ) {
                sound.backgroundAudio.volume = sound.getCurSound();
            });
        },
        playBackgoundMusic: function (  ) {
            var sound = this;
            if(sound.backgroundAudio.paused){
                sound.backgroundAudio.play();
            } else{
                sound.backgroundAudio.pause();
                sound.backgroundAudio.currentTime = 0;
                sound.backgroundAudio.play();
            }
        },
        addSoundChangeEvent: function (func) {
            if(typeof func == 'function'){
                $('#soundSlider').change(func);
            }
        },
        getCurSound: function(  ) {
            return $('#soundSlider')[0].valueAsNumber;
        },
        playAudio: function (params) {
            if(!params.src || !params.currentSrc){
                throw Error("playAudio lack of param src!");
            }
            var path = params.src|| params.currentSrc;
            var audio = new Audio(path);
            if(params.loop){
                audio.loop = true;
            }
            audio.volume = this.getCurSound();
            audio.play();

            return audio;
        }
    };
    return new Sound();
});