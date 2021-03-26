import $ from 'jquery';
window['jQuery'] = window['$'] = $;
import bootstrap from 'bootstrap';


$(() => {
    const ve = require('./videoElements');

    require("./videoEvents");

    //Hay que quitar esto !!!!!!!!!!
    ve.video.currentTime = 18;



    ve.muteToggle.on('click', toggleMute)

    function toggleMute() {
        ve.video.muted = !ve.video.muted;
        var icon = ve.muteToggle.children();

        if (ve.video.muted) {
            icon.removeClass('mdi-volume-high');
            icon.addClass('mdi-volume-off');
        } else {
            icon.addClass('mdi-volume-high');
            icon.removeClass('mdi-volume-off');
        }
    }

    function hambreDot(num) {
        var str = "#hambre-dot" + num
        $(str).hide(300)
    }

    $(document).on('keypress', function (e) {
        switch (e.key) {
            case ' ':
            case 'w':
                togglePlay();
                break;
            case '1':
                hambreDot(1);
                break;
            default:
                console.log('has pulsado ' + e.key);
        }
    })

    const videoWorks = !!document.createElement('video').canPlayType;
    if (videoWorks) {
        ve.video.controls = false;
        ve.videoControls.removeClass('hidden');
    }

    function togglePlay() {
        if (ve.video.paused || ve.video.ended) {
            ve.video.play();
        } else {
            ve.video.pause();
        }
    }

    /**
     * @param {number} volume
     */
    function setVolume(volume) {
        ve.video.volume = volume;
        ve.video.muted = false;
    }

    setVolume(Number(ve.volumeSlider.val()))

    function volumeChanged() {
        ve.volumeSlider.val(ve.video.volume)
        var icon = ve.muteToggle.children();

        if (!ve.video.muted) {
            if (ve.video.volume < .25) {
                icon.removeClass(icon.get(0).classList[1]);
                icon.addClass('mdi-volume-low');
            } else if (ve.video.volume < .75) {
                icon.removeClass(icon.get(0).classList[1]);
                icon.addClass('mdi-volume-medium');
            } else {
                icon.removeClass(icon.get(0).classList[1]);
                icon.addClass('mdi-volume-high');
            }
        }


    }

    ve.volumeSlider.on('input', () => {
        setVolume(Number(ve.volumeSlider.val()))
    });

    function toggleFullScreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
            // @ts-ignore
        } else if (document.webkitFullscreenElement) {
            // Need this to support Safari
            // @ts-ignore
            document.webkitExitFullscreen();
            // @ts-ignore
        } else if (ve.videoContainer.webkitRequestFullscreen) {
            // Need this to support Safari
            // @ts-ignore
            ve.videoContainer.webkitRequestFullscreen();
        } else {
            ve.videoContainer.requestFullscreen();
        }
    }



    ve.playButton.on('click', togglePlay);

    ve.fullscreenToggle.on('click', toggleFullScreen);

    ve.volumeSlider.on('DOMMouseScroll mousewheel', (e) => {
        e.preventDefault()
        // @ts-ignore
        if (e.originalEvent.detail > 0 || e.originalEvent.wheelDelta < 0) {
            ve.volumeSlider.val(ve.volumeSlider.val() <= .1 ? 0 : Number(ve.volumeSlider.val()) - .1)
        } else {
            ve.volumeSlider.val(ve.volumeSlider.val() >= .9 ? 1 : Number(ve.volumeSlider.val()) + .1);
        }
        setVolume(Number(ve.volumeSlider.val()))
    })

    $('#video-container').on('dblclick', toggleFullScreen)
    $(ve.video).on('click', togglePlay)

    $(ve.video).on('volumechange', volumeChanged)
})


