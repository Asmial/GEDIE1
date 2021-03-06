import $ from 'jquery';
import * as ve from './videoElements';
import * as es from './secuencias';
import * as ac from './actores';
import * as ms from './muslos';
import * as vc from './videoCards';
import * as room from './room';

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
/** @type {TextTrack} */
export var subtitulosTrack;
/** @type {TextTrackCueList} */
export var subtitulosCues;

var going = false;

/**
 * @param {number} num
 */
export function goToScene(num) {
    clearTimeout(waitDisableGoing);
    going = true;
    //escena de las pesas
    if (num == 15) {
        if (status.haComido) {
            ms.setHungerLevel(6)
        } else {
            ms.setHungerLevel(1)
        }

    }
    ve.video.currentTime = decisionCues[num].startTime;
}

var waitDisableGoing;

export function getGoing() {
    return going;
}

export function setGoing(g) {
    going = g;
}

var status = {
    haComido: false,
    levantamientos: 0,
    levantar: false
};

export function updateStatus(newstatus) {
    status.haComido = newstatus.haComido;
    status.levantamientos = newstatus.levantamientos;
    status.levantar = newstatus.levantar;
}

function levantar() {
    going = true;
    status.levantar = true;
}

/**
 * @param {{decision: any; seguir: number; pregunta: string; respuesta0: string; respuesta1: string; escena0: number; escena1: number; }} data
 */
function decision(data) {

    waitDisableGoing = setTimeout(() => {
        going = false;
    }, 100);

    if (!room.isOnRoom()) {
        if (!data['levantando'] && !data['pesa']) {
            status.levantar = false;
            status.levantamientos = 0;
        }
        if (data['comido']) status.haComido = true;
        else if (data['noComido']) status.haComido = false;
    }

    ve.muerte.addClass("d-none");
    ve.fin.addClass("d-none");


    if (data['decision'] >= 0) {
        es.hideSecuencias(data.decision);
        es.showSecuencia(data.decision)
    }

    if (data['levantando']) {
        ve.playButton.addClass('d-none');
        ve.decisionAudio.currentTime = 0;
        ve.decisionAudio.pause();
        if (room.isOnRoom()) {
            vc.hideCards();
        } else {
            status.levantamientos++;
            status.levantar = false;
        }
    } else if (data['pesa']) {
        room.emit('entrar-pesa', { time: ve.video.currentTime });
        ve.playButton.addClass('d-none');
        ve.decisionAudio.pause();
        ve.decisionAudio.currentTime = 0;
        ve.video.play();

        if (room.isOnRoom()) {
            console.log("levantamientos " + status.levantamientos);
            if (Number(status.levantamientos) == 0) {
                vc.setCardsText(data.pregunta, data.respuesta0, null);
                vc.hideAwnser1();
                vc.setCardsCallbacks(() => vote(true));
            } else {
                vc.setCardsText(data.pregunta, data.respuesta0, data.respuesta1);
                vc.setCardsCallbacks(() => vote(true), () => vote(false));
            }
        } else {
            if (vc.getCardsCallbacks()[0] != levantar) {
                vc.setCardsCallbacks(levantar, () => { goToScene(data.seguir) });
            }
            if (status.levantamientos == 0) {
                vc.setCardsText(data.pregunta, data.respuesta0, null);
            } else {
                vc.setCardsText(data.pregunta, data.respuesta0, data.respuesta1);
            }
        }
        vc.showCards();
    } else if (data['pregunta']) {
        room.emit('entrar-votacion', { time: ve.video.currentTime });
        ve.playButton.addClass('d-none');
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
            if (room.isOnRoom()) {
                if (data['escena1']) {
                    vc.setCardsCallbacks(() => vote(true), () => vote(false));
                } else {
                    vc.setCardsCallbacks(() => vote(true), null);
                }
            } else {
                if (data['escena1']) {
                    vc.setCardsCallbacks(() => goToScene(data.escena0), () => goToScene(data.escena1));
                } else {
                    vc.setCardsCallbacks(() => goToScene(data.escena0));
                }

            }
        }
    } else {
        ve.decisionAudio.currentTime = 0;
        ve.decisionAudio.pause();
        ve.playButton.removeClass('d-none');
        vc.hideCards();
    }
}

/**
 * @param {boolean} left
 */
function vote(left) {
    room.emit('vote-option', { left: left, time: ve.video.currentTime });
}


/**
 * @param {{actor: [number]}} data
 * @param {boolean} entra
 */
function actualizarActor(data, entra) {
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
    room.setSyncPlay(false);
    ve.video.pause();
    room.setSyncPlay(true);
    ve.playButton.addClass("d-none");
    ve.muerte.removeClass("d-none");
}

function procesarFin() {
    room.setSyncPlay(false);
    ve.video.pause();
    room.setSyncPlay(true);
    ve.playButton.addClass("d-none");
    ve.fin.removeClass("d-none");
}


$(() => {

    textTracks = ve.video.textTracks;

    decisionTrack = textTracks[0];
    decisionTrack.mode = 'hidden';
    decisionCues = decisionTrack.cues;

    infoActorTrack = textTracks[1];
    infoActorTrack.mode = 'hidden';
    infoActorCues = infoActorTrack.cues;

    infoMuslosTrack = textTracks[2];
    infoMuslosTrack.mode = 'hidden';
    infoMuslosCues = infoMuslosTrack.cues;

    subtitulosTrack = textTracks[3];
    subtitulosTrack.mode = 'showing';
    subtitulosCues = infoMuslosTrack.cues;

    var dectrackstart = 0;
    var mustrackstart = 0;
    var inftrackstart = 0;


    $(ve.video).children().on('load', () => {
        decisiontrackChange();
        infoActorTrackChange();
        infoMuslosTrackChange();
    })

    function decisiontrackChange() {
        for (let i = dectrackstart; i < decisionCues.length; i++) {
            /** @type {VTTCue} */
            // @ts-ignore
            const cue = decisionCues[i];
            const data = JSON.parse(cue.text);

            if (data['pesa']) {
                cue.onexit = function () {
                    if (status.levantamientos >= 4 && status.levantar) {
                        goToScene(data.morirse);
                    } else if (status.levantar) {
                        going = true;
                    } else if (!status.levantar && !going) {
                        goToScene(data.next)
                    }
                }
            } else if (data['muerte'])
                cue.onexit = () => {
                    if (!going) procesarMuerte()
                };
            else if (data['fin'])
                cue.onexit = () => { if (!going) procesarFin() };
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
            cue.onenter = (e) => decision(data);
        }
        dectrackstart = decisionCues.length;
    }

    function infoActorTrackChange() {
        for (let i = inftrackstart; i < infoActorCues.length; i++) {
            /** @type {VTTCue} */
            // @ts-ignore
            const cue = infoActorCues[i];
            const data = JSON.parse(cue.text);

            if (data['actor']) {
                cue.onenter = (e) => actualizarActor(data, true);
                cue.onexit = (e) => actualizarActor(data, false);
            }
        }
        inftrackstart = infoActorCues.length;
    }

    function infoMuslosTrackChange() {
        for (let i = mustrackstart; i < infoMuslosCues.length; i++) {
            /** @type {VTTCue} */
            // @ts-ignore
            const cue = infoMuslosCues[i];
            const data = JSON.parse(cue.text);

            if (data['muslos']) {
                cue.onenter = (e) => ms.setHungerLevel(data.muslos);
            }
        }
        mustrackstart = infoMuslosCues.length;
    }

    decisionTrack.addEventListener('cuechange', decisiontrackChange);
    infoActorTrack.addEventListener('cuechange', infoActorTrackChange);
    infoMuslosTrack.addEventListener('cuechange', infoMuslosTrackChange);

});