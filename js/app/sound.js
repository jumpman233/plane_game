/**
 * Created by lzh on 2017/2/28.
 */

define(['global'],function ( global ) {
    function Sound(  ) {
        this.backgroundAudio = null;
    }
    Sound.prototype = {
        constructor: Sound,
        init: function ( params ) {
            var sound = this;
            var defer = $.Deferred(),
                soundImg = $('#soundImg'),
                soundSlider = $('#soundSlider'),
                soundEle = $('#sound'),
                left = global.canvasElement.offsetLeft + global.width - 140;
            soundEle.css('left', (left + 104) + 'px');
            soundEle.css('visibility', 'visible');
            soundImg.click(function () {
                if(soundSlider.attr('display') == 'false'){
                    soundSlider.attr('display', 'true');
                    soundSlider.css('display','inline-block');
                    soundEle.css('left', left + 'px');
                } else{
                    soundSlider.attr('display', 'false');
                    soundSlider.css('display','none');
                    soundEle.css('left', (left + 104) + 'px');
                }
            });
            $(document).click(function ( e ) {
                if(e.target != soundImg[0] &&
                    e.target != soundSlider[0] &&
                    soundSlider.attr('display') == 'true'){
                    soundSlider.attr('display', 'false');
                    soundSlider.css('display','none');
                    soundEle.css('left', (left + 104)+'px');
                }
            });
            if(params.backgroundAudio){
                sound.backgroundAudio = params.backgroundAudio;
                window.setInterval(function (  ) {
                    if(sound.backgroundAudio.ended){
                        sound.backgroundAudio.load();
                        sound.backgroundAudio.play();
                    } else{
                    }
                },1000);
                sound.backgroundAudio.loop = true;
            }
            sound.backgroundAudio.volume = localStorage.getItem('sound') || 1;
            $('#soundSlider').attr('value', sound.backgroundAudio.volume);
            this.addSoundChangeEvent(function (  ) {
                sound.backgroundAudio.volume = sound.getCurSound();
                localStorage.setItem('sound', sound.backgroundAudio.volume);
            });
            defer.resolve();
            return defer;
        },
        playBackgroundMusic: function (  ) {
            var sound = this;
            if(sound.backgroundAudio.paused){
                sound.backgroundAudio.play();
            } else{
                sound.backgroundAudio.play();
            }
        },
        replayBackgroundMusic: function (  ) {
            var sound = this;

            sound.backgroundAudio.load();
            sound.backgroundAudio.play();
        },
        stopBackgroundMusic: function (  ) {
            var sound = this;
            sound.backgroundAudio.pause();
            sound.backgroundAudio.currentTime = 0;
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
                throw TypeError("playAudio lack of param src!");
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