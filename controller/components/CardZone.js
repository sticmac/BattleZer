const Card = require('./Card.js');

module.exports = class CardZone {

    constructor(hitCardsModels, styleCardsModels, x, y, cardWidth, cardHeight, scene) {
        this.container = scene.add.container(x, y);
        this.cardsContainer = scene.add.container(0, 0);
        this.leftSwipeContainer = scene.add.container(0, 0);
        this.rightSwipeContainer = scene.add.container(0, 0);
        this.scene = scene;

        this.cardHeight = cardHeight;
        this.cardWidth = cardWidth;

        this.selectedHitCard = 0;
        this.selectedStyleCard = 0;
        this.readyButton = null;

        this.hitCards = [];
        this.styleCards = [];
        this.initCards(hitCardsModels, styleCardsModels);

        this.shift = cardWidth / 2;
    }

    draw() {
        this.container.removeAll();

        this.drawInterface();
        this.drawCards();
    }

    addText(x, y, t, s) {
        return this.scene.add.text(x, y, t, {
            fontFamily: 'Arial Black',
            fontSize: s,
            color: "#1e3045"
        });
    }

    ready(){
        this.readyButton.setBackgroundColor('#327e32');
        this.readyButton.setText('READY !')
    }
};
