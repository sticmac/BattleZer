const Card = require('./Card.js');

module.exports = class CardZone {


    constructor(hitCardsModels, styleCardsModels, x, y, cardWidth, cardHeight, scene) {
        this.container = scene.add.container(x, y);
        this.cardsContainer = scene.add.container(0, 0);
        this.scene = scene;

        this.cardHeight = cardHeight;
        this.cardWidth = cardWidth;

        this.selectedHitCard = 0;
        this.selectedStyleCard = 0;
        this.showBack = false;
        this.readyButton = null;

        this.hitCards = [];
        this.styleCards = [];
        for (let i = 0; i < hitCardsModels.length; i++) {
            this.hitCards.push(new Card(hitCardsModels[i], 180, 0, cardWidth, cardHeight, scene, 'card_back'));
            this.styleCards.push(new Card(styleCardsModels[i], 620, 0, cardWidth, cardHeight, scene, 'card_back'));
        }
        this.showTouch = 0;

        this.shift = cardWidth / 2;
    }


    drawInterface() {
        this.container.removeAll();
        let hitPrevButton = this.scene.add.image(16, 0, 'arrow_left_hit')
            .setOrigin(0.5)
            .setScale(0.5, 0.5);
        hitPrevButton.setInteractive();
        this.container.add(hitPrevButton);

        let hitNextButton = this.scene.add.image(345, 0, 'arrow_right_hit')
            .setOrigin(0.5)
            .setScale(0.5, 0.5);
        hitNextButton.setInteractive();
        this.container.add(hitNextButton);


        let stylePrevButton = this.scene.add.image(457, 0, 'arrow_left_style')
            .setOrigin(0.5)
            .setScale(0.5, 0.5);
        stylePrevButton.setInteractive();
        this.container.add(stylePrevButton);


        let styleNextButton = this.scene.add.image(783, 0, 'arrow_right_style')
            .setOrigin(0.5)
            .setScale(0.5, 0.5);
        styleNextButton.setInteractive();
        this.container.add(styleNextButton);

        //this.readyButton = this.scene.add.image(4 * this.cardWidth + 80, 0, 'ready').setScale(0.3);
        this.readyButton = this.scene.add.text(400, -85, 'READY ?', {
            backgroundColor: "#cc7c1a",
            padding: 10,
            color: "#fff",
            fontFamily: 'Arial',
            fontSize: 27
        }).setOrigin(0.5);
        this.readyButton.setInteractive();
        this.container.add(this.readyButton);


        let barY = -(this.cardHeight / 2) - 80;
        let hideBar = this.scene.add.rectangle(10, barY, 780, 70, 0x41AD8A).setOrigin(0, 0);
        hideBar.setInteractive();
        this.container.add(hideBar);

        this.container.add(this.addText(423, -(this.cardHeight / 2) - 60, "touch to show cards", 20).setOrigin(0.5));


        hitPrevButton.on('pointerdown', () => {
            this.showPrevHit();
        });

        stylePrevButton.on('pointerdown', () => {
            this.showPrevStyle()
        });

        hitNextButton.on('pointerdown', () => {
            this.showNextHit();
        });

        styleNextButton.on('pointerdown', () => {
            this.showNextStyle()
        });

        hideBar.on('pointerdown', () => {
            this.showTouch = Math.min(3, this.showTouch + 1);
            if (this.showTouch === 3) {
                console.log("Touching!");
                this.showBack = false;
                this.flip()
            }
        });

        hideBar.on('pointerup', () => {
            this.showTouch = Math.max(0, this.showTouch - 1);
            if (this.showTouch === 0) {
                console.log("untouch");
                this.showBack = true;
                this.flip()
            }
        });

    }

    draw() {
        this.container.removeAll();

        this.drawInterface();
        this.drawCards();
    }


    drawCards() {
        this.cardsContainer.removeAll();

        let nextH = (this.selectedHitCard + 1) % this.hitCards.length;
        let nextS = (this.selectedStyleCard + 1) % this.styleCards.length;

        let prevH = (this.selectedHitCard - 1 + this.hitCards.length) % this.hitCards.length;
        let prevS = (this.selectedStyleCard - 1 + this.hitCards.length) % this.styleCards.length;


        this.hitCards[this.selectedHitCard].draw(this.showBack);
        this.hitCards[prevH].drawBehind(this.showBack, (-this.shift));
        this.hitCards[nextH].drawBehind(this.showBack, this.shift);

        this.cardsContainer.add(this.hitCards[prevH].container.setScale(0.87));
        this.cardsContainer.add(this.hitCards[nextH].container.setScale(0.87));
        this.cardsContainer.add(this.hitCards[this.selectedHitCard].container.setScale(1));


        this.styleCards[this.selectedStyleCard].draw(this.showBack);
        this.styleCards[prevS].drawBehind(this.showBack, (-this.shift));
        this.styleCards[nextS].drawBehind(this.showBack, this.shift);

        this.cardsContainer.add(this.styleCards[prevS].container.setScale(0.87));
        this.cardsContainer.add(this.styleCards[nextS].container.setScale(0.87));
        this.cardsContainer.add(this.styleCards[this.selectedStyleCard].container.setScale(1));

        this.cardsContainer.add(this.scene.add.text(345, 70, (this.selectedHitCard + 1) + '/5', {
            backgroundColor: "#a5272a",
            padding: 5,
            color: "#fff",
            fontFamily: 'Arial',
            fontSize: 20
        }).setOrigin(0.5));

        this.cardsContainer.add(this.scene.add.text(450, 70, (this.selectedStyleCard+ 1) + '/5', {
            backgroundColor: "#137A2B",
            padding: 5,
            color: "#fff",
            fontFamily: 'Arial',
            fontSize: 20
        }).setOrigin(0.5));

        this.container.add(this.cardsContainer);
    }


    showPrevHit() {
        this.selectedHitCard = (this.selectedHitCard + 1 + this.hitCards.length) % this.hitCards.length;

        this.drawCards()
    }

    showPrevStyle() {
        this.selectedStyleCard = (this.selectedStyleCard + 1 + this.hitCards.length) % this.styleCards.length;
        this.drawCards();
    }

    showNextHit() {
        this.selectedHitCard = (this.selectedHitCard - 1 + this.hitCards.length) % this.hitCards.length;
        this.drawCards()
    }

    showNextStyle() {
        this.selectedStyleCard = (this.selectedStyleCard - 1 + this.hitCards.length) % this.styleCards.length;
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
        console.log("setting ready");
        this.readyButton.setBackgroundColor('#327e32');
        this.readyButton.setText('READY !')
    }



    flip() {
        let prevH = (this.selectedHitCard + 1) % this.hitCards.length;
        let prevS = (this.selectedStyleCard + 1) % this.styleCards.length;

        this.hitCards[this.selectedHitCard].draw(this.showBack);
        this.hitCards[prevH].drawBehind(this.showBack, (-this.shift));

        this.styleCards[this.selectedStyleCard].draw(this.showBack);
        this.styleCards[prevS].drawBehind(this.showBack, (-this.shift));
    }
}
