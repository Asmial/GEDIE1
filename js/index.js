import $ from 'jquery';
window['jQuery'] = window['$'] = $;
import bootstrap from 'bootstrap';
import { setHungerLevel } from './muslos';
import * as ve from './videoElements'
import * as vp from './videoPlayer'
import * as vc from './videoCards'
import * as vt from './videoTracks'

$(() => {
    require("./videoEvents");
    require("./secuencias");
    require("./videoTracks")

    window['vc'] = vc;
    window['vt'] = vt;

    function desapareceEscena(num) {
        var str = "#eleccion" + num
        $(str).hide(500)
    }

    function apareceEscena(num) {
        var str = "#eleccion" + num
        $(str).show(500)
    }

    window['video'] = ve.video;



    $(document).on('keypress', function (e) {
        e.preventDefault();
        switch (e.key) {
            case ' ':
            case 'k':
                vp.togglePlay();
                break;
            default:
                console.log('has pulsado ' + e.key);
        }
    });

    vp.setVolume(Number(ve.volumeSlider.val()))
})


