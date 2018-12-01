const ChoiceGrid = require('./ChoiceGrid');

module.exports = class ChoiceZone {
    constructor(x, y, width, height, scene, reverseGrid) {
        this.container = scene.add.container(x, y);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.scene = scene;
        this.readyButton = null;
        this.reverseGrid = reverseGrid;
        this.grid = null;
    }

    draw(action, initPosition, status) {
        this.container.setVisible(true);
        this.grid = new ChoiceGrid(9, this.scene, action, initPosition, action.range, this.reverseGrid);
        this.container.add(this.grid.gridContainer);

        this.text1 = this.scene.add.text(0, -100, 'Choisis la cible pour l\'' + status, {
            fontSize: 28,
            fontFamily:'Arial Black',
            fontWeight:'bold',
            color: '#205b31',
            backgroundColor: "#fff",
            padding: 5
        });

        this.container.add(this.text1);


        this.readyButton = this.scene.add.image(600, 20, 'ready').setScale(0.5, 0.5).setOrigin(0.5, 0.5);
        this.readyButton.setInteractive();
        this.container.add(this.readyButton)


    }

    undraw() {
        this.container.setVisible(false)
        this.text1.destroy();
    }
};