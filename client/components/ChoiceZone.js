module.exports = class ChoiceZone {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw() {
        // draw things
    }

    undraw() {
        // undraw things, probably by making them .setVisible(false)
    }
}