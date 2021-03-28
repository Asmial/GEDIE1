import $ from 'jquery';
window['jQuery'] = window['$'] = $;
import bootstrap from 'bootstrap';
import { setHungerLevel } from './muslos';
import * as ve from './videoElements'
import * as vp from './videoPlayer'



$(() => {
    require("./videoEvents");
    require("./secuencias");

    function desapareceEscena(num) {
        var str = "#eleccion" + num
        $(str).hide(500)
    }

    function apareceEscena(num) {
        var str = "#eleccion" + num
        $(str).show(500)
    }



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


