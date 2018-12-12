const ChoiceGrid = require('./ChoiceGrid');
const ChoiceGrid2 = require('./ChoiceGrid2');

module.exports = class ChoiceZone {
    constructor(x, y, width, height, scene, reverseGrid, mode) {
        this.container = scene.add.container(x, y);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.scene = scene;
        this.readyButton = null;
        this.reverseGrid = reverseGrid;
        this.grid = null;
        this.mode = mode;

    }

    draw(action, initPosition, status) {
        this.container.setVisible(true);

        if(this.mode === 0){
            this.grid = new ChoiceGrid(9, this.scene, action, initPosition, action.range, this.reverseGrid);
            this.container.add(this.grid.gridContainer)

        } else {
            this.grid = new ChoiceGrid2(9, this.scene, action, initPosition, action.range);
        }


        console.log('action',action);
        this.text1 = this.scene.add.text(250, -110, status.toUpperCase(), {
            fontSize: 32,
            fontFamily:'Arial Black',
            fontWeight:'bold',
            color: '#205b31',
            backgroundColor: "#fff",
            padding: 5
        }).setOrigin(0.5);

        this.container.add(this.text1);


        let txt;
        if(action.hasOwnProperty('codes')){

            switch(action.codes[0].action){
                case 'movement':
                    txt = 'Déplacement jusqu\'à '+action.codes[0].value+' cases';
                    break;
                case 'heal':
                    txt = 'Activation du soin';
                    break;
            }
        } else {
            txt = "Puissance : "+action.power+" (jusqu'à "+action.range+' cases)';
        }


        this.text2 = this.scene.add.text(250, -60, txt, {
            fontSize: 32,
            fontFamily:'Arial Black',
            color: '#fff',
            backgroundColor: "#205b31",
            padding: 5
        }).setOrigin(0.5);

        this.container.add(this.text2);


        this.readyButton = this.scene.add.text(250, this.mode === 0 ? 105 : 25, "→ Ready ←", {
            backgroundColor: "#b45f1b",
            padding: 10,
            color: "#fff",
            fontFamily: 'Arial Black',
            fontSize: 35
        }).setOrigin(0.5);
        this.readyButton.setInteractive();
        this.container.add(this.readyButton)


    }

    undraw() {
        this.container.setVisible(false);
        if(this.grid) this.grid.undraw();
        this.text1.destroy();
        this.text2.destroy();
    }
};