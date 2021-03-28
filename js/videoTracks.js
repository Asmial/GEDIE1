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

$(() => {

    textTracks = ve.video.textTracks;
    decisionTrack = textTracks[0];
    console.log(decisionTrack);
    decisionCues = decisionTrack.cues;

    // @ts-ignore
    $('.escena').on('click', function (e) {
        var escena = $(this).children().get(0).id;
        var numEscena = parseInt(escena[escena.length - 1]);
        es.hideSecuencias(numEscena);
        goToScene(numEscena)
    });

    decisionTrack.oncuechange = function (e) {
        if (this.activeCues.length > 0) {
            going = false;
            /** @type {VTTCue} */
            // @ts-ignore
            var track = this.activeCues[0];

            // @ts-ignore
            var data = JSON.parse(track.text);
            if (data['next'])
                track.onexit = () => {
                    if (!going) goToScene(data.next)
                };

            if (data['pregunta']) {
                if (data['respuesta1']) {
                    vc.setCardsText(data.pregunta, data.respuesta0, data.respuesta1);
                    vc.setCardsCallbacks(() => { goToScene(data.escena0) }, () => { goToScene(data.escena1) });
                }
                else {
                    vc.setCardsText(data.pregunta, data.respuesta0);
                    vc.setCardsCallbacks(() => { goToScene(data.escena0) });
                }
                vc.showCards()
            }
        }
    }
})