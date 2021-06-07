const createServer = require("http").createServer;
const Server = require("socket.io").Server;

const express = require('express')
const app = express()
const { v4: uuidV4, validate } = require('uuid')

const DEFAULT_PORT = 80;
const httpServer = createServer(app);

const io = new Server(httpServer);

const COMER = 1;
const PESA = 2;

/** @typedef {{id: number, start: number, end: number, a1: number, a2: number, especial?: number, e?: number}} escena  */
/** @type {escena[]} */
const escenas = [
    { id: 1, start: 5, end: 10, a1: 10, a2: 20 },
    { id: 4, start: 65, end: 70, a1: 85.05, a2: 70 },
    { id: 7, start: 140, end: 145, a1: 170, a2: 145 },
    { id: 11, start: 265, end: 270, a1: 270, a2: 310, especial: COMER },
    { id: 15, start: 325, end: 326, a1: 326, a2: 340, especial: PESA, e: 330 },
    { id: 21, start: 335, end: 340, a1: 485, a2: 380 },
    { id: 23, start: 425, end: 430, a1: 430, a2: 450 },
    { id: 28, start: 530, end: 535, a1: 535, a2: 570 }
]


app.get('/getId', (req, res) => {
    res.send(uuidV4());
})

/**
 * @typedef {{time: number, playing: boolean, voteLeft: number, voteRight: number, winLeft: boolean, endVideo: boolean,
 * inVote: boolean, inVoteRewind: boolean, rewindScene: number, voteAdmin: string, endVote: boolean, 
 * voteAdminLeft: boolean, viewers: number, escenas: boolean [], status: { haComido: boolean, levantamientos: number,
 * levantar: boolean }}} roomStatus
 */

/** @type {Object <string,roomStatus>} */
var roomsData = {};

/** @type {Object <string,Object <string,boolean>>} */
var votedSceneRooms = {};

/** @type {Object <string,Object <string,boolean>>} */
var votedRewindRooms = {};

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
        const clients = io.sockets.adapter.rooms.get(userData.room);
        if (!clients) {
            roomData = {
                time: 0,
                endVideo: false,
                winLeft: false,
                playing: false,
                voteLeft: 0,
                voteRight: 0,
                endVote: false,
                inVote: false,
                inVoteRewind: false,
                rewindScene: 0,
                voteAdmin: userData.name,
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
            votedSceneRooms[userData.room] = {};
            votedRewindRooms[userData.room] = {};
        } else {
            roomData = roomsData[userData.room];
            roomData.viewers++;
        }

        socket.join(userData.room);

        socket.emit("unido-sala", roomData);
        //var nombre = String($("#userName").val());
        //console.log(nombre);

        socket.to(userData.room).emit("user-connected",
            { id: socket.id, name: userData.name, peerId: userData.peerId });

        socket.on('entrar-votacion',
        /** @type {{time: number}} */(data) => {
                if (!roomData.inVote) {
                    roomData.inVote = true;
                    roomData.playing = true;
                    roomData.time = data.time;
                    roomData.voteLeft = 0;
                    roomData.voteRight = 0;
                    io.in(userData.room).emit("update-status", roomData);
                }
            })

        socket.on('entrar-pesa',
        /** @type {{time: number}} */(data) => {
                if (!roomData.inVote) {
                    roomData.inVote = true;
                    roomData.playing = true;
                    roomData.time = data.time;
                    roomData.voteLeft = 0;
                    roomData.voteRight = 0;
                    io.in(userData.room).emit("update-status", roomData);
                }
            })

        socket.on('end-video', (/** @type {{time: number}} */ data) => {
            roomData.time = data.time;
            roomData.endVideo = true;
            io.in(userData.room).emit("update-status", roomData);
        })

        socket.on('handshake-peer',
            /** @type {{ id: string, peerId: peerId }} */
            (data) => {
                socket.to(data.id).emit(
                    'handshake-peer',
                    { id: socket.id, name: userData.name, peerId: userData.peerId });
            })

        socket.on("disconnect", () => {
            socket.to(userData.room).emit("user-disconnected", userData.peerId);
            io.in(userData.room).emit("update-status", roomData);
            roomData.viewers--;
            const clients = io.sockets.adapter.rooms.get(userData.room);

            if (!clients) {
                delete roomsData[userData.room];
                delete votedSceneRooms[userData.room];
                delete votedRewindRooms[userData.room];
            } else {
                if (roomData.inVote) {
                    processVote();
                } else if (roomData.inVoteRewind) {
                    processVoteRewind();
                }
            }
        })

        function processVoteRewind() {
            const clients = io.sockets.adapter.rooms.get(userData.room);
            if (roomData.voteLeft + roomData.voteRight == clients.size) {
                console.log("rewind");
                roomData.winLeft = roomData.voteLeft > roomData.voteRight || roomData.voteLeft == roomData.voteRight && roomData.voteAdminLeft;
                //procesar voto
                var continuar = true;
                var i;
                for (i = roomData.rewindScene; i < escenas.length && continuar; i++) {
                    roomData.escenas[i] = false;
                }
                roomData.inVoteRewind = false;
                roomData.inVote = false;
                roomData.playing = true;
                if (roomData.winLeft) {
                    roomData.time = escenas[roomData.rewindScene].start;
                }
                roomData.endVideo = false;
                roomData.status.levantamientos = 0;
                roomData.endVote = true;
                io.in(userData.room).emit("update-status-time", roomData);
                votedRewindRooms[userData.room] = {};
                votedSceneRooms[userData.room] = {};
                roomData.voteLeft = 0;
                roomData.voteRight = 0;
            } else {
                roomData.endVote = false;
                io.in(userData.room).emit("update-status-time", roomData);
            }
        }

        socket.on('vote-rewind',
            ( /** @type {{time: number, scene: number}} */ data) => {
                if (data.scene != -1 && !roomData.inVote && !roomData.inVoteRewind) {
                    roomData.time = data.time;
                    roomData.inVoteRewind = true
                    roomData.voteLeft = 0;
                    roomData.voteRight = 0;
                    roomData.voteAdminLeft = true;
                    roomData.voteAdmin = userData.name;
                    roomData.playing = false;
                    roomData.rewindScene = data.scene;
                    roomData.endVote = false;
                    io.in(userData.room).emit("update-status-time", roomData);
                    processVoteRewind();
                }
            });

        socket.on('vote-rewind-option',
        /** @type {{left: boolean}} */(data) => {
                roomData.endVote = false;
                if (roomData.inVoteRewind && !votedRewindRooms[userData.room][socket.id]) {
                    votedRewindRooms[userData.room][socket.id] = true;
                    if (data.left) {
                        roomData.voteLeft++;
                    } else {
                        roomData.voteRight++;
                    }
                    processVoteRewind();
                }
            });

        function processVote() {
            const clients = io.sockets.adapter.rooms.get(userData.room);
            if (roomData.voteLeft + roomData.voteRight == clients.size) {
                var left = roomData.winLeft = roomData.voteLeft > roomData.voteRight
                    || roomData.voteLeft == roomData.voteRight && roomData.voteAdminLeft;
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
                            if (left) {
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
                roomData.endVideo = false;
                roomData.inVote = false;
                roomData.escenas[i - 1] = true;
                roomData.playing = true;
                roomData.endVote = true;
                io.in(userData.room).emit("update-status-time", roomData);
                votedSceneRooms[userData.room] = votedSceneRooms[userData.room] = {};
                roomData.voteLeft = 0;
                roomData.voteRight = 0;
            } else {
                io.in(userData.room).emit("update-status", roomData);
            }
        }

        socket.on("vote-option",
        /** @type {{left: boolean, time: number}} */(data) => {
                roomData.endVote = false;
                if (roomData.inVote && !votedSceneRooms[userData.room][socket.id]) {
                    votedSceneRooms[userData.room][socket.id] = true;
                    if (roomData.voteLeft + roomData.voteRight == 0) {
                        roomData.inVote = true;
                        roomData.voteAdmin = userData.name;
                        roomData.voteAdminLeft = data.left;
                        roomData.time = data.time;
                    }
                    console.log('vote');
                    if (data.left) {
                        roomData.voteLeft++;
                    } else {
                        roomData.voteRight++;
                    }
                    processVote();
                } else {
                    console.log(socket.id + " voted");
                }
            });

        socket.on("pause-video", (data) => {
            console.log("pauseTime: " + data.time);
            if (!roomData.inVote && !roomData.inVoteRewind && roomData.playing) {
                roomData.playing = false;
                roomData.time = data.time;
                roomData.endVote = false;
                io.in(userData.room).emit("update-status-time", roomData);
            } else if (roomData.playing) {
                // console.log("invote");
                roomData.time = data.time;
                roomData.playing = true;
                roomData.endVote = false;
                io.in(userData.room).emit("update-status-time", roomData);
            } else {
                roomData.endVote = false;
                io.in(userData.room).emit("update-status-time", roomData);
            }
        });

        socket.on("play-video", (data) => {
            // console.log("playvideo");
            if (!roomData.inVoteRewind && !roomData.playing) {
                roomData.playing = true;
                roomData.time = data.time;
                io.in(userData.room).emit("update-status", roomData);
            } else if (!roomData.playing) {
                roomData.playing = false;
                io.in(userData.room).emit("update-status-time", roomData);
            }
        });
    })
});

module.exports = { start: function () { httpServer.listen(DEFAULT_PORT) } }