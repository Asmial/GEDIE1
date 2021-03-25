const $ = require('jquery');
window['jQuery'] = window['$'] = $;
var bootstrap = require('bootstrap')

jQuery(() => {

    /** @type HTMLVideoElement */
    // @ts-ignore
    const video = $('#video').get(0);
    const videoControls = $('#video-controls');

    const playButton = $('#play-button');
    const volumeSlider = $('#volume-slider');


    $(document).on('keypress', function (e) {
        switch (e.key) {
            case ' ':
            case 'k':
                togglePlay();
                break;
            default:
                console.log('has pulsado ' + e.key);
        }
    })

    const videoWorks = !!document.createElement('video').canPlayType;
    if (videoWorks) {
        video.controls = false;
        videoControls.removeClass('hidden');
    }

    function togglePlay() {
        if (video.paused || video.ended) {
            video.play();
        } else {
            video.pause();
        }
    }

    /**
     * @param {number} volume
     */
    function setVolume(volume) {
        video.volume = volume
    }

    volumeSlider.on('input', () => {
        setVolume(Number(volumeSlider.val()))
    })

    playButton.on('click', togglePlay);

    $(video).on('play pause', () => {
        var icon = playButton.children()
        if (video.paused) {
            playButton.attr('data-title', 'Reproducir (k)')
            icon.removeClass("fa-pause");
            icon.addClass("fa-play");
        } else {
            playButton.attr('data-title', 'Pausar (k)')
            icon.removeClass("fa-play")
            icon.addClass("fa-pause");
        }
    });

})


