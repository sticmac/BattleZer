module.exports = class Bar {
    constructor(x, y, width, max, scene) {
        this.maxValue = max;
        this.value = max;
        this.width = width;
        this.x = x;
        this.y = y;

        this.bar = scene.add.graphics();
        this.draw();
    }

    changeValue(value) {
        this.value = value;
        this.draw();
    }

    draw() {
        this.bar.clear();

        // BG
        this.bar.fillStyle(0x000000, 1);
        this.bar.fillRect(this.x, this.y, this.width + 4, 20);

        // Health
        this.bar.fillStyle(0xffffff, 1);
        this.bar.fillRect(this.x + 2, this.y + 2, this.width, 16);

        this.bar.fillStyle(0xff2222, 1);
        const d = Math.floor((this.width / this.maxValue) * this.value);
        this.bar.fillRect(this.x + 2, this.y + 2, d, 16);
    }
}