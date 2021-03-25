const $ = require('jquery');

/** @type HTMLVideoElement */
// @ts-ignore
const video = $('#video').get(0);
const playButton = $('#play-button');
const volumeSlider = $('#volume-slider');
const fullscreenToggle = $("#fullscreen-toggle");
const muteToggle = $("#mute-toggle");

$(document).on('fullscreenchange', () => {
    if (document.fullscreenElement) {
        var icon = fullscreenToggle.children()
        fullscreenToggle.attr('data-title', 'Pantalla Completa (f)');
        icon.removeClass("mdi-fullscreen");
        icon.addClass("mdi-fullscreen-exit");
    } else {
        var icon = fullscreenToggle.children()
        fullscreenToggle.attr('data-title', 'Salir de Pantalla Completa (f)');
        icon.removeClass("mdi-fullscreen-exit");
        icon.addClass("mdi-fullscreen");
    }
});

$(video).on('play', () => {
    var icon = playButton.children();
    playButton.attr('data-title', 'Pausar (k)');
    icon.removeClass("mdi-play");
    icon.addClass("mdi-pause");
});

$(video).on('pause', () => {
    var icon = playButton.children()
    playButton.attr('data-title', 'Reproducir (k)')
    icon.removeClass("mdi-pause");
    icon.addClass("mdi-play");
});

$(video).on('volumechange', () => {
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
});