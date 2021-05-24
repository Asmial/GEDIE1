import $ from 'jquery';
import * as ve from './videoElements';
var socket = null;
var onRoom = false;

$(() => {
    if ($("#room").data('room')) {
        import(/* webpackChunkName: "socketIO" */
            'socket.io-client').then(module => {
                window['socket'] = socket = module.io();

                socket.on('sala-erronea', (args) => {
                    console.log("Sala erronea");
                    $.get("/getId", (data) => {
                        window.location.hash = data;
                        socket.emit("unirse-sala", data);
                    });
                });

                socket.on('sala-correcta', (args) => {
                    console.log('Sala correcta');
                    socket.on('pause-video', (args) => {
                        console.log('Me han pausado');
                        ve.video.pause();
                    })

                    socket.on('play-video', (args) => {
                        console.log('Me han reproducido');
                        ve.video.play();
                    })
                });

                var roomno = window.location.hash.substr(1);

                if (roomno === "") {
                    $.get("/getId", (data) => {
                        window.location.hash = data;
                        socket.emit("unirse-sala", data);
                    });
                } else {
                    socket.emit("unirse-sala", roomno);
                }
                window['room'] = true;



                console.log("registrado");
            });
    } else {
        window['room'] = false;
    }
})

export function isOnRoom() {
    return onRoom;
}

/**
 * @param {string} event
 * @param {any[]} [args]
 */
export function emit(event, args) {
    if (!socket) {
        console.error("Socket no inicializado");
        return
    }
    socket.emit(event, args);
}

/**
 * @callback evtcallback
 * @param {any[]} args 
 */

/**
 * @param {string} event
 * @param {evtcallback} callback
 */
export function on(event, callback) {
    if (!socket) {
        console.error("Socket no inicializado");
        return
    }
    socket.on(event, callback);
}