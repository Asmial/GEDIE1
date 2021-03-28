import $ from 'jquery';
import * as ve from './videoElements';
import * as vc from './videoCards';

var canHideControls = true;
/** @type {NodeJS.Timeout} */
var hideControlsEvent;

export function mustHideControls() {
    canHideControls = true;
}

/**
 * @param {number} delay
 */
export function waitHideControls(delay) {
    hideControlsEvent = setTimeout(hideControls, delay);
}

export function hideControls() {
    if (!(ve.video.paused || ve.video.ended) && canHideControls) {
        $(ve.videoContainer).css('cursor', 'none');
        ve.videoControls.fadeOut(100);
        if (hideControlsEvent)
            clearTimeout(hideControlsEvent);
    }
}

export function toggleMute() {
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

export function toggleFullScreen() {
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

export function togglePlay() {
    if (ve.video.paused || ve.video.ended) {
        ve.video.play();
    } else {
        ve.video.pause();
    }
}

/**
* @param {number} volume
*/
export function setVolume(volume) {
    ve.video.volume = volume;
    ve.video.muted = false;
}

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

$(() => {

    ve.video.onplay = function () {
        var cueList = ve.video.textTracks[0];
        var cueObject = cueList

        console.log(cueList)

        var event = new CustomEvent('custom_event', 
        );

        
        //cueObject.dispatchEvent(event)
        
    }

    ve.muteToggle.on('click', toggleMute);

    ve.videoControls.on('mousemove mouseenter', (e) => {
        e.stopPropagation();
        canHideControls = false;
    });

    ve.videoControls.on('mouseout', (e) => {
        canHideControls = true;
        hideControlsEvent = setTimeout(hideControls, 1500);
    });

    $(ve.videoContainer).on('mousemove', (e) => {
        if (hideControlsEvent)
            clearTimeout(hideControlsEvent);

        $(ve.videoContainer).css('cursor', '');

        ve.videoControls.fadeIn(100);
        hideControlsEvent = setTimeout(hideControls, 1500);
    });

    ve.playButton.on('click', togglePlay);

    ve.playMain.on('click', ve.video.play);

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

    $(ve.videoContainer).on('dblclick', toggleFullScreen);

    $(ve.videoContainer).on('click touchStart touchend', (e) => {
        if (!vc.isCardsShown()) {
            if (e.type == 'click') {
                togglePlay()
                console.log(e.type)
            }
            else {
                console.log(e.type);
                e.stopPropagation();
                e.preventDefault();
                if (ve.video.ended || ve.video.paused) {
                    ve.video.play();
                }
                else if (ve.videoControls.css('display') === 'none') {
                    ve.videoControls.fadeIn(100);
                    waitHideControls(3000);
                } else {
                    mustHideControls()
                    hideControls();
                }
                mustHideControls();
            }
        }
    });

    $(ve.video).on('volumechange', volumeChanged)

    ve.volumeSlider.on('input', () => {
        setVolume(Number(ve.volumeSlider.val()));
    });

    ve.videoControls.on('click dblclick touchend', (e) => {
        e.stopPropagation();
    });
})
