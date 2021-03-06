module.exports = class ReadyTransition {

    constructor(scene, x, y, callback) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.container = scene.add.container(0, 0);
        this.callback = callback;
        this.draw();

    }

    draw() {
        let text1 = this.scene.add.text(this.x, this.y + 90, 'Prêt ?',
            {
                backgroundColor: "#fff",
                padding: 20,
                color: "#1c5964",
                fontFamily: 'Arial',
                fontSize: 50
            }).setOrigin(0.5);

        let text2 = this.scene.add.text(this.x, this.y - 90, 'Prêt ?',
            {
                backgroundColor: "#fff",
                padding: 20,
                color: "#1c5964",
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


        let bg = this.scene.add.graphics({ fillStyle: { color: 0x33888c ,alpha: 0.3 }});
        this.container.add(bg);

        bg.fillCircleShape(hitarea);

        bg.lineStyle(2, 0x1c5964, 1);

        bg.strokeCircle(this.x, this.y, this.container.input.hitArea.radius);

        this.container.add(text1);
        this.container.add(text2);

    }


    undraw() {
        this.container.setVisible(false);
    }

};