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
        for (let i = 0; i < hitCardsModels.length; i++) {
            this.hitCards.push(new Card(hitCardsModels[i], 180, 0, cardWidth, cardHeight, scene, 'card_back'));
            this.styleCards.push(new Card(styleCardsModels[i], 620, 0, cardWidth, cardHeight, scene, 'card_back'));
        }
        this.showTouch = 0;

        this.shift = cardWidth / 2;
    }

    setupSwipe(){

        let hitarea = new Phaser.Geom.Circle(180,0, 150);
        this.leftSwipeContainer.setInteractive(hitarea, Phaser.Geom.Circle.Contains);

        let hitarea2 = new Phaser.Geom.Circle(620,0, 150);
        this.rightSwipeContainer.setInteractive(hitarea2, Phaser.Geom.Circle.Contains);

        let self = this;
        this.container.add(this.leftSwipeContainer);
        this.container.add(this.rightSwipeContainer);

        this.leftSwipeContainer.on("pointerdown", (e) => {
            let swipeTime = e.upTime - e.downTime;
            let swipe = new Phaser.Geom.Point(e.upX - e.downX, e.upY - e.downY);
            let swipeMagnitude = Phaser.Geom.Point.GetMagnitude(swipe);
            let swipeNormal = new Phaser.Geom.Point(swipe.x / swipeMagnitude, swipe.y / swipeMagnitude);
            if(swipeMagnitude > 20 && swipeTime < 1000 && ( Math.abs(swipeNormal.x) > 0.8)) {
                if(swipeNormal.x > 0.8) {
                    console.log('swipe right');
                    self.showNextHit();
                }
                if(swipeNormal.x < -0.8) {
                    console.log('swipe left');
                    self.showPrevHit();
                }

            }
        });

        this.rightSwipeContainer.on("pointerdown", (e) => {
            let swipeTime = e.upTime - e.downTime;
            let swipe = new Phaser.Geom.Point(e.upX - e.downX, e.upY - e.downY);
            let swipeMagnitude = Phaser.Geom.Point.GetMagnitude(swipe);
            let swipeNormal = new Phaser.Geom.Point(swipe.x / swipeMagnitude, swipe.y / swipeMagnitude);
            if(swipeMagnitude > 20 && swipeTime < 1000 && ( Math.abs(swipeNormal.x) > 0.8)) {
                if(swipeNormal.x > 0.8) {
                    console.log('swipe right');
                    self.showNextStyle();
                }
                if(swipeNormal.x < -0.8) {
                    console.log('swipe left');
                    self.showPrevStyle();
                }

            }
        });

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
    }

    draw() {
        this.container.removeAll();

        this.drawInterface();
        this.drawCards();
        this.setupSwipe();
    }


    drawCards() {
        this.cardsContainer.removeAll();

        let nextH = (this.selectedHitCard + 1) % this.hitCards.length;
        let nextS = (this.selectedStyleCard + 1) % this.styleCards.length;

        let prevH = (this.selectedHitCard - 1 + this.hitCards.length) % this.hitCards.length;
        let prevS = (this.selectedStyleCard - 1 + this.hitCards.length) % this.styleCards.length;


        this.hitCards[this.selectedHitCard].draw();
        this.hitCards[prevH].drawBehind((-this.shift));
        this.hitCards[nextH].drawBehind(this.shift);

        this.cardsContainer.add(this.hitCards[prevH].container.setScale(0.87));
        this.cardsContainer.add(this.hitCards[nextH].container.setScale(0.87));
        this.cardsContainer.add(this.hitCards[this.selectedHitCard].container.setScale(1));


        this.styleCards[this.selectedStyleCard].draw();
        this.styleCards[prevS].drawBehind((-this.shift));
        this.styleCards[nextS].drawBehind(this.shift);

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
        this.readyButton.setBackgroundColor('#327e32');
        this.readyButton.setText('READY !')
    }
};
