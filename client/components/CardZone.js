const Card = require('./Card.js');

module.exports = class CardZone {
    constructor(hitCardsModels, styleCardsModels, x, y, cardWidth, cardHeight, scene) {
        this.cardsContainer = scene.add.container(x, y);
        this.scene = scene;

        this.selectedHitCard = false;
        this.selectedStyleCard = false;
        this.hitMode = true;

        this.hitCards = [], this.styleCards = [];
        for (let i = 0 ; i < hitCardsModels.length ; i++) {
            this.hitCards.push(new Card(hitCardsModels[i], i * (cardWidth + 50), 0, cardWidth, cardHeight, scene, 'card_back'));
            this.styleCards.push(new Card(styleCardsModels[i], i* (cardWidth + 50), 0, cardWidth, cardHeight, scene, 'card_back'));
        }
    }

    draw() {
        this.cardsContainer.removeAll();
        if (this.hitMode) {
            this.hitCards.forEach((element) => {
                element.draw();
                this.cardsContainer.add(element.container);
            });
        } else {
            this.styleCards.forEach((element) => {
                element.draw();
                this.cardsContainer.add(element.container);
            });
        }
    }

    flip() {
        if (this.hitMode) {
            this.hitCards.forEach((element) => {
                element.flip();
                element.draw();
            });
        } else {
            this.styleCards.forEach((element) => {
                element.flip();
                element.draw();
            });
        }
    }
        
}