import $ from 'jquery';
window['jQuery'] = window['$'] = $;
import bootstrap from 'bootstrap';
import { setHungerLevel } from './muslos';
import * as ve from './videoElements'
import * as vp from './videoPlayer'
import * as vc from './videoCards'
import * as vt from './videoTracks'
import * as sc from './secuencias'
import * as ac from './actores'
import * as ms from './muslos'

$(() => {
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


