const Card = require('./Card.js');
const Phaser = require('phaser');

module.exports = class CardZone {


    constructor(hitCardsModels, styleCardsModels, x, y, cardWidth, cardHeight, scene) {
        this.container = scene.add.container(x, y);
        this.cardsContainer = scene.add.container(0, 0);
        this.scene = scene;

        this.cardHeight = cardHeight;
        this.cardWidth = cardWidth;

        this.selectedHitCard = 0;
        this.selectedStyleCard = 0;
        this.showBack = true;
        this.readyButton = null;

        this.hitCards = [];
        this.styleCards = [];
        for (let i = 0; i < hitCardsModels.length; i++) {
            this.hitCards.push(new Card(hitCardsModels[i], 200, 0, cardWidth, cardHeight, scene, 'card_back'));
            this.styleCards.push(new Card(styleCardsModels[i], cardWidth + 250, 0, cardWidth, cardHeight, scene, 'card_back'));
        }
    }


    drawInterface(){
        this.container.removeAll();
        let hitNextButton = this.scene.add.rectangle(20, 0, 80, 150, 0xff0000).setOrigin(0.5);
        hitNextButton.setInteractive();
        this.container.add(hitNextButton);

        let styleNextButton = this.scene.add.rectangle((250 + 2 * this.cardWidth), 0, 80, 150, 0x00ff00).setOrigin(0.5);
        styleNextButton.setInteractive();
        this.container.add(styleNextButton);


        /*this.readyButton = this.scene.add.rectangle(4 * this.cardWidth + 80, 0, 200, 80, 0x00f6f0).setOrigin(0.5);
        this.readyButton.setInteractive();
        this.container.add(this.readyButton);*/

        this.readyButton = this.scene.add.container(4 * this.cardWidth + 80, 0);
        this.readyButton.add(this.scene.add.rectangle(0, 0, 200, 80, 0x00f6f0).setOrigin(0.5));
        this.readyButton.add(this.addText(0, 0, "ready", 20));
        this.readyButton.setSize(200, 80);
        this.readyButton.setInteractive();
        this.container.add(this.readyButton);


        let barX = 0;
        let barY = -(this.cardHeight / 2)-50;
        let hideBar = this.scene.add.rectangle(barX, barY, this.cardWidth * 3, 40, 0xffd852).setOrigin(0, 0);
        hideBar.setInteractive();
        this.container.add(hideBar)

        this.container.add(this.addText(barX + barX / 2, barY,"click to show",20));


        hitNextButton.on('pointerdown', () => {
            this.showNextHit();
        });

        styleNextButton.on('pointerdown', () => {
            this.showNextStyle()
        });

        hideBar.on('pointerdown', () => {
            this.showBack = !this.showBack;
            this.flip()
        });

    }

    draw() {
        this.container.removeAll();

        this.drawInterface();
        this.drawCards();
    }


    drawCards(){
        this.cardsContainer.removeAll();

        this.hitCards[this.selectedHitCard].draw(this.showBack);
        this.cardsContainer.add(this.hitCards[this.selectedHitCard].container);

        this.styleCards[this.selectedStyleCard].draw(this.showBack);
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


    flip() {
        this.hitCards[this.selectedHitCard].draw(this.showBack);

        this.styleCards[this.selectedStyleCard].draw(this.showBack);
    }
}
