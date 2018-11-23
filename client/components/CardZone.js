const Card = require('./Card.js');

module.exports = class CardZone {


    constructor(hitCardsModels, styleCardsModels, x, y, cardWidth, cardHeight, scene) {
        this.cardsContainer = scene.add.container(x, y);
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
        let hitNextButton = this.scene.add.rectangle(20, 0, 80, 150, 0xff0000).setOrigin(0.5);
        hitNextButton.setInteractive();
        this.cardsContainer.add(hitNextButton);

        let styleNextButton = this.scene.add.rectangle((250 + 2 * this.cardWidth), 0, 80, 150, 0x00ff00).setOrigin(0.5);
        styleNextButton.setInteractive();
        this.cardsContainer.add(styleNextButton);


        this.readyButton = this.scene.add.rectangle(4 * this.cardWidth + 80, 0, 200, 80, 0x00f6f0).setOrigin(0.5);
        this.readyButton.setInteractive();
        this.cardsContainer.add(this.readyButton);


        let barX = 0;
        let barY = -(this.cardHeight / 2)-50;
        let hideBar = this.scene.add.rectangle(barX, barY, this.cardWidth * 3, 40, 0xffd852).setOrigin(0, 0);
        hideBar.setInteractive();
        this.cardsContainer.add(hideBar)

        this.addText(barX + barX / 2, barY,"click to show",20);
        this.addText(4 * this.cardWidth + 80, 0, "ready", 25);


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

        /*
        btnbar.on('pointerup', () => {
        })
        */


    }

    draw() {
        this.cardsContainer.removeAll();

        this.drawCards();
        this.drawInterface();
    }


    drawCards(){

        this.hitCards[this.selectedHitCard].draw(this.showBack);
        this.cardsContainer.add(this.hitCards[this.selectedHitCard].container);

        this.styleCards[this.selectedStyleCard].draw(this.showBack);
        this.cardsContainer.add(this.styleCards[this.selectedStyleCard].container);
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
        this.cardsContainer.add(this.scene.add.text(x, y, t, {
            fontFamily: 'Arial Black',
            fontSize: s,
            color: "#1e3045"
        }));
    }


    flip() {

        this.hitCards[this.selectedHitCard].draw(this.showBack);

        this.styleCards[this.selectedStyleCard].draw(this.showBack);
    }
}
