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
            const bg = this.scene.add.graphics({x: - this.width / 2, y: - this.height / 2});
            bg.fillStyle(0xf4ddbb, 1);
            bg.fillRoundedRect(0, 0, this.width-2, this.height-2, 10);
            bg.lineStyle(2, 0x000000, 1);
            bg.strokeRoundedRect(0, 0, this.width-2, this.height-2, 10);
            this.container.add(bg);

            this.container.add(this.createInfoContainer(-this.width/2, 0, false));
            this.container.add(this.createInfoContainer(this.width / 2, 0, true).setScale(-1.0, -1.0));
        } else {
            const image = this.scene.add.image(0, 0, this.back);
            image.setDisplaySize(this.width, this.height);
            this.container.add(image);
        }
    }

    createInfoContainer(x, y, reverse) {
        const infos = this.scene.add.container(x, y);

        const range = this.scene.add.container(this.width, 10);
        range.add(this.scene.add.circle(0, 0, 20, 0x202f72));
        range.add(this.scene.add.text(0, 0, this.cardModel.range, {fontFamily: 'Arial Black', fontSize: 20, color: "#fff"}).setOrigin(0.5));
        infos.add(range);

        const power = this.scene.add.container(this.width, 50);
        power.add(this.scene.add.circle(0, 0, 20, 0x71221b));
        power.add(this.scene.add.text(0, 0, this.cardModel.power, {fontFamily: 'Arial Black', fontSize: 20, color: "#fff"}).setOrigin(0.5));
        infos.add(power);

        const priority = this.scene.add.container(this.width, 90);
        priority.add(this.scene.add.circle(0, 0, 20, 0xc2a73c));
        priority.add(this.scene.add.text(0, 0, this.cardModel.priority, {fontFamily: 'Arial Black', fontSize: 20, color: "#fff"}).setOrigin(0.5));
        infos.add(priority);

        const title = this.scene.add.text(this.width / 2 - 10, this.height / 2 - 15, this.cardModel.title,
            {fontFamily: 'Arial Black', fontSize: 20, color: "#000"}).setOrigin(0.5);
        title.setScale(-1.0, -1.0);
        infos.add(title);

        return infos;
    }
}