const phaser = require('phaser');
const io = require('socket.io-client');

module.exports = class Controller {
    constructor(gameId) {
        this.socket = io();

        this.socket.on("chat message", (data) => {
            console.info(data)
        });

        this.socket.emit('join game', {game: gameId});
    }
}