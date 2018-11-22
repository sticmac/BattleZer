module.exports = class Card {
    constructor(model, x, y, width, height, scene, back) {
        this.cardModel = model;

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.scene = scene;

        this.back = back;
        this.shown = false;
        this.container = scene.add.container(x,y);
    }

    flip() {
        this.shown = !this.shown;
    }

    draw() {
        this.container.removeAll();
        if (this.shown) {
            console.log("Show!");
        } else {
            const image = this.scene.add.image(0, 0, this.back);
            image.setDisplaySize(this.width, this.height);
            this.container.add(image);
        }
    }
}