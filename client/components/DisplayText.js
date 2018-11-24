module.exports = class DisplayText {
    constructor(text, x, y, scene) {
        this.text = text;
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.container = scene.add.container(0, 0);
    }

    draw() {
        this.container.add(this.scene.add.text(this.x, this.y, this.text,
            {backgroundColor: "#fff", padding: 20, color: "#000", fontFamily: 'Arial', fontSize: 30}).setOrigin(0.5));
        this.container.add(this.scene.add.text(this.scene.game.config.width - this.x, this.y, this.text,
            {backgroundColor: "#fff", padding: 20, color: "#000", fontFamily: 'Arial', fontSize: 30})
            .setOrigin(0.5).setScale(-1.0, -1.0));
    }

    undraw() {
        this.container.removeAll();
    }
}