const Card = require('./Card');

module.exports = class ShowAttack {
    constructor(x, y, card_width, card_height, reverse, scene) {
        this.scene = scene;
        this.container = scene.add.container(x, y);

        this.card_width = card_width;
        this.card_height = card_height;
        this.reverse = reverse;
    }

    setHitCard(hitCard) {
        this.hitCard = hitCard;
    }

    setStyleCard(styleCard) {
        this.styleCard = styleCard;
    }

    draw() {
        this.container.removeAll();
        const cards = [
            new Card(this.hitCard, -this.card_width * (3/4)+40, 0, this.card_width, this.card_height, this.scene, 'card_back'),
            new Card(this.styleCard, this.card_width * (3/4)-40, 0, this.card_width, this.card_height, this.scene, 'card_back'),
        ];


        cards[0].drawWithAngle(-0.15);
        cards[1].drawWithAngle(0.15);
        this.container.add(cards[0].container);
        this.container.add(cards[1].container);

        /*for (let i = 0 ; i < cards.length ; i++) {
            cards[i].drawWithAngle(0.5);
            this.container.add(cards[i].container);
        }*/



        if (this.reverse) {
            this.container.setScale(-1.0);
        }
        
        this.container.setVisible(true);
    }

    undraw() {
        this.container.setVisible(false);
    }
}