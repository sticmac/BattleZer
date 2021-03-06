const Player = require('./Player');
const Game = require('./Game');
const ConnectionState = require('./states/ConnectionState');
const PicksState = require('./states/PicksState');
const Round = require('./Round');

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
            let position = team === 0 ? 1 : this.fieldSize-1;
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

    applyEffect(e) {
        super.applyEffect(e);

        if (this.round) this.updateRound();
    }

    applyAttack(e) {
        super.applyAttack(e);

        if (this.round) this.updateRound();
    }

    sendPlayersUpdate() {
        let obj = {};
        obj['game'] = this.name;
        obj['players'] = [];
        let deads = [];

        this.players.forEach(player => {
            if (player.health === 0) deads.push(player);

            const p = {
                id: player.id,
                health: player.health,
                position: player.position
            };

            obj['players'].push(p);

            this.io.to(p.id).emit('update player', p);
        });

        this.io.to(this.tableId).emit('update players', obj)
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

    startRound() {
        this.attacks = [];
        this.players.forEach(a => {
            const attack = {
                id: a.id,
                rank: null,
                attack: this.cardsManager.generateAttack(a),
                hitCard: a.hitPick,
                styleCard: a.stylePick
            }
            this.attacks.push(attack);
        });

        this.attacks.sort(this.comparePriority);
        for (let i = 0; i < this.players.length; i++) {
            this.attacks[i].rank = i;
        }

        this.io.to(this.tableId).emit('start round', {game: this.name, players: this.attacks})

        this.round = new Round(this, this.io);
        this.runRoundForNextAttack();
    }

    endRound() {
        // clear and apply end round effects
        this.players.forEach(p => {
            p.status['protect'].duration = 0;
        });

        //distribute new cards
        this.cardsManager.newRound(this.players);

        let players_data = [];
        this.players.forEach(a => {
            let obj = {};
            obj['id'] = a.id;
            obj['styleCards'] = a.styleCards;
            obj['hitCards'] = a.hitCards;
            obj['health'] = a.health;
            obj['position'] = a.position;
            players_data.push(obj);
            this.io.to(a.id).emit('end round', obj);
        });

        this.io.to(this.tableId).emit('end round', {
            game: this.name,
            round : this.currentRound,
            players: players_data
        });

        console.log('[4] ' + this.name + ' ends round #' + this.currentRound);
        this.players.forEach(p => p.hasPicked = false);
        this.state = new PicksState(this);
        this.currentRound++;
    }

    closeGame(){
        this.state.value = 'over';
    }

    updateRound() {
        if (!this.round.finished) {
            console.log("run next state");
            this.round.runNextState();
        } else if (this.attacks.length > 0) {
            console.log("run next attack");
            this.runRoundForNextAttack();
        } else {
            console.log("end round");
            this.endRound();
        }
    }

    runRoundForNextAttack() {
        const attack = this.attacks.shift();
        this.round.start(attack)
    }
};