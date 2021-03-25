const $ = require('jquery');
window['jQuery'] = window['$'] = $;
// @ts-ignore
var bootstrap = require('bootstrap')

jQuery(() => {

    /** @type HTMLVideoElement */
    // @ts-ignore
    const video = $('#video').get(0);

    const videoControls = $('#video-controls');
    const playButton = $('#play-button');
    const volumeSlider = $('#volume-slider');
    const videoContainer = $('#video-container').get(0);
    const fullscreenToggle = $("#fullscreen-toggle");
    const muteToggle = $("#mute-toggle");

    require("./videoEvents");

    //Hay que quitar esto !!!!!!!!!!
    video.currentTime = 18;

    

    muteToggle.on('click', toggleMute)

    function toggleMute() {
        video.muted = !video.muted;
        var icon = muteToggle.children();

        if (video.muted) {
            icon.removeClass('mdi-volume-high');
            icon.addClass('mdi-volume-off');
        } else {
            icon.addClass('mdi-volume-high');
            icon.removeClass('mdi-volume-off');
        }
    }

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
        video.volume = volume;
        video.muted = false;
    }

    setVolume(Number(volumeSlider.val()))

    function volumeChanged() {
        volumeSlider.val(video.volume)
        var icon = muteToggle.children();

        if (!video.muted) {
            if (video.volume < .25) {
                icon.removeClass(icon.get(0).classList[1]);
                icon.addClass('mdi-volume-low');
            } else if (video.volume < .75) {
                icon.removeClass(icon.get(0).classList[1]);
                icon.addClass('mdi-volume-medium');
            } else {
                icon.removeClass(icon.get(0).classList[1]);
                icon.addClass('mdi-volume-high');
            }
        }


    }

    volumeSlider.on('input', () => {
        setVolume(Number(volumeSlider.val()))
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
        } else if (videoContainer.webkitRequestFullscreen) {
            // Need this to support Safari
            // @ts-ignore
            videoContainer.webkitRequestFullscreen();
        } else {
            videoContainer.requestFullscreen();
        }
    }

    

    playButton.on('click', togglePlay);

    fullscreenToggle.on('click', toggleFullScreen);

    volumeSlider.on('wheel', (event) => {
        event.preventDefault()
        // @ts-ignore
        if (event.originalEvent.deltaY > 0 && video.volume - delta >= 0) {
            // @ts-ignore
            setVolume($(video).volume -= delta)
            //check for scroll up 
        // @ts-ignore
        } else if (event.originalEvent.deltaY < 0 && video.volume + delta <= 1) {
            // @ts-ignore
            setVolume($(video).volume += delta)
        }
        volumeSlider.val()
    })

    $('#video-container').on('dblclick', toggleFullScreen)
    $(video).on('click', togglePlay)
    
    $(video).on('volumechange', volumeChanged)
})


