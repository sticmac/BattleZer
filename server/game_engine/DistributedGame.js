const Player = require('./Player');
const Game = require('./Game');

module.exports = class DistributedGame extends Game{


    constructor(name, nb, tableId, io){
        super(name, nb, tableId, io);
        this.type = "distributed";
        this.io.to(this.tableId).emit('chat message','dis aux yenclis de faire deuspi');
        this.io.to(this.tableId).emit('chat message',this.name +' - '+this.type + ' ('+this.playersCount+' joueurs)');
    }

    addPlayer(id){

        console.log("adding new smartphone player : "+id);
        if(this.players.length < this.playersCount){
            this.players.push(new Player(id));
            this.io.to(id).emit('chat message','bienvenu a toi yencli')
        } else {
            this.io.to(id).emit('chat message','pas de place pour toi yencli')
        }
        this.sendToAllPlayer('vous êtes maintenant '+this.players.length)
    }

    toString(){
        return this.name +' - '+this.type + ' ('+this.playersCount+' joueurs)'
    }

    sendToAllPlayer(m){
        for(let i in this.players) {
            this.io.to(this.players[i].id).emit('chat message', m)
        }
    }



    sayWelcome(io){
        super.sayWelcome(io);
    }

}