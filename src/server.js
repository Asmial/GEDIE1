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

    socket.on("unirse-sala", (idSala) => {
        if (validate(idSala)) {
            socket.join(idSala);
            socket.emit("sala-correcta");

            socket.to(idSala).emit("usuario-conectado", "Mianga");

            socket.on("disconnection", () => {
                socket.to(idSala).emit("usuario-desconectado", "Mianga");
            })

            socket.on("pause-video", (data) => {
                socket.to(idSala).emit("pause-video");
            });

            socket.on("play-video", (data) => {
                console.log("playvideo");
                socket.to(idSala).emit("play-video");
            });

        } else {
            socket.emit("sala-erronea");
        }
    })
});

module.exports = { start: function () { httpServer.listen(DEFAULT_PORT) } }