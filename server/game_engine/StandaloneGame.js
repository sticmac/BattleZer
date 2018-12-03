const Player = require('./Player');
const Game = require('./Game');
const ConnectionState = require('./states/ConnectionState');
const PicksState = require('./states/PicksState');

module.exports = class StandaloneGame extends Game {

    /*
    emitting to tableId or to namespace (this.name) is the same
     */

    constructor(name, nb, tableId, io) {
        super(name, nb, tableId, io);
        this.type = "standalone";
        this.io.to(this.tableId).emit('chat message', {
            code: 100,
            message: this.name + ' - ' + this.type + ' (' + this.playersCount + ' joueurs)'
        });

        this.state = new ConnectionState(this)
        this.initPlayers();
    }

    initPlayers() {
        for (let i = 1; i <= this.playersCount; i++) {
            let team = (i - 1) % 2;
            let position = team === 0 ? 1 : this.fieldSize - 1;
            this.players.push(new Player("player " + i, this.maxHealth, position, team));
        }
        this.state.next();
        this.setReady();
    }

    startRound() {
        let attacks = [];
        this.players.forEach(a => {
            attacks.push({
                id: a.id,
                rank: null,
                attack: this.cardsManager.generateAttack(a),
                hitCard: a.hitPick,
                styleCard: a.stylePick
            });
        });

        attacks.sort(this.comparePriority);
        for (let i = 0; i < this.players.length; i++) {
            attacks[i].rank = i;
        }

        this.io.to(this.tableId).emit('start round', {game: this.name, players: attacks})
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
        });

        this.io.to(this.tableId).emit('end round', {
            game: this.name,
            round : this.currentRound,
            players: players_data
        });


        console.log('[4] ' + this.name + ' ends round #' + this.currentRound);
        this.state = new PicksState(this);
        this.currentRound++;
    }

    sendPlayersUpdate() {
        let obj = {};
        obj['game'] = this.name;
        obj['players'] = [];
        let deads = [];

        this.players.forEach(player => {
            if (player.health === 0) deads.push(player);

            obj['players'].push({
                id: player.id,
                health: player.health,
                position: player.position
            })
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
        });
        this.io.to(this.name).emit('ready to start', {game: this.name, players: players_data});
    }

    distributeCards() {
        this.cardsManager.distribute(this.players);
        let players_data = [];
        this.players.forEach(a => {
            let obj = {};
            obj['id'] = a.id;
            obj['styleCards'] = a.styleCards;
            obj['hitCards'] = a.hitCards;
            players_data.push(obj);
        });

        this.io.to(this.tableId).emit('card distribution', {game: this.name, players: players_data})
    }

    setPlayerPicks(u) {
        let p = this.getPlayerById(u.id);
        if (p) {
            p.hitPick = u.hitPick;
            p.stylePick = u.stylePick;
            p.hasPicked = true;
            console.log('#',p.id,'->', p.hitPick.title, p.stylePick.title)
        } else {
            console.log('unrecognized player ', u.id, ' for picks')
        }
    }

    allPlayersHavePicked() {
        for (let i in this.players) {
            if (!this.players[i].hasPicked) return false;
        }
        return true;
    }

    closeGame(){
        this.state.value = 'over';
    }

};