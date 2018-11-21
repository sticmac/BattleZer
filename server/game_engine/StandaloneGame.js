const Player = require('./Player');
const Game = require('./Game');

module.exports = class StandaloneGame extends Game {

    /*
    emitting to tableId or to namespace (this.name) is the same
     */

    constructor(name, nb, tableId, io) {
        super(name, nb, tableId, io);
        this.type = "standalone";
        this.io.to(this.tableId).emit('chat message', {code : 100, message :this.name + ' - ' + this.type + ' (' + this.playersCount + ' joueurs)'});
        this.initPlayers();
    }

    initPlayers() {
        for (let i = 1; i <= this.playersCount; i++) {
            this.players.push(new Player("player " + i, this.maxHealth, 0))
        }
        this.isReady();
    }

    isReady() {
        let players_data = [];
        this.players.forEach(a => {
           let obj = {};
           obj['id'] = a.id;
           obj['position'] = a.position;
           obj['health'] = a.health;
           players_data.push(obj);
        });
        this.io.to(this.name).emit('ready to start', players_data);
        console.log(this.name + " is ready to start")
    }


};