import Peer from 'peerjs';
import io from 'socket.io-client';
import * as ve from './videoElements';
import * as vt from './videoTracks';
import $ from 'jquery';
import * as sc from './secuencias';
import { left } from '@popperjs/core';

/**
 * @typedef {{time: number, playing: boolean, voteLeft: number, voteRight: number, winLeft: boolean,
 * inVote: boolean, inVoteRewind: boolean, rewindScene: number, voteAdmin: string, 
 * voteAdminLeft: boolean, viewers: number, escenas: boolean [], status: { haComido: boolean, levantamientos: number,
 * levantar: boolean }}} roomStatus
 */

export var socket = io();
var roomno;
var peerId;
/** @type {Object.<string, { call: Peer.MediaConnection, name: string }>} */
const integrantes = {};
const audioGrid = document.getElementById('audio-grid');

var votos = 0;

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

            socket.emit('handshake-peer', { id: userData.id });
        });

        socket.on('unido-sala',
            (/** @type {roomStatus} */data) => {
                data.playing = false;
                updateRoomStatus(data);
                var nombre = String($("#userName").val());
                $("#integrante-tu").prepend(nombre);
            });


        /**
         * 
         * @param {roomStatus} status 
         */
        function updateRoomStatus(status) {
            console.log("playing: " + status.playing);
            if (status.playing) {
                ve.video.play();
            } else {
                ve.video.pause();
            }
            var lastTrue = 0;;
            for (let i = 0; i < status.escenas.length; i++) {
                if (status.escenas[i]) {
                    lastTrue = i;
                    sc.showSecuencia(i);
                }
            }
            sc.hideSecuencias(lastTrue + 1);
            vt.updateStatus(status.status);
            console.log(status.status.levantamientos);
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

            if (status.inVote) {
                ve.playButton.addClass('d-none');
            }

            $("#votebar-left").animate({ width: `${leftPercent}%` });
            $("#votebar-right").animate({ width: `${rightPercent}%` });
        }

        socket.on('update-status', (/** @type {roomStatus} */ args) => {
            updateRoomStatus(args);
        });

        socket.on('update-status-time', (/** @type {roomStatus} */ args) => {
            console.log(args);
            vt.setGoing(true);
            updateRoomStatus(args);
            ve.video.currentTime = args.time;
        });

        socket.on('sala-erronea', (args) => {
            $("#errorSala").removeClass("d-none");
            console.log("Sala erronea");
            $.get("/getId", (data) => {
                window.location.hash = roomno = data;
                $("#cambioSala").removeClass("d-none")
                $("#vamosButton").removeClass("btn-secondary");
                $("#vamosButton").addClass("btn-primary");
                $("#vamosButton").data("bs-dismiss", "modal");
                $("#salaNueva").removeClass("d-none");;
                callback();
            });
        });

        socket.on('sala-correcta', (args) => {
            $("#vamosButton").removeClass("btn-secondary");
            $("#vamosButton").addClass("btn-primary");
            $("#vamosButton").data("bs-dismiss", "modal");
            $("#salaNueva").removeClass("d-none");
            callback();
        })

        if (roomno === "") {
            $.get("/getId", (data) => {
                window.location.hash = roomno = data;
                $("#vamosButton").removeClass("btn-secondary");
                $("#vamosButton").addClass("btn-primary");
                $("#vamosButton").data("bs-dismiss", "modal");
                $("#salaNueva").removeClass("d-none");
                callback();
            });
        } else {
            socket.emit("check-room", { room: roomno });
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

export function mute() {
    $("#mute-button").click(function () {
        var bool = $(".idUser").prop("muted");
        $(".idUser").prop("muted", !bool);
    });
}

/**
 * @param {HTMLAudioElement} audio
 * @param {MediaStream} stream
 */
function addAudioStream(audio, stream) {
    audio.srcObject = stream;
    audio.addEventListener('loadedmetadata', () => {
        audio.play();
    });
    audio.play();

    audioGrid.append(audio);
}