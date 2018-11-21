const Player = require('./Player');
const Game = require('./Game');

module.exports = class DistributedGame extends Game {


    constructor(name, nb, tableId, io) {
        super(name, nb, tableId, io);
        this.type = "distributed";
        this.io.to(this.tableId).emit('chat message', {
            code: 100,
            message: this.name + ' - ' + this.type + ' (' + this.playersCount + ' joueurs)'
        });
    }

    addPlayer(id) {
        console.log(id + ' joining ' + this.name);
        if (this.players.length < this.playersCount) {
            this.players.push(new Player(id, this.maxHealth, 0));
            this.io.to(id).emit('chat message', {code: 202, message: 'successfully joined game'});

            if (this.players.length === this.playersCount) {
                this.setReady();
            }
        } else {
            this.io.to(id).emit('chat message', {code: 405, message: 'game is full'})
        }
    }

    setReady() {
        this.isReady = true;
        console.log(this.name + " is ready to start")

        let players_data = [];
        this.players.forEach(a => {
            let obj = {};
            obj['id'] = a.id;
            obj['position'] = a.position;
            obj['health'] = a.health;
            players_data.push(obj)
            this.io.to(a.id).emit('ready to start', {game: this.name, player: obj})
        });
        this.io.to(this.tableId).emit('ready to start', {game: this.name, players: players_data})
    }

    distributeCards(){
        this.cardsManager.distribute(this.players);
        this.io.to(this.tableId).emit('card distribution', 'ntm')
        let players_data = [];
        this.players.forEach(a => {
            let obj = {};
            obj['id'] = a.id;
            obj['styleCards'] = a.styleCards;
            obj['hitCards'] = a.hitCards;
            players_data.push(obj)
            this.io.to(a.id).emit('card distribution', {game: this.name, player: obj})
        });
        this.io.to(this.tableId).emit('card distribution', {game: this.name, players: players_data})
    }

    sendToAllPlayer(t,m) {
        for (let i in this.players) {
            this.io.to(this.players[i].id).emit(t, m)
        }
    }


}