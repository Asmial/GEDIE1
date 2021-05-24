import $ from 'jquery';
window['jQuery'] = window['$'] = $;
import * as ve from './videoElements';
import * as socket from './socket';
import Hls from 'hls.js';
var dashsupp = false;
var hlssupp = false;
if (('WebKitMediaSource' in window || 'MediaSource' in window)) {
    dashsupp = true;
}



$(() => {
    const bootstrap = require('bootstrap/dist/js/bootstrap.bundle');
    if (dashsupp) {
        import(
            /* webpackChunkName: "dashjs" */
            'dashjs').then(module => {
                const dashjs = module.default;
                var player = dashjs.MediaPlayer().create();
                player.initialize(ve.video, "video/output/out_highest_dash.mpd", false);
            });
    } else {
        if (ve.video.canPlayType('application/vnd.apple.mpegurl')) {
            ve.video.src = "video/hls.m3u8";
        } else {
            import(
                /* webpackChunkName: "hlsjs" */
                'hls.js').then(module => {
                    const Hls = module.default;
                    if (Hls.isSupported()) {
                        var hls = new Hls();
                        hlssupp = true;
                        hls.renderTextTracksNatively = false;
                        hls.attachMedia(document.getElementById('video'));
                        hls.loadSource("video/hls.m3u8");
                    } else {
                        $(ve.video).append(`<source src="video/video.mp4" type="video/mp4"/>`);
                    }
                });
        }
    }

    

    require('./muslos');

    const vp = require('./videoPlayer');
    const vc = require('./videoCards');
    const vt = require('./videoTracks');
    const sc = require('./secuencias');
    const ac = require('./actores');
    const ms = require('./muslos');

    require('./videoEvents');

    window['vc'] = vc;
    window['vt'] = vt;
    window['ve'] = ve;

    window['sc'] = sc;
    window['ac'] = ac;
    window['ms'] = ms;

    ve.decisionAudio.loop = true;

    $(document).on('keypress', function (e) {
        e.preventDefault();
        switch (e.key) {
            case ' ':
            case 'k':
                if (!ve.playButton.hasClass("d-none")) {
                    vp.togglePlay();
                }
                break;
            case 'f':
                vp.toggleFullScreen();
                break;
            case 'c':
                vp.toggleSubs();
                break;
            default:
                console.log('has pulsado ' + e.key);
        }
    });

    // Activar los toggles de los iconos del video
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })

    vp.setVolume(Number(ve.volumeSlider.val()))
})

