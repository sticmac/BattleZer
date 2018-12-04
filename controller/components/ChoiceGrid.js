module.exports = class ChoiceGrid {

    constructor(gridLength, scene, actions, position, range, reverse) {
        this.gridLength = gridLength;
        this.gridContainer = scene.add.container(reverse ? 500 : 0, 20);
        this.scene = scene;
        this.position = position;
        this.actions = actions;
        this.range = range;
        if (reverse) this.gridContainer.setScale(-1.0, -1.0);
        this.choice = null;
        this.rectChoice = null;

        this.draw();


    }

    draw() {
        for (let i = 0; i < this.gridLength; i++) {

            let color;
            let valid = false;
            if (this.position === i) {
                valid = true;
                color = 0x32CD32;
            }
            else if (Math.abs(this.position - i) <= this.range) {
                valid = true;
                color = 0xFFA500;
            }
            else color = 0xA9A9A9;

            const container = this.scene.add.container(i * 55, 0);
            const rect = this.scene.add.rectangle(0, 0, 50, 100, color)
                .setOrigin(0, 0.5);
            rect.setInteractive();
            rect.on('pointerdown', () => {
                if(valid) {
                    if (this.rectChoice) {
                        if (this.choice === this.position) {
                            this.rectChoice.setFillStyle(0x32CD32);
                        } else {
                            this.rectChoice.setFillStyle(0xFFA500);
                        }
                    }
                    this.choice = i;
                    this.rectChoice = this.gridContainer.list[i].list[0];
                    this.rectChoice.setFillStyle(0xA50000)
                }
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