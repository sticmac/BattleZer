const Player = require('./Player');
const CardsManager = require('./CardsManager');

module.exports = class Game {


    constructor(name, nb, tableId, io){
        this.playersCount = nb;
        this.name = name;
        this.players = [];
        this.tableId = tableId;
        this.type = null;
        this.io = io;
        this.isReady = false;

        this.cardsManager = new CardsManager(2);

        this.battlefieldSize = 9;
        this.maxHealth = 20;
    }





    sendToTable(m){
        this.io.to(this.tableId).emit('chat message',m)
    }

    getPlayerById(id){
        for(let i in this.players){
            let p = this.players[i];
            if(p.id === id) return p;
        } return null;
    }



}