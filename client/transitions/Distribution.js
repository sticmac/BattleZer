module.exports = class DeckTransition {

    constructor(scene, cardsPerHand, deckX, deckY, callback, targets) {
        this.scene = scene;
        this.container = scene.add.container(0, 0);
        this.deckX = deckX;
        this.deckY = deckY;
        this.targets = [];
        this.targets = targets;
        this.count = cardsPerHand;
        this.callback = callback;
        this.draw();


        this.displayCount = 0;
    }

    draw() {
        this.container.add(this.scene.add.text(this.deckX, this.deckY+ 170, 'Distribution des cartes',
            {backgroundColor: "#fff", padding: 20, color: "#f00", fontFamily: 'Arial', fontSize: 50}).setOrigin(0.5));

        this.container.add(this.scene.add.text(this.deckX, this.deckY - 170, 'Distribution des cartes',
            {backgroundColor: "#fff", padding: 20, color: "#f00", fontFamily: 'Arial', fontSize: 50}).setOrigin(0.5).setScale(-1));



        let self = this;
        let delay;

        for (let j = 0; j < this.targets.length / 2; j++) {
            let x = this.targets[j * 2];
            let y = this.targets[j * 2 + 1];
            delay = 1000;

            for (let i = 0; i < this.count; i++) {
                delay += 100;

                let card = this.scene.add.image(this.deckX + i*5 - 100, this.deckY + i*5, 'card_back')
                    .setScale(0.3);
                this.container.add(card);

                this.scene.tweens.add({
                    targets: card,
                    x: x - 100,
                    y: y,
                    ease: 'Power1',
                    duration: 100,
                    delay: delay,
                    onComplete: self.continue,
                    onCompleteParams: [self]
                });

                let card2 = this.scene.add.image(this.deckX + i*5 + 100, this.deckY + i*5, 'card_back')
                    .setScale(0.3);
                this.container.add(card2);

                this.scene.tweens.add({
                    targets: card2,
                    x: x + 100,
                    y: y,
                    ease: 'Power1',
                    duration: 100,
                    delay: delay + ( this.count * 100),
                    onComplete: self.continue,
                    onCompleteParams: [self]
                });
            }
        }


    }


    continue(tween, targets, self) {
        self.displayCount++;

        if (self.displayCount === (self.count * self.targets.length)) {
            self.undraw();
            self.callback();
        }

    }

    undraw() {
        this.container.setVisible(false);
    }

};