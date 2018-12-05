const ShowAttack = require('../components/ShowAttack');

module.exports = class StartRoundTransition {

    constructor(scene, data, currentPlayer, x, y, callback) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.container = scene.add.container(0, 0);
        this.callback = callback;
        this.currentPlayer = currentPlayer;

        this.data = data;
        console.log('DATA', data);
        this.draw();

    }

    draw() {

        let msg = this.currentPlayer === 0 ?this.data[this.currentPlayer].id + ' joue en 1er' : 'Au tour de '+this.data[this.currentPlayer].id;
        let text1 = this.scene.add.text(this.x, this.y + 70, msg,
            {
                backgroundColor: "#1c5964",
                padding: 10,
                color: "#fff",
                fontFamily: 'Arial',
                fontSize: 50
            }).setOrigin(0.5);

        let text2 = this.scene.add.text(this.x, this.y - 70, msg,
            {
                backgroundColor: "#1c5964",
                padding: 10,
                color: "#fff",
                fontFamily: 'Arial',
                fontSize: 50
            }).setOrigin(0.5).setScale(-1);

        let subtext1 = this.scene.add.text(this.x, this.y + 145, 'priorité : ' + this.data[0].attack.priority,
            {
                backgroundColor: "#94343a",
                padding: 10,
                color: "#fff",
                fontFamily: 'Arial',
                fontSize: 50
            }).setOrigin(0.5);

        let subtext2 = this.scene.add.text(this.x, this.y - 145, 'priorité : ' + this.data[0].attack.priority,
            {
                backgroundColor: "#94343a",
                padding: 10,
                color: "#fff",
                fontFamily: 'Arial',
                fontSize: 50
            }).setOrigin(0.5).setScale(-1);

        let hitarea = new Phaser.Geom.Circle(this.x, this.y, 300);

        this.container.setInteractive(hitarea, Phaser.Geom.Circle.Contains);
        let self = this;
        this.container.on("pointerdown", () => {
            self.undraw();
            self.callback();
        });


        let bg = this.scene.add.graphics({fillStyle: {color: 0x33888c, alpha: 0.3}});
        this.container.add(bg);

        bg.fillCircleShape(hitarea);

        bg.lineStyle(2, 0x1c5964, 1);

        bg.strokeCircle(this.x, this.y, this.container.input.hitArea.radius);

        this.container.add(text1);
        this.container.add(text2);
        this.container.add(subtext1);
        this.container.add(subtext2);


        let s = new ShowAttack(this.x, this.y * 5 / 3, 170, 240, false, this.scene);
        s.setHitCard(this.data[this.currentPlayer].hitCard);
        s.setStyleCard(this.data[this.currentPlayer].styleCard);
        s.draw();
        this.container.add(s.container);

        let s2 = new ShowAttack(this.x, this.y * 3 / 10, 170, 240, false, this.scene);
        s2.setHitCard(this.data[this.currentPlayer].hitCard);
        s2.setStyleCard(this.data[this.currentPlayer].styleCard);
        s2.draw();
        this.container.add(s2.container.setScale(-1));

    }


    undraw() {
        this.container.setVisible(false);

    }

};