module.exports = class GameOverTransition {

    constructor(scene, x, y, data) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.data = data;
        this.container = scene.add.container(0, 0);
        this.draw();
        console.log("game over", data)

    }

    draw() {

        let text1 = this.scene.add.text(this.x, this.y + 200, this.data.players[0]+' a gagné !',
            {
                padding: 20,
                color: "#000",
                fontFamily: 'Arial',
                fontSize: 45
            }).setOrigin(0.5);

        let text2 = this.scene.add.text(this.x, this.y - 200, this.data.players[0]+' a gagné !',
            {
                padding: 20,
                color: "#000",
                fontFamily: 'Arial',
                fontSize: 45
            }).setOrigin(0.5).setScale(-1);



        this.container.add(text1);
        this.container.add(text2);

        let hitarea = new Phaser.Geom.Circle(this.x, this.y, 600);

        this.container.setInteractive(hitarea, Phaser.Geom.Circle.Contains);
        let self = this;
        /*
        this.container.on("pointerdown", () => {
            self.undraw();
        });
        */


        let bg = this.scene.add.graphics({fillStyle: {color: 0xff0000, alpha: 1}});
        this.container.add(bg);

        bg.fillCircleShape(hitarea);

        bg.lineStyle(2, 0x1c5964, 1);

        bg.strokeCircle(this.x, this.y, this.container.input.hitArea.radius);


        let img = this.scene.add.image(this.x, this.y + 120, 'game_over');
        this.container.add(img);
        let img2 = this.scene.add.image(this.x, this.y - 120, 'game_over').setScale(-1);
        this.container.add(img2);

    }


    undraw() {
        this.container.setVisible(false);
    }

};