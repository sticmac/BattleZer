module.exports = class Player {

    constructor(id, health, position, team){
        this.id = id;
        this.team = team;
        this.health = health;
        this.position = position;
        this.styleCards = [];
        this.hitCards = [];
    }

    giveStyleCard(c){
        this.styleCards.push(c)
    }

    giveHitCard(c){
        this.hitCards.push(c)
    }
}