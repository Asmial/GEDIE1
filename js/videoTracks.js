import $ from 'jquery';
import * as ve from './videoElements';
import * as es from './secuencias';
import * as ac from './actores';
import * as ms from './muslos';
import * as vc from './videoCards';

/** @type {TextTrackList} */
export var textTracks;
/** @type {TextTrack} */
export var decisionTrack;
/** @type {TextTrackCueList} */
export var decisionCues;
/** @type {TextTrack} */
export var infoActorTrack;
/** @type {TextTrackCueList} */
export var infoActorCues;
/** @type {TextTrack} */
export var infoMuslosTrack;
/** @type {TextTrackCueList} */
export var infoMuslosCues;

var going = false;

/**
 * @param {number} num
 */
export function goToScene(num) {
    going = true;
    ve.video.currentTime = decisionCues[num].startTime
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
 * @param {{decision: any; seguir: number; pregunta: string; respuesta0: string; respuesta1: string; escena0: number; escena1: number; }} data
 */
function decision(cue, data) {

    waitDisableGoing = setTimeout(() => {
        going = false;
    }, 100);

    if (!data['levantando'] && !data['pesa']) {
        status.levantar = false;
        status.levantamientos = 0;
    }

    ve.muerte.addClass("d-none");

    if (data['comido']) status.haComido = true;
    else if (data['noComido']) status.haComido = false;

    if (data['decision'] >= 0) {
        es.hideSecuencias(data.decision);
        es.showSecuencia(data.decision)
    }

    ve.playButton.addClass('d-none');

    if (data['levantando']) {
        ve.decisionAudio.currentTime = 0;
        ve.decisionAudio.pause();
        status.levantamientos++;
        status.levantar = false;
    } else if (data['pesa']) {
        ve.video.play();
        ve.decisionAudio.currentTime = 0;
        ve.decisionAudio.pause();
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
        ve.video.play();

        if (data["nomusica"]) {
            ve.decisionAudio.currentTime = 0;
            ve.decisionAudio.pause();
        } else {
            ve.decisionAudio.play();
        }

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
        ve.decisionAudio.currentTime = 0;
        ve.decisionAudio.pause();
        ve.playButton.removeClass('d-none');
        vc.hideCards();
    }
}


/**
 * @param {undefined} cue
 * @param {{actor: [number]}} data
 * @param {boolean} entra
 */
function actualizarActor(cue, data, entra) {
    if (data['actor']) {
        for (let numActor of data.actor) {
            if (entra) {
                ac.showActor(numActor);
            } else {
                ac.hideActor(numActor);
            }
        }
    }
}


function procesarMuerte() {
    ve.video.pause(); 
    ve.playButton.addClass("d-none");
    ve.muerte.removeClass("d-none");
}


$(() => {

    textTracks = ve.video.textTracks;

    decisionTrack = textTracks[0];
    decisionCues = decisionTrack.cues;

    infoActorTrack = textTracks[1];
    infoActorTrack.mode = 'hidden';
    infoActorCues = infoActorTrack.cues;

    infoMuslosTrack = textTracks[2];
    infoMuslosTrack.mode = 'hidden';
    infoMuslosCues = infoMuslosTrack.cues;

    var start = 0;

    decisionTrack.mode = 'hidden';


    decisionTrack.addEventListener('cuechange', () => {
        for (let i = start; i < decisionCues.length; i++) {
            /** @type {VTTCue} */
            // @ts-ignore
            const cue = decisionCues[i];
            const data = JSON.parse(cue.text);

            if (data['pesa']) {
                cue.onexit = function () {
                    if (status.levantamientos >= 4 && status.levantar) {
                        goToScene(data.morirse)
                    } else if (!status.levantar && !going) {
                        goToScene(data.next)
                    }
                }
            } else if (data['muerte'])
                cue.onexit = () => { if (!going) procesarMuerte() };
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

    infoActorTrack.addEventListener('cuechange', () => {
        for (let i = 0; i < infoActorCues.length; i++) {
            /** @type {VTTCue} */
            // @ts-ignore
            const cue = infoActorCues[i];
            const data = JSON.parse(cue.text);

            if (data['actor']) {
                cue.onenter = (e) => actualizarActor(this, data, true);
                cue.onexit = (e) => actualizarActor(this, data, false);
            }
        }
    });

    infoMuslosTrack.addEventListener('cuechange', () => {
        for (let i = 0; i < infoMuslosCues.length; i++) {
            /** @type {VTTCue} */
            // @ts-ignore
            const cue = infoMuslosCues[i];
            const data = JSON.parse(cue.text);

            if (data['muslos']) {
                cue.onenter = (e) => ms.actualizaMuslo(data.muslos);
            }
        }
    });
});