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
            'close-protect': {
                duration : 0,
                value : 0
            }
        }
    }

    removePicks(){
        let rep = [null,null];
        for(let i in this.styleCards){
            let s = this.styleCards[i];
            if(this.stylePick.title === s.title){
                this.styleCards.splice(i,1);
                rep[0] =  s;
                break;
            }
        }

        for(let i in this.hitCards){
            let h = this.hitCards[i];
            if(this.hitPick.title === h.title){
                this.hitCards.splice(i,1);
                rep[1] = h;
                break;
            }
        }
        return rep;
    }



    giveStyleCard(c){
        this.styleCards.push(c)
    }

    giveHitCard(c){
        this.hitCards.push(c)
    }
}