const ChoiceGrid = require('./ChoiceGrid2');

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
        this.grid = new ChoiceGrid(9, this.scene, action, initPosition, action.range);

        console.log('action',action);
        this.text1 = this.scene.add.text(150, -100, status.toUpperCase(), {
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


        this.text2 = this.scene.add.text(150, -50, txt, {
            fontSize: 32,
            fontFamily:'Arial Black',
            color: '#fff',
            backgroundColor: "#205b31",
            padding: 5
        }).setOrigin(0.5);

        this.container.add(this.text2);


        //this.readyButton = this.scene.add.image(600, 20, 'ready').setScale(0.5, 0.5).setOrigin(0.5, 0.5);
        this.readyButton = this.scene.add.text(150, 25, "👉 Ready 👈", {
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
        this.grid.undraw();
        this.text1.destroy();
        this.text2.destroy();
    }
};