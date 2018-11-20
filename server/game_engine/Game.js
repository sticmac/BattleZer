const Player = require('./Player');

module.exports = class Game {


    constructor(name, nb, tableId, io){
        this.playersCount = nb;
        this.name = name;
        this.players = [];
        this.tableId = tableId;
        this.type = null;
        this.io = io;

        this.io.to(this.tableId).emit('chat message','bonjour madame la table')
    }

    isReady(){
        this.io.to(this.name).emit('we are ready bois')
    }

    sendToTable(m){
        this.io.to(this.tableId).emit('chat message',m)
    }



    removePlayer(id){

    }



    sayWelcome(io){
        this.io.emit('chat message',"TOUT LE MONDE EST LA")
        console.log(JSON.stringify(this.players))
    }

}