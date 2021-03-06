var fs = require('fs');


module.exports = class CardsManager {

    /**
     * @param i : le nombre de fois où chaque carte est présente
     */
    constructor(i) {
        this.cards = JSON.parse(fs.readFileSync('server/data/cards_simple.json', 'utf8'));

        this.styleDeck = this.generateStyleDeck(i);
        this.hitDeck = this.generateHitDeck(i);

    }


    newRound(players) {
        players.forEach(p => {
            let w = p.removePicks();
            if(w[0]) this.styleDeck.unshift(w[0]);
            if(w[1]) this.hitDeck.unshift(w[1]);
            this.distributeOne(p)
        });
    }

    distributeOne(player){
        if(player.hitCards.length < 5) player.giveHitCard(this.hitDeck.pop());
        if(player.styleCards.length < 5) player.giveStyleCard(this.styleDeck.pop());
    }

    distribute(players) {
        for (let i = 0; i < 5; i++) {
            players.forEach(p => {
                p.giveHitCard(this.hitDeck.pop());
                p.giveStyleCard(this.styleDeck.pop());
            })
        }
    }

    generateAttack(player) {

        let h = player.hitPick;
        let s = player.stylePick;


        let actions = {};
        actions['before'] = [];
        actions['during'] = [];
        actions['after'] = [];

        h.actions.forEach(a => {
            actions[a.time].push({
                action: a.action,
                type: h.type,
                value: a.value
            });
        });

        s.actions.forEach(a => {
            actions[a.time].push({
                action: a.action,
                type: h.type,
                value: parseInt(a.value)
            });
        });


        return {
            power: parseInt(h.power) + parseInt(s.power),
            priority: parseInt(h.priority) + parseInt(s.priority),
            range: parseInt(h.range) + parseInt(s.range),
            actions: actions
        }
    }

    shuffle(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    }


    generateHitDeck(n) {
        let x = [];

        this.cards.forEach(c => {
            if (c.type === 'Coup') {
                for (let i = 0; i < n; i++) {
                    x.push(c)
                }
            }
        });
        return this.shuffle(x);
    }

    generateStyleDeck(n) {
        let x = [];

        this.cards.forEach(c => {
            if (c.type === 'Style') {
                for (let i = 0; i < n; i++) {
                    x.push(c)
                }
            }
        });
        return this.shuffle(x);
    }
};