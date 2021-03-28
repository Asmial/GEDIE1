import $ from 'jquery';
import * as ve from './videoElements';
import * as vp from './videoPlayer';

$(() => {

    $(document).on('fullscreenchange', () => {
        if (document.fullscreenElement) {
            var icon = ve.fullscreenToggle.children()
            ve.fullscreenToggle.attr('data-title', 'Pantalla Completa (f)');
            icon.removeClass("mdi-fullscreen");
            icon.addClass("mdi-fullscreen-exit");
        } else {
            var icon = ve.fullscreenToggle.children()
            ve.fullscreenToggle.attr('data-title', 'Salir de Pantalla Completa (f)');
            icon.removeClass("mdi-fullscreen-exit");
            icon.addClass("mdi-fullscreen");
        }
    });

    $(ve.video).on('play', () => {
        var icon = ve.playButton.children();
        ve.playButton.attr('data-title', 'Pausar (k)');
        icon.removeClass("mdi-play");
        icon.addClass("mdi-pause");
        vp.waitHideControls(1500);
    });

    $(ve.video).on('pause', () => {
        var icon = ve.playButton.children()
        ve.playButton.attr('data-title', 'Reproducir (k)')
        icon.removeClass("mdi-pause");
        icon.addClass("mdi-play");
        ve.playMain.show(300);
        ve.videoControls.fadeIn(100);
    });

    $(ve.video).on('volumechange', () => {
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
    });
});