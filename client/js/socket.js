import Peer from 'peerjs';
import io from 'socket.io-client';
import * as ve from './videoElements';
import $ from 'jquery';

export var socket = io();
var roomno;
var peerId;
/** @type {Object.<string, { call: Peer.MediaConnection, name: string }>} */
const integrantes = {};
const audioGrid = document.getElementById('audio-grid');

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
                delete integrantes[userId];
            }
        });

        peer.on('call', call => {
            call.answer(voiceStream);
            const audio = document.createElement('audio');
            call.on('stream', userAudioStream => {
                console.log("got stream");
                addAudioStream(audio, userAudioStream)
            });
            call.on('close', () => {
                audio.remove()
            });
            integrantes[call.peer].call = call;
        });

        socket.on('handshake-peer', (
            /** @type {{name: string, peerId: string}} */
            userData) => {
            integrantes[userData.peerId] = { call: null, name: userData.name };
            const call = peer.call(userData.peerId, voiceStream);
            const audio = document.createElement('audio');
            $(audio).append("<src></src>");
            console.log("handshaked, calling");
            call.on('stream', userAudioStream => {
                console.log("got stream");
                addAudioStream(audio, userAudioStream);
            });
            call.on('close', () => {
                audio.remove();
            })

        });

        socket.on('user-connected', (
            /** @type {{id: string, name: string, peerId: string}} */
            userData) => {
            console.log(userData);
            integrantes[userData.peerId] = { call: null, name: userData.name };
            console.log("user connected, handshaking");
            socket.emit('handshake-peer', { id: userData.id });
        });

        socket.on('unido-sala', () => {
            var nombre = String($("#userName").val());
            console.log(nombre);
            $("#integrante-tu").append(nombre);
            // const bootstrap = require('bootstrap/dist/js/bootstrap.bundle');
            // var modal = bootstrap.Modal.getInstance($("#roomModal").get(0));
            // modal.toggle();
        });

        socket.on('pause-video', (/** @type {any} */ args) => {
            console.log('Me han pausado');
            ve.video.pause();
        });

        socket.on('play-video', (/** @type {any} */ args) => {
            console.log('Me han reproducido');
            ve.video.play();
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
    if(roomno && peerId){
        socket.emit("join-room", {
            room: roomno,
            name: "Mianga",
            peerId: peerId
        });
    } else {
        console.error("Hay que ejecutar connectRoom antes");
    }
    
}

/**
 * @param {HTMLAudioElement} audio
 * @param {MediaStream} stream
 */
function addAudioStream(audio, stream) {
    console.log(stream);
    audio.srcObject = stream;
    audio.addEventListener('loadedmetadata', () => {
        audio.play();
    });
    audio.play();

    audioGrid.append(audio);
}