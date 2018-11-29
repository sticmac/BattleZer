module.exports = class ChoiceZone {
    constructor(x, y, width, height, scene) {
        this.container = scene.add.container(x, y);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.scene = scene;
        this.readyButton = null;
    }

    draw() {
        this.container.setVisible(true);
        this.readyButton = this.scene.add.image(100, 100,'ready');
        this.readyButton.setInteractive();
        this.container.add(this.readyButton)




    }

    undraw() {
        this.container.setVisible(false)
    }
}