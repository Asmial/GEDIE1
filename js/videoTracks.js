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
export function goToScene(num) {
    going = true;
    ve.video.currentTime = decisionCues[num].startTime
}

/**
 * @param {number} num
 *  @param {number} data
 */
function playSound(num, data) {
    going = true;
    //ve.audioTrap.
    //goToScene(data)
}

var waitDisableGoing;

var status = {
    haComido: false,
    levantamientos: 0,
    levantar: false,
    escenas: []
};

function levantar() {
    going = true;
    status.levantar = true;
}

/**
 * @param {TextTrackCue} cue
 * @param {{ [x: string]: any; decision: number; seguir: number; pregunta: string; respuesta0: string; respuesta1: string; escena0: number; escena1: number; }} data
 */
function decision(cue, data) {

    waitDisableGoing = setTimeout(() => {
        going = false;
    }, 100);

    if (!data['levantando'] && !data['pesa']) {
        status.levantar = false;
        status.levantamientos = 0;
    }

    if (data['comido']) status.haComido = true;
    else if (data['noComido']) status.haComido = false;

    console.log(data);

    if(data['decision'] >= 0) {
        console.log("decision");
        status.escenas.push(data.decision);
        es.hideSecuencias(data.decision);
        es.showSecuencia(data.decision)
    }

    if (data['levantando']) {
        status.levantamientos++;
        status.levantar = false;
    } else if (data['pesa']) {
        going = false;
        if (vc.getCardsCallbacks()[0] != levantar) {
            vc.setCardsCallbacks(levantar, () => { goToScene(data.seguir) });
        }
        if (status.levantamientos == 0) {
            vc.setCardsText(data.pregunta, data.respuesta0, null);
        } else {
            vc.setCardsText(data.pregunta, data.respuesta0, data.respuesta1);
        }
        vc.showCards();
    } else if (data['pregunta']) {
        if (!data['respuesta1'])
            data['respuesta1'] = null

        vc.setCardsText(data.pregunta, data.respuesta0, data.respuesta1);

        vc.showCards();

        if (data['escena0']) {
            if (!data['escena1'])
                data['escena1'] = null
            vc.setCardsCallbacks(() => goToScene(data.escena0), () => goToScene(data.escena1));
        }
    } else {
        vc.hideCards();
    }
}

$(() => {

    textTracks = ve.video.textTracks;
    decisionTrack = textTracks[0];
    decisionCues = decisionTrack.cues;

    $('.escena').on('click', function (e) {
        var escena = $(this).children().get(0).id;
        var numEscena = parseInt(escena.substring(8));
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

            if (data['pesa'])
                cue.onexit = function () {
                    if (status.levantamientos >= 4 && status.levantar) {
                        goToScene(data.morirse)
                    } else if (!status.levantar && !going) {
                        goToScene(data.next)
                    }
                };
            if (data['muerte'])
                cue.onexit = ve.video.pause
            else if (data['comida'])
                cue.onexit = function () {
                    if (status.haComido) {
                        goToScene(data.haComido)
                    } else {
                        goToScene(data.noHaComido)
                    }
                };
            else if (data['next']) {
                cue.onexit = () => { if (!going) { goToScene(data.next) } }
            }
            cue.onenter = (e) => decision(this, data);
        }
        start = decisionCues.length;
    });
});