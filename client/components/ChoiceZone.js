module.exports = class ChoiceZone {
    constructor(x, y, width, height, scene) {
        this.container = scene.add.container(x, y);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.scene = scene;
    }

    draw() {
        this.container.add(this.scene.add.text(50,50,'salut à tous',{fontSize: 50,
            color: "#ff0000"}))
    }

    undraw() {
        // undraw things, probably by making them .setVisible(false)
    }
}