import $ from 'jquery';
window['jQuery'] = window['$'] = $;
import * as ve from './videoElements';
// @ts-ignore
import * as room from './room';
// @ts-ignore
import Hls from 'hls.js';
var dashsupp = false;
var hlssupp = false;
if (('WebKitMediaSource' in window || 'MediaSource' in window)) {
    dashsupp = true;
}

$(() => {
    // @ts-ignore
    const bootstrap = require('bootstrap/dist/js/bootstrap.bundle');
    if (dashsupp) {
        import(
            /* webpackChunkName: "dashjs" */
            'dashjs').then(module => {
                const dashjs = module.default;
                var player = dashjs.MediaPlayer().create();
                player.initialize(ve.video, "/adaptive/out_dash.mpd", false);
            });
    } else {
        if (ve.video.canPlayType('application/vnd.apple.mpegurl')) {
            ve.video.src = "/adaptive/hls.m3u8";
        } else {
            import(
                /* webpackChunkName: "hlsjs" */
                'hls.js').then(module => {
                    const Hls = module.default;
                    if (Hls.isSupported()) {
                        var hls = new Hls();
                        hlssupp = true;
                        // @ts-ignore
                        hls.renderTextTracksNatively = false;
                        // @ts-ignore
                        hls.attachMedia(document.getElementById('video'));
                        hls.loadSource("/adaptive/hls.m3u8");
                    } else {
                        $(ve.video).append(`<source src="/assets/video/video.mp4" type="video/mp4"/>`);
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

    vp.setVolume(Number(ve.volumeSlider.val()))
})


