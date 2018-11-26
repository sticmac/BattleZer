module.exports = class Player {

    constructor(id, health, position, team){
        this.id = id;
        this.team = team;
        this.health = health;
        this.position = position;
        this.styleCards = [];
        this.hitCards = [];
        this.stylePick = null;
        this.hitPick = null;
        this.hasPicked = false;
        this.isDead = false;


        this.status = {
            'protect' : {
                duration : 0,
                value : 0
            },
            'close-proect': {
                duration : 0,
                value : 0
            }
        }
    }










    giveStyleCard(c){
        this.styleCards.push(c)
    }

    giveHitCard(c){
        this.hitCards.push(c)
    }
}