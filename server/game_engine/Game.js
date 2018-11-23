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
                hitCard : a.hitPick,
                styleCard : a.stylePick
            });
        });

        attacks.sort(this.comparePriority);
        for(let i = 0;i<this.players.length;i++){
            attacks[i].rank = i;
        }

        this.io.to(this.tableId).emit('start round', {game : this.name, players : attacks})

    }


    comparePriority(a, b) {
        return b.attack.priority - a.attack.priority;
    }

}



