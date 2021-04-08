import $ from 'jquery';
import * as ve from './videoElements';
import * as es from './secuencias';
import * as vc from './videoCards';

/** @type {TextTrackList} */
export var textTracks;
/** @type {TextTrack} */
export var decisionTrack;
/** @type {TextTrackCueList} */
export var decisionCues;

var going = false;

/**
 * @param {number} num
 */
function goToScene(num) {
    going = true;
    ve.video.currentTime = decisionCues[num].startTime
}

var waitDisbaleGoing;

/**
 * @param {{ [x: string]: any; pregunta: string; respuesta0: string; respuesta1: string; escena0: number; escena1: number; }} data
 */
function decision(data) {
    waitDisbaleGoing = setTimeout(() => {
        going = false;
    }, 1000);

    if (data['pregunta']) {
        if (!data['respuesta1'])
            data['respuesta1'] = null

        vc.setCardsText(data.pregunta, data.respuesta0, data.respuesta1);

        vc.showCards();

        if (data['escena0']) {
            if (!data['escena1'])
                data['escena1'] = null
            vc.setCardsCallbacks(() => goToScene(data.escena0), () => goToScene(data.escena1));
        }

        if (data['musica0']) {
            if (!data['musica1'])
                data['musica1'] = null
            vc.setCardsCallbacks(() => goToScene(data.escena0), () => goToScene(data.escena1));
        }
    } else vc.hideCards();
}

$(() => {

    textTracks = ve.video.textTracks;
    decisionTrack = textTracks[0];
    decisionCues = decisionTrack.cues;

    // @ts-ignore
    $('.escena').on('click', function (e) {
        var escena = $(this).children().get(0).id;
        var numEscena = parseInt(escena[escena.length - 1]);
        es.hideSecuencias(numEscena);
        going = true;
        goToScene(numEscena);
    });

    var start = 0;

    decisionTrack.mode = 'hidden';

    decisionTrack.addEventListener('cuechange', () => {
        for (let i = start; i < decisionCues.length; i++) {
            /** @type {VTTCue} */
            // @ts-ignore
            const cue = decisionCues[i];
            const data = JSON.parse(cue.text);

            if (data['next'])
                cue.onexit = function () {
                    if (!going) { goToScene(data.next) }
                };

            cue.onenter = (e) => decision(data);
        }
        start = decisionCues.length;
    });
});