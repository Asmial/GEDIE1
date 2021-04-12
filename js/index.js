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

$(() => {
    require("./videoEvents");
    require("./secuencias");
    require("./actores");
    require("./videoTracks")

    window['vc'] = vc;
    window['vt'] = vt;
    window['ve'] = ve;

    function desapareceEscena(num) {
        var str = "#eleccion" + num
        $(str).hide(500)
    }

    function apareceEscena(num) {
        var str = "#eleccion" + num
        $(str).show(500)
    }

    window['sc'] = sc;

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

    // Activar los toggles de los iconos del video
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })

    vp.setVolume(Number(ve.volumeSlider.val()))
})


