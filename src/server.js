const createServer = require("http").createServer;
const Server = require("socket.io").Server;
const WebVTT = require("vtt.js").WebVTT;

const express = require('express')
const app = express()
const { v4: uuidV4, validate } = require('uuid')

const DEFAULT_PORT = 80;
const httpServer = createServer(app);

const io = new Server(httpServer);

const COMER = 1;
const PESA = 2;

/** @typedef {{id: number, end: number, a1: number, a2: number, especial?: number, e?: number}} escena  */
/** @type {escena[]} */
const escenas = [
    { id: 1, end: 10, a1: 10, a2: 20 },
    { id: 4, end: 70, a1: 70, a2: 85.05 },
    { id: 7, end: 145, a1: 145, a2: 170 },
    { id: 11, end: 270, a1: 270, a2: 310, especial: COMER },
    { id: 15, end: 326, a1: 326, a2: 340, especial: PESA, e: 330 },
    { id: 21, end: 340, a1: 485, a2: 380 },
    { id: 23, end: 430, a1: 430, a2: 450 },
    { id: 28, end: 535, a1: 535, a2: 570 }
]


app.get('/getId', (req, res) => {
    res.send(uuidV4());
})

/**
 * @typedef {{time: number, playing: boolean, voteLeft: number, voteRight: number, 
 * inVote: boolean, inVoteRewind: boolean, rewindScene: number, voteAdmin: string, 
 * voteAdminLeft: boolean, viewers: number, escenas: boolean [], status: { haComido: boolean, levantamientos: number,
 * levantar: boolean }}} roomStatus
 */

/** @type {Object <string,roomStatus>} */
var roomsData = {};

/** @type {Object <string,Object <string,boolean>>} */
var votedSceneRooms = {};

io.on("connection", (socket) => {
    console.log("connection: " + socket.id);

    socket.on("check-room", (
        /** @type {{room: string}} */
        data) => {
        if (validate(data.room)) {
            socket.emit("sala-correcta");
        } else {
            socket.emit("sala-erronea");
        }
    })

    socket.on("join-room", (
        /** @type {{room: string, name: string, peerId: string}} */
        userData) => {
        /** @type {roomStatus} */
        var roomData;
        /** @type {Object <string,boolean>} */
        var votedScene;
        const clients = io.sockets.adapter.rooms.get(userData.room);
        if (!clients) {
            roomData = {
                time: 0,
                playing: false,
                voteLeft: 0,
                voteRight: 0,
                inVote: false,
                inVoteRewind: false,
                rewindScene: 0,
                voteAdmin: socket.id,
                voteAdminLeft: true,
                viewers: 1,
                escenas: new Array(8),
                status: {
                    haComido: false,
                    levantamientos: 0,
                    levantar: false
                }
            }
            roomsData[userData.room] = roomData;
            votedScene = {};
            votedSceneRooms[userData.room] = votedScene;
        } else {
            roomData = roomsData[userData.room];
            votedScene = votedSceneRooms[userData.room];
            roomData.viewers++;
        }

        socket.join(userData.room);

        socket.emit("unido-sala", roomData);
        //var nombre = String($("#userName").val());
        //console.log(nombre);

        socket.on('entrar-votacion',
        /** @type {{time: number}} */(data) => {
                roomData.inVote = true
                roomData.time = data.time;
            })

        socket.on('entrar-pesa',
        /** @type {{time: number}} */(data) => {
                roomData.inVote = true
                roomData.time = data.time;
            })

        socket.to(userData.room).emit("user-connected",

            { id: socket.id, name: userData.name, peerId: userData.peerId });


        socket.on('handshake-peer',
            /** @type {{ id: string, peerId: peerId }} */
            (data) => {
                socket.to(data.id).emit(
                    'handshake-peer',
                    { id: socket.id, name: userData.name, peerId: userData.peerId });
            })

        socket.on("disconnect", () => {
            socket.to(userData.room).emit("user-disconnected", userData.peerId);
            const clients = io.sockets.adapter.rooms.get(userData.room);
            roomData.viewers--;
            if (!clients) {
                delete roomsData[userData.room];
                delete votedSceneRooms[userData.room];
            }
        })

        socket.on("vote-option",
        /** @type {{left: boolean, time: number}} */(data) => {
                if (!votedScene[socket.id]) {
                    votedScene[socket.id] = true;
                    if (roomData.voteLeft + roomData.voteRight == 0) {
                        roomData.inVote = true;
                        roomData.voteAdmin = socket.id;
                        roomData.voteAdminLeft = data.left;
                        roomData.time = data.time;
                        console.log(data.time);
                    }
                    console.log('vote');
                    if (data.left) {
                        console.log("left");
                        roomData.voteLeft++;
                    } else {
                        roomData.voteRight++;
                    }
                    const clients = io.sockets.adapter.rooms.get(userData.room);
                    console.log(clients.size);
                    if (roomData.voteLeft + roomData.voteRight == clients.size) {
                        var left = roomData.voteLeft > roomData.voteRight || roomData.voteLeft == roomData.voteRight && roomData.voteAdminLeft;
                        //procesar voto
                        var escena;
                        var continuar = true;
                        var i;
                        for (i = 0; i < escenas.length && continuar; i++) {
                            const currEscena = escenas[i];
                            escena = currEscena;
                            if (roomData.time < currEscena.end) {
                                continuar = false;
                            }
                        }
                        if (escena.especial) {
                            switch (escena.especial) {
                                case COMER:
                                    if(left){
                                        roomData.status.haComido = true;
                                    } else {
                                        roomData.status.haComido = false;
                                    }
                                    roomData.time = left ? escena.a1 : escena.a2;
                                    break;
                                case PESA:
                                    roomData.status.levantamientos++;
                                    roomData.status.levantar;
                                    if (roomData.status.levantamientos >= 5) {
                                        roomData.time = escena.e;
                                    } else {
                                        console.log("pesa: " + left);
                                        roomData.time = left ? escena.a1 : escena.a2;
                                    }
                                    break;
                            }
                        } else {
                            roomData.time = left ? escena.a1 : escena.a2;
                        }
                        roomData.inVote = false;
                        roomData.escenas[i - 1] = true;
                        roomData.playing = true;
                        roomData.voteLeft = 0;
                        roomData.voteRight = 0;
                        votedSceneRooms[userData.room] = votedScene = {};
                        io.in(userData.room).emit("update-status-time", roomData);
                    } else {
                        io.in(userData.room).emit("update-status", roomData);
                    }
                } else {
                    console.log(socket.id + " voted");
                }
            });

        socket.on("pause-video", (data) => {
            console.log("pausevideo");
            if (!roomData.inVote) {
                roomData.playing = false;
                roomData.time = data.time;
                io.in(userData.room).emit("update-status-time", roomData);
            } else {
                roomData.playing = true;
                io.in(userData.room).emit("update-status", roomData);
            }
        });

        socket.on("play-video", (data) => {
            console.log("playvideo");
            roomData.playing = true;
            roomData.time = data.time;
            io.in(userData.room).emit("update-status-time", roomData);
        });
    })
});

module.exports = { start: function () { httpServer.listen(DEFAULT_PORT) } }