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

        this.status = {
            'protect' : {
                length : 0,
                value : 0
            }
        }
    }

    /*
    TODO : fin de round
    à la fin de chaque round :
    pour chaque élément de this.state, duration --, et si duration = 0 on efface
     */






    giveStyleCard(c){
        this.styleCards.push(c)
    }

    giveHitCard(c){
        this.hitCards.push(c)
    }
}