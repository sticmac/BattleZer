module.exports = class Player {

    constructor(id, health, position){
        this.id = id;
        this.health = health;
        this.position = position;
        this.cards = [];
    }

    giveCard(c){
        this.cards.push(c)
    }
}