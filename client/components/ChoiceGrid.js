module.exports = class ChoiceGrid {

    constructor(gridLength, scene, position, range, reverse) {
        this.gridLength = gridLength;
        this.gridContainer = scene.add.container(reverse ? 350 : 0, -100);
        this.scene = scene;
        this.position = position;
        this.range = range;
        console.log('## position : ', position)
        console.log('## range : ', range)
        if (reverse) this.gridContainer.setScale(-1.0, -1.0);

        this.draw();


    }

    draw() {
        for (let i = 0; i < this.gridLength; i++) {

            let color;
            let valid = false;
            if (this.position === i) color = 0xff0000;
            else if (i > this.position && i <= (this.position + this.range)){
                valid = true;
                color = 0x0000ff;
            }
            else if (i < this.position && i >= (this.position - this.range)){
                valid = true;
                color = 0x0000ff;
            }
            else color = 0x676767;

            const container = this.scene.add.container(i * 55, 0);
            const rect = this.scene.add.rectangle(0, 0, 50, 100, color)
                .setOrigin(0, 0.5);
            rect.setInteractive();
            rect.on('pointerdown', () => {
                console.log('case : ',i, valid)
            });
            container.add(rect);
            this.gridContainer.add(container);

        }
    }

    undraw() {
        this.gridContainer.setVisible(false)
    }
};