const Player = require('./Player');
const Game = require('./Game');
const ConnectionState = require('./states/ConnectionState');


module.exports = class DistributedGame extends Game {


    constructor(name, nb, tableId, io) {
        super(name, nb, tableId, io);
        this.type = "distributed";
        this.io.to(this.tableId).emit('chat message', {
            code: 100,
            message: this.name + ' - ' + this.type + ' (' + this.playersCount + ' joueurs)'
        });
        this.state = new ConnectionState(this);
    }

    addPlayer(id) {
        console.log(id + ' joining ' + this.name);
        if (this.players.length < this.playersCount) {
            let team = (this.players.length) % 2;
            let position = team === 0 ? 1 : this.fieldSize - 1;
            this.players.push(new Player(id, this.maxHealth, position, team));

            this.io.to(id).emit('chat message', {code: 202, message: 'successfully joined game'});

            if (this.players.length === this.playersCount) {
                this.state.next();
                this.setReady();
            }
        } else {
            this.io.to(id).emit('chat message', {code: 405, message: 'game is full'})
        }
    }

    setReady() {
        let players_data = [];
        this.players.forEach(a => {
            let obj = {};
            obj['id'] = a.id;
            obj['position'] = a.position;
            obj['health'] = a.health;
            obj['team'] = a.team;
            obj['round'] = this.currentRound;
            players_data.push(obj);
            this.io.to(a.id).emit('ready to start', {game: this.name, player: obj})
        });
        this.io.to(this.tableId).emit('ready to start', {game: this.name, players: players_data})
    }

    distributeCards() {
        this.cardsManager.distribute(this.players);
        this.io.to(this.tableId).emit('card distribution', 'ntm');
        let players_data = [];
        this.players.forEach(a => {
            let obj = {};
            obj['id'] = a.id;
            obj['styleCards'] = a.styleCards;
            obj['hitCards'] = a.hitCards;
            players_data.push(obj);
            this.io.to(a.id).emit('card distribution', {game: this.name, player: obj})
        });
        this.io.to(this.tableId).emit('card distribution', {game: this.name, players: players_data})
    }

    setPlayerPicks(u) {
        let p = this.getPlayerById(u.id);
        if (p) {
            p.hitPick = u.hitPick;
            p.stylePick = u.stylePick;
            p.hasPicked = true;
            console.log(p.id, p.hitPick.title, p.stylePick.title)
            this.io.to(p.id).emit('chat message', {code : 204, message : 'card picks received'})
        } else {
            console.log('unrecognized player ', u.id, ' for picks')
        }
        if(this.allPlayersHavePicked()){
            this.state.next();
            this.startRound();
        }

    }

    allPlayersHavePicked(){
        for(let i in this.players){
            if(!this.players[i].hasPicked) return false;
        }
        return true;
    }

    closeGame(){
        this.state.next();
    }


};