const Player = require('./Player');
const CardsManager = require('./CardsManager');

module.exports = class Game {


    constructor(name, nb, tableId, io) {
        this.playersCount = nb;
        this.name = name;
        this.players = [];
        this.tableId = tableId;
        this.type = null;
        this.io = io;
        this.currentRound = 0;

        this.cardsManager = new CardsManager(2);

        this.fieldSize = 9;
        this.maxHealth = 20;
    }

    sendToTable(m) {
        this.io.to(this.tableId).emit('chat message', m)
    }

    applyEffect(e) {
        let player = this.getPlayerById(e.player);

        this.io.to().emit('chat message', {message: player.id + ' fait ' + e.action + ' (' + e.value + ')'});

        switch (e.action) {
            case 'movement' :
                player.position = e.value;
                break;
            case 'protect' :
                player.status['protect'] = {duration: 1, value: e.value};
                break;
            case 'heal':
                player.health + e.value >= this.maxHealth ?
                    player.health = 20 :
                    player.health = player.health + e.value;
                break;
            default :
                console.log('requested effect not implemented yet')
                break;
        }
        this.sendPlayersUpdate();

    }

    sendPlayersUpdate() {
        let obj = {};
        obj['game'] = this.name;
        obj['players'] = [];

        this.players.forEach(player => {
            obj['players'].push({
                id: player.id,
                health : player.health,
                position : player.position
            })
        });

        this.io.to(this.tableId).emit('update player', obj)
    }


    getPlayersOnTile(x) {
        let res = [];
        for (let i in this.players) {
            let p = this.players[i];
            if (p.position === x) res.push(p)
        }
        return res;
    }

    getPlayerById(id) {
        for (let i in this.players) {
            let p = this.players[i];
            if (p.id === id) return p;
        }
        return null;
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


    comparePriority(a, b) {
        return b.attack.priority - a.attack.priority;
    }

}



