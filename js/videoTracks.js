import $ from 'jquery';
import * as ve from './videoElements';
import * as es from './secuencias';

var textTracks = ve.video.textTracks
var decisionTrack = textTracks[0]
var decisionCues = decisionTrack.cues

function goToScene(num) {
    ve.video.currentTime = decisionCues[num].startTime
}

$(() => {

    $('.escena').on('click', function (e) {
        var escena = $(this).children().get(0).id;
        var numEscena = parseInt(escena[escena.length - 1]);
        es.hideSecuencias(numEscena);
        goToScene(numEscena)
    });

    $(ve.video).
})