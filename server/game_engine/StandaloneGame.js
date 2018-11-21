const Player = require('./Player');
const Game = require('./Game');

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
        this.initPlayers();
    }

    initPlayers() {
        for (let i = 1; i <= this.playersCount; i++) {
            let team = (i - 1) % 2;
            let position = team === 0 ? 1 : this.fieldSize - 1;
            this.players.push(new Player("player " + i, this.maxHealth, position, team));
        }
        this.setReady();
    }


    startRound(){
        //préparer les attaques pour chaque joueur
        //ordonner les joueurs par priorité
        //envoyer à la table les infos
        // next state --> attente des attack actions
    }

    newRound(){
        //remise des cartes dans le paquet + shuffle
        //distribuer a nouveau
    }


    setReady() {
        this.isReady = true;
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
        console.log(this.name + " is ready to start")
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

    setPlayerPicks(u){
            let p = this.getPlayerById(u.id);
            if(p){
                p.hitPick = u.hitPick;
                p.stylePick = u.stylePick;
                p.hasPicked = true;
                console.log(p.id,p.hitPick.title,p.stylePick.title)
            } else {
                console.log('unrecognized player ',u.id,' for picks')
            }
        //check if all players have picked, then go to next state
    }

};