const Card = require('./Card.js');

module.exports = class CardZone {
    constructor(hitCardsModels, styleCardsModels, x, y, cardWidth, cardHeight, scene) {
        this.cardsContainer = scene.add.container(x, y);
        this.scene = scene;

        this.cardHeight = cardHeight;
        this.cardWidth = cardWidth;

        this.selectedHitCard = 0;
        this.selectedStyleCard = 0;
        this.hitMode = true;

        this.hitCards = [];
        this.styleCards = [];
        for (let i = 0; i < hitCardsModels.length; i++) {
            this.hitCards.push(new Card(hitCardsModels[i], 200, 0, cardWidth, cardHeight, scene, 'card_back'));
            this.styleCards.push(new Card(styleCardsModels[i], cardWidth + 250, 0, cardWidth, cardHeight, scene, 'card_back'));
        }
    }

    draw() {


        this.cardsContainer.removeAll();

        this.hitCards[this.selectedHitCard].draw();
        this.cardsContainer.add(this.hitCards[this.selectedHitCard].container);

        this.styleCards[this.selectedStyleCard].draw();
        this.cardsContainer.add(this.styleCards[this.selectedStyleCard].container);



        let btn1 = this.scene.add.rectangle(20, 0, 80,150,0xff0000).setOrigin(0.5);
        btn1.setInteractive();
        this.cardsContainer.add(btn1);

        let btn2 = this.scene.add.rectangle((250+2*this.cardWidth), 0, 80,150,0x00ff00).setOrigin(0.5);
        btn2.setInteractive();
        this.cardsContainer.add(btn2);

        btn1.on('pointerdown', () => {
            this.showNextHit();
        });

        btn2.on('pointerdown', () => {
            this.showNextStyle()
        });


    }


    showNextHit() {
        this.selectedHitCard = (this.selectedHitCard + 1)% this.hitCards.length;
        console.log('hit card ',this.selectedHitCard+1,'/',this.hitCards.length);
        this.draw();
    }

    showNextStyle() {
        this.selectedStyleCard = (this.selectedStyleCard + 1)% this.styleCards.length;
        console.log('style card ',this.selectedStyleCard+1,'/',this.styleCards.length);
        this.draw();
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

};