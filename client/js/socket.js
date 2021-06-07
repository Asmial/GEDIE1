import Peer from 'peerjs';
import io from 'socket.io-client';
import * as ve from './videoElements';
import * as vt from './videoTracks';
import $ from 'jquery';
import * as sc from './secuencias';
import * as vc from './videoCards';
import * as rc from './rewindCards';
import * as room from './room';

/**
 * @typedef {{time: number, playing: boolean, voteLeft: number, voteRight: number, winLeft: boolean, endVideo: boolean,
 * inVote: boolean, inVoteRewind: boolean, rewindScene: number, voteAdmin: string, endVote: boolean, 
 * voteAdminLeft: boolean, viewers: number, escenas: boolean [], status: { haComido: boolean, levantamientos: number,
 * levantar: boolean }}} roomStatus
 */

navigator.mediaDevices.enumerateDevices()
    .then(function (devices) {
        devices.forEach(function (device) {
            console.log(device.kind + ": " + device.label +
                " id = " + device.deviceId);
        });
    })

var justJoined = true;
export var socket = io();
var roomno;
var peerId;
/** @type {Object.<string, { call: Peer.MediaConnection, name: string }>} */
const integrantes = {};
const audioGrid = document.getElementById('audio-grid');

var votos = 0;
var audioTracks;

function createEmptyAudioTrack() {
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const dst = oscillator.connect(ctx.createMediaStreamDestination());
    oscillator.start();
    // @ts-ignore
    const track = dst.stream.getAudioTracks()[0];
    return Object.assign(track, { enabled: false });
}

var voiceStream = new MediaStream([createEmptyAudioTrack()]);

export function connectRoom(callback) {
    const peer = new Peer({
        host: '/',
        key: 'peerjs',
    });

    navigator.mediaDevices.getUserMedia({
        audio: true
    }).then(stream => {
        voiceStream = stream;
        for (const id in integrantes) {
            if (integrantes[id].call) {
                const call = integrantes[id].call;
                call.close();
                peer.call(id, voiceStream);
            }
        }
    }).catch((reason) => {
        console.error(reason);
    });

    peer.on('open', () => {
        peerId = peer.id;
        roomno = window.location.hash.substr(1);

        socket.on('user-disconnected', userId => {
            if (integrantes[userId]) {
                integrantes[userId].call.close();
                $("#peer-" + userId).remove();
                delete integrantes[userId];
            }
        });

        peer.on('call', call => {

            call.answer(voiceStream);
            const audio = document.createElement('audio');
            audio.id = "idUser";
            call.on('stream', userAudioStream => {
                addAudioStream(audio, userAudioStream)
            });
            call.on('close', () => {
                audio.remove()
            });
            integrantes[call.peer].call = call;
        });

        socket.on('handshake-peer', (
            /** @type {{id: String, name: string, peerId: string}} */
            userData) => {

            integrantes[userData.peerId] = { call: null, name: userData.name };

            for (let id in integrantes) {
                var repetido = false;
                var children = document.getElementById("integrantes").children;
                for (let i = 0; i < children.length && !repetido; i++) {
                    if (children[i].id.substring(5, children[i].id.length) == id) {
                        repetido = true;
                    }
                }
                if (!repetido) {
                    $("#integrantes").append(
                        `<p id="peer-${id}" class="integrante">${integrantes[id].name}</p>`);
                    repetido = false;
                }
            }

            const call = peer.call(userData.peerId, voiceStream);
            const audio = document.createElement('audio');
            audio.id = "audio-" + userData.id
            call.on('stream', userAudioStream => {
                addAudioStream(audio, userAudioStream);
            });
            call.on('close', () => {
                audio.remove();
            })
        });

        socket.on('user-connected', (
            /** @type {{id: string, name: string, peerId: string}} */
            userData) => {
            ve.video.pause();
            integrantes[userData.peerId] = { call: null, name: userData.name };
            $("#integrantes").append(`<p id="peer-${userData.peerId}" class="integrante"> ${userData.name}
            </p>`);

            showName(userData.name);
            socket.emit('handshake-peer', { id: userData.id });
        });

        socket.on('unido-sala',
            (/** @type {roomStatus} */data) => {
                data.playing = false;
                //updateRoomStatus(data);
                var nombre = String($("#userName").val());
                $("#integrante-tu").prepend(nombre);
            });


        /**
         * 
         * @param {roomStatus} status 
         */
        function updateRoomStatus(status) {
            if (status.viewers != 1 && justJoined) {
                console.log("statuschange: " + status.time);
                justJoined = false;
                var going = vt.getGoing();
                vt.setGoing(true);
                ve.video.currentTime = status.time;
                vt.setGoing(going);
            } else {
                justJoined = false;
            }

            room.setSyncPlay(false);
            if (status.playing) {
                ve.video.play();
            } else {
                ve.video.pause();
            }
            room.setSyncPlay(true);
            var lastTrue = 0;
            for (let i = 0; i < status.escenas.length; i++) {
                if (status.escenas[i]) {
                    lastTrue = i;
                    sc.showSecuencia(i);
                }
            }
            sc.hideSecuencias(lastTrue + 1);
            vt.updateStatus(status.status);
            var max = status.viewers;
            if (max == 0) max = 1;
            var leftPercent;
            var rightPercent;
            if (status.voteLeft + status.voteRight == status.viewers) {
                console.log("all");
                if (status.winLeft) {
                    leftPercent = 100;
                    rightPercent = 0;
                } else {
                    leftPercent = 0;
                    rightPercent = 100;
                }
            } else {
                leftPercent = Math.round(status.voteLeft * 100 / max);
                rightPercent = Math.round(status.voteRight * 100 / max);
            }

            console.log("VoteLeft: " + status.voteLeft + " voteRight: " + status.voteRight + " Viewers:" + status.viewers);

            console.log("Left: " + leftPercent + " Right: " + rightPercent);
            rc.setVotes(leftPercent, rightPercent);
            vc.setVotes(leftPercent, rightPercent);

            if (status.inVote || status.inVoteRewind) {
                ve.rewind.addClass('d-none');
                $("#contenedor-secuencias").addClass("d-none");
                if (!$("#noescenas").hasClass("d-none")) {
                    $("#novotar").addClass("d-none");
                } else {
                    $("#novotar").removeClass("d-none");
                }
            } else {
                $("#contenedor-secuencias").removeClass("d-none");
                if (!$("#noescenas").hasClass("d-none")) {
                    $("#novotar").removeClass("d-none");
                } else {
                    $("#novotar").addClass("d-none");
                }
                ve.rewind.removeClass('d-none');
                vc.hideCards();
            }

            

            if (status.inVoteRewind) {
                console.log("invote");
                ve.videoControls.addClass('d-none');
                rc.setCardsName(status.voteAdmin);
                rc.setCardsScene(status.rewindScene);
                rc.showCards();
            } else {
                ve.videoControls.removeClass('d-none');
                console.log("novote");
                rc.hideCards();
            }

        }

        socket.on('update-status', (/** @type {roomStatus} */ args) => {
            updateRoomStatus(args);
        });

        socket.on('update-status-time', (/** @type {roomStatus} */ args) => {
            console.log(args);
            justJoined = false;
            updateRoomStatus(args);
            var going = vt.getGoing();
            vt.setGoing(true);
            ve.video.currentTime = args.time;
            if (args.endVote) {
                vt.setGoing(true);
            } else {
                vt.setGoing(going);
            }
        });

        function finishLoading() {
            $("#copiarButton").removeClass("btn-secondary");
            $("#copiarButton").addClass("btn-primary");
            $("#vamosButton").removeClass("btn-secondary");
            $("#vamosButton").addClass("btn-primary");
            $("#vamosButton").data("bs-dismiss", "modal");
            $("#salaNueva").removeClass("d-none");
            $("#roomUrl").val(String(window.location));
            $("#copiarButton").on('click', () => {
                // @ts-ignore
                $("#roomUrl").get(0).select();
                // @ts-ignore
                $("#roomUrl").get(0).setSelectionRange(0, 99999);
                var success = document.execCommand('copy');
                if (success) {
                    $("#copiarButton").removeClass("btn-primary");
                    $("#copiarButton").addClass("btn-success");
                    $("#copiarButton").html("Copiado");
                } else {
                    $("#copiarButton").removeClass("btn-primary");
                    $("#copiarButton").addClass("btn-danger");
                    $("#copiarButton").html("Error");
                }
            });
            callback();
        }

        socket.on('sala-erronea', (args) => {
            $("#errorSala").removeClass("d-none");
            console.log("Sala erronea");
            $.get("/getId", (data) => {
                $("#cambioSala").removeClass("d-none")
                window.location.hash = roomno = data;
                finishLoading();
            });
        });

        socket.on('sala-correcta', (args) => {
            finishLoading();
        })

        if (roomno === "") {
            $.get("/getId", (data) => {
                window.location.hash = roomno = data;
                finishLoading();
            });
        } else {
            socket.emit("check-room", { room: roomno });
        }

    });

    var botonMute = $('#boton-muteo');

    $(botonMute).on('click', () => {
        if (voiceStream) {
            var track = voiceStream.getAudioTracks()[0];
            var micIcon = $("#boton-muteo").children();
            if (track.enabled) {
                track.enabled = false;
                micIcon.removeClass('mdi mdi-microphone');
                micIcon.addClass('mdi mdi-microphone-off');
            } else {
                track.enabled = true;
                micIcon.removeClass('mdi mdi-microphone-off');
                micIcon.addClass('mdi mdi-microphone');
            }
        }
    });

}

export function join() {
    if (roomno && peerId) {
        var nombre = String($("#userName").val());
        socket.emit("join-room", {
            room: roomno,
            name: nombre,
            peerId: peerId
        });
    } else {
        console.error("Hay que ejecutar connectRoom antes");
    }

}

function showName(nombre) {
    $('#user-name-enter').prepend(
        `<div class="d-flex justify-content-center greyGradient mb-1" style="display: none;">${nombre} ha entrado en la sala</div>`)
    $('#user-name-enter').children().first().fadeIn(200, function () {
        $(this).fadeOut(2000, function () {
            $(this).remove()
        })
    })
    // console.log("entra: " + nombre)
    // var mensajeEntrada = $('#user-enter');
    // var nombreUsuario = $('#user-name-enter');
    // nombreUsuario.html(nombre);
    // mensajeEntrada.fadeIn(200);
    // mensajeEntrada.fadeOut(4000);
}

/**
 * @param {HTMLAudioElement} audio
 * @param {MediaStream} stream
 */
function addAudioStream(audio, stream) {
    audio.srcObject = stream;
    audio.addEventListener('loadedmetadata', () => {
        audio.play();
        console.log("replayed");
    });
    audio.play();
    console.log("played");

    audioGrid.append(audio);
}