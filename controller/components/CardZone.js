const Card = require('./Card.js');

module.exports = class CardZone {


    constructor(hitCardsModels, styleCardsModels, x, y, scale, scene) {
        this.container = scene.add.container(x, y);
        this.cardsContainer = scene.add.container(0, 0);
        this.scene = scene;

        this.cardWidth = 192;
        this.cardHeight = 270;
        this.scale = scale;

        this.selectedHitCard = 0;
        this.selectedStyleCard = 0;
        this.readyButton = null;

        this.hitCards = [];
        this.styleCards = [];
        for (let i = 0; i < hitCardsModels.length; i++) {
            this.hitCards.push(new Card(hitCardsModels[i], 200, 0, this.cardWidth, this.cardHeight, scene, 'card_back'));
            this.styleCards.push(new Card(styleCardsModels[i], this.cardWidth + 250, 0, this.cardWidth, this.cardHeight, scene, 'card_back'));
        }
    }


    drawInterface() {
        this.container.removeAll();
        let hitNextButton = this.scene.add.image(26, 0, 'arrow_left')
            .setOrigin(0.5)
            .setScale(0.5, 0.5);
        hitNextButton.setInteractive();
        this.container.add(hitNextButton);


        let styleNextButton = this.scene.add.image((250 + 2 * this.cardWidth), 0, 'arrow_right')
            .setOrigin(0.5)
            .setScale(0.5, 0.5);
        styleNextButton.setInteractive();
        this.container.add(styleNextButton);


        this.readyButton = this.scene.add.image(4 * this.cardWidth + 80, 0,'ready').setScale(0.5,0.5);
        this.readyButton.setInteractive();
        this.container.add(this.readyButton);

        this.readyButton.on('pointerover',() => {
            this.readyButton = this.scene.add.image(4 * this.cardWidth + 80, 0,'ready_hover').setScale(0.5,0.5);
            this.container.add(this.readyButton)
        });
        this.readyButton.on('pointerout',() => {
            this.readyButton = this.scene.add.image(4 * this.cardWidth + 80, 0,'ready').setScale(0.5,0.5);
            this.container.add(this.readyButton)
        });


        hitNextButton.on('pointerdown', () => {
            this.showNextHit();
        });

        styleNextButton.on('pointerdown', () => {
            this.showNextStyle()
        });

    }

    draw() {
        this.container.removeAll();

        this.drawInterface();
        this.drawCards();
    }


    drawCards() {
        this.cardsContainer.removeAll();

        let prevH = (this.selectedHitCard + 1) % this.hitCards.length;
        let prevS = (this.selectedStyleCard + 1) % this.styleCards.length;

        this.hitCards[this.selectedHitCard].draw(this.showBack);
        this.hitCards[prevH].drawBehind(this.showBack);

        this.cardsContainer.add(this.hitCards[prevH].container);
        this.cardsContainer.add(this.hitCards[this.selectedHitCard].container);


        this.styleCards[this.selectedStyleCard].draw(this.showBack);
        this.styleCards[prevS].drawBehind(this.showBack);

        this.cardsContainer.add(this.styleCards[prevS].container);
        this.cardsContainer.add(this.styleCards[this.selectedStyleCard].container);

        this.container.add(this.cardsContainer);
    }


    showNextHit() {
        this.selectedHitCard = (this.selectedHitCard + 1) % this.hitCards.length;
        this.drawCards()
    }

    showNextStyle() {
        this.selectedStyleCard = (this.selectedStyleCard + 1) % this.styleCards.length;
        this.drawCards();
    }

    addText(x, y, t, s) {
        return this.scene.add.text(x, y, t, {
            fontFamily: 'Arial Black',
            fontSize: s,
            color: "#1e3045"
        });
    }
}
