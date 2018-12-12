const Card = require('./Card.js');
const CardZone = require('./CardZone');

module.exports = class ListCardZone extends CardZone {

    constructor(hitCardsModels, styleCardsModels, x, y, cardWidth, cardHeight, scene) {
        super(hitCardsModels, styleCardsModels, x, y, cardWidth, cardHeight, scene);
    }

    initCards(hitCardsModels, styleCardsModels) {
        for (let i = 0; i < hitCardsModels.length; i++) {
            this.hitCards.push(new Card(hitCardsModels[i], 100 + i * (this.cardWidth + 5), 0, this.cardWidth, this.cardHeight, this.scene, 'card_back'));
            this.styleCards.push(new Card(styleCardsModels[i], 100 + i * (this.cardWidth + 5), this.cardHeight + 30, this.cardWidth, this.cardHeight, this.scene, 'card_back'));
        }
    }

    drawInterface() {
        this.container.removeAll();

        this.readyButton = this.scene.add.text((this.hitCards.length + 1) * this.cardWidth, this.cardHeight / 2, 'READY ?', {
            backgroundColor: "#cc7c1a",
            padding: 10,
            color: "#fff",
            fontFamily: 'Arial',
            fontSize: 27
        }).setOrigin(0.5);
        this.readyButton.setInteractive();
        this.container.add(this.readyButton);
    }

    drawCards() {
        this.cardsContainer.removeAll();

        this.hitCards.forEach((card, index) => {
            this.cardsContainer.add(card.container);
            card.draw();
            card.container.setInteractive();
            card.container.on('pointerdown', () => this.chooseHit(index));
        });
        this.styleCards.forEach((card, index) => {
            this.cardsContainer.add(card.container);
            card.draw();
            card.container.setInteractive();
            card.container.on('pointerdown', () => this.chooseStyle(index));
        });

        // default cards
        this.chooseHit(0);
        this.chooseStyle(0);

        this.container.add(this.cardsContainer);
    }

    chooseHit(cardIndex) {
        const oldHitContainer = this.hitCards[this.selectedHitCard].container;
        oldHitContainer.setPosition(oldHitContainer.x, 0);

        this.selectedHitCard = cardIndex;
        const newHitContainer = this.hitCards[this.selectedHitCard].container;
        newHitContainer.setPosition(newHitContainer.x, -20);
    }

    chooseStyle(cardIndex) {
        const oldStyleContainer = this.styleCards[this.selectedStyleCard].container;
        oldStyleContainer.setPosition(oldStyleContainer.x, this.cardHeight + 30);

        this.selectedStyleCard = cardIndex;
        const newStyleContainer = this.styleCards[this.selectedStyleCard].container;
        newStyleContainer.setPosition(newStyleContainer.x, this.cardHeight + 10);
    }
}