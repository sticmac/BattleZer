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

    applyAttack(e) {
        let player = this.getPlayerById(e.player);
        console.log('#', player.id, '->', e.action + ' attack');
        let playersOnTarget = this.getPlayersOnTile(e.target);

        switch (e.action) {
            case 'basic' :
                playersOnTarget.forEach(p => {
                    p.health = p.health - e.power;
                    if (p.health <= 0) {
                        p.health = 0;
                        p.isDead = true;
                    }
                });
                break;
            default :
                break;

        }
        this.checkForGameOver();
        this.sendPlayersUpdate();
    }

    applyEffect(e) {
        let player = this.getPlayerById(e.player);
        console.log('#', player.id, '->', e.action + ' effect');

        switch (e.action) {
            case 'basic' :
                break;
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
        this.checkForGameOver();
        this.sendPlayersUpdate();

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

        if (deads.length > 0) this.sendPlayersDeath(deads);
        this.io.to(this.tableId).emit('update player', obj)
    }

    sendPlayersDeath(d) {
        let res = {};
        res['game'] = this.name;
        res['deads'] = [];
        d.forEach(p => {
            res['deads'].push(p.id);
        });
        this.io.to(this.tableId).emit('death', res)
    }

    checkForGameOver() {
        let teamSize = this.playersCount / 2;
        let dead0 = [];
        let dead1 = [];
        this.players.forEach(a => {
            if(a.isDead) {
                console.log('# '+a.id + ' est mort');
                a.team === 0 ? dead0.push(a.id) : dead1.push(a.id)
            }
        });
        if(dead0.length === teamSize) this.sendGameOver(1);
        if(dead1.length === teamSize) this.sendGameOver(0);
    }

    sendGameOver(i) {
        let winners = [];
        this.players.forEach(a => {
            if(a.team === i ) winners.push(a.id)
        });
        this.io.to(this.tableId).emit('game over', {
            game: this.name,
            winner: i,
            players : winners,
        });

        this.closeGame();
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

    closeGame(){
    }

}



