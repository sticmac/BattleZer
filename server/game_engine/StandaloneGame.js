const Player = require('./Player');
const Game = require('./Game');

module.exports = class StandaloneGame extends Game{

    /*
    emitting to tableId or to namespace (this.name) is the same
     */

    constructor(name, nb, tableId, io){
        super(name, nb, tableId, io);
        this.type = "standalone";
       this.initPlayers();
    }

    initPlayers(){
        for (let i = 1; i<=this.playersCount;i++){
            this.players.push(new Player("player "+i))
        }
        this.io.to(this.tableId).emit('chat message',this.name +' - '+this.type + ' ('+this.playersCount+' joueurs)');

    }

    addPlayer(id){
        this.io.to(id).emit('chat message','cette game n\'accepte pas de joueur smartphone');
    }


    removePlayer(id){

    }

    sayWelcome(io){
        super.sayWelcome(io);
    }

}