module.exports = class ChoiceGrid2 {

    constructor(gridLength, scene, actions, position, range) {
        this.gridLength = gridLength;
        this.gridContainer = scene.add.container(0, scene.game.config.height / 2);
        this.scene = scene;
        this.position = position;
        this.actions = actions;
        this.range = range;

        this.choice = null;
        this.rectChoice = null;

        this.draw();

        this.scene.events.on('gameover', this.gameoverhandler, this);
    }

    gameoverhandler(){
        console.log('received game over event');
        this.undraw();
    }

    draw() {

        this.gridContainer.removeAll();

        let gridCaseWidth = this.scene.game.config.width / this.gridLength;


        for (let i = 0; i < this.gridLength; i++) {

            let color;
            let valid = false;
            let alpha;
            if (this.position === i) {
                valid = true;
                color = 0x32CD32;
                alpha = 0.2;
            }
            else if (Math.abs(this.position - i) <= this.range) {
                valid = true;
                color = 0xFFA500;
                alpha = 0.2;
            }
            else {
                color = 0xA9A9A9;
                alpha = 0;
            }


            let container = this.scene.add.container(i * (parseInt(this.scene.game.config.width / this.gridLength) + 5),0.5);

            let rect = this.scene.add.rectangle(0, 0,
                parseInt(gridCaseWidth), parseInt(this.scene.game.config.height / 3), 0xff0000,0)
                .setOrigin(0, 0.5)
                .setStrokeStyle(6,color,1);

            rect.setInteractive();

            rect.on('pointerdown', () => {
                if(valid) {
                    if (this.rectChoice) {
                        this.rectChoice.setStrokeStyle(6,color,1);
                        this.rectChoice.setFillStyle()
                        if (this.choice === this.position) {
                            this.rectChoice.setStrokeStyle(6,0x32CD32,1)
                        } else {
                            this.rectChoice.setStrokeStyle(6,0xFFA500,1)
                        }
                    }
                    this.choice = i;
                    this.rectChoice = this.gridContainer.list[i].list[0];
                    this.rectChoice.setStrokeStyle(6,0xA50000,1);
                    this.rectChoice.setFillStyle(0xff0000,0.3);
                }
            });

            container.add(rect);


            this.gridContainer.add(container);

            container.add(rect);
            this.gridContainer.add(container);

        }

    }

    undraw() {
        this.gridContainer.setVisible(false);
    }
};