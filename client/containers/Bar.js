module.exports = class Bar {
    constructor(x, y, width, max, scene) {
        this.maxValue = max;
        this.width = width;
        this.x = x;
        this.y = y;

        this.bar = scene.add.graphics();
        this.bar.clear();
        this.bar.fillStyle(0xff2222, 1);
        this.bar.fillRect(x, y, width, 20);
    }

    changeValue(value) {
        this.bar.clear();
        this.bar.fillStyle(0xff2222, 1);
        this.bar.fillRect(this.x, this.y, (this.width * value) / this.maxValue, 20);
    }
}