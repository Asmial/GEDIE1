const createServer = require("http").createServer;
const Server = require("socket.io").Server;

const express = require('express')
const app = express()
const { v4: uuidV4, validate } = require('uuid')

const DEFAULT_PORT = 80;
const httpServer = createServer(app);

const io = new Server(httpServer);

app.get('/getId', (req, res) => {
    res.send(uuidV4());
})

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

        socket.join(userData.room);
        socket.emit("unido-sala");

        socket.broadcast.to(userData.room).emit("user-connected",
            { id: socket.id, name: userData.name, peerId: userData.peerId });


        socket.on('handshake-peer',
            /** @type {{ id: string, peerId: peerId }} */
            (data) => {
                socket.to(data.id).emit(
                    'handshake-peer',
                    { name: userData.name, peerId: userData.peerId });
            })

        socket.on("disconnection", () => {
            socket.to(userData.room).emit("user-disconnected", userData.peerId);
        })

        socket.on("pause-video", (data) => {
            socket.to(userData.room).emit("pause-video");
        });

        socket.on("play-video", (data) => {
            console.log("playvideo");
            socket.to(userData.room).emit("play-video");
        });
    })
});

module.exports = { start: function () { httpServer.listen(DEFAULT_PORT) } }