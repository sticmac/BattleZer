var fs = require('fs');


module.exports = class CardsManager {

    /**
     * @param i : le nombre de fois où chaque carte est présente
     */
    constructor(i) {
        this.cards = JSON.parse(fs.readFileSync('data/cards.json', 'utf8'));

        this.styleDeck = this.generateStyleDeck(i);
        this.hitDeck = this.generateHitDeck(i);
    }

    distribute(players){
        for (let i = 0; i < 10; i++) {
            players.forEach(p => {
                p.giveCard(this.hitDeck.pop());
                p.giveCard(this.styleDeck.pop());
            })
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