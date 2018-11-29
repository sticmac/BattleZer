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

    draw(data, playerData, state) {
        let action = {};
        action['power'] = data.attack.power;
        action['range'] = data.attack.range;
        action['codes'] = [];
        let status;
        switch (state) {
            case 'before':
                action['codes'] = data.attack.actions.before;
                status = 'Effet d\'avant attaque';
                break;
            case 'damage':
                action['codes'] = data.attack.actions.during;
                status = 'Attaque';
                break;
            case 'after':
                action['codes'] = data.attack.actions.after;
                status = 'Effet d\'après attaque';
                break;
            default:
                action = null;
                break;
        }
        //console.log('power',action.power);
        //console.log('range',action.range);
        //action['codes'].forEach(c => console.log('action : '+c.action));


        this.container.setVisible(true);
        this.grid = new ChoiceGrid(9, this.scene, action, playerData.player.position, action.range, this.reverseGrid);
        this.container.add(this.grid.gridContainer);

        this.text1 = this.scene.add.text(0, -100, 'Choisis la cible pour l\'' + status, {
            fontSize: 28,
            fontFamily:'Arial Black',
            stroke:'#000000',
            strokeThickness: 1,
            fontWeight:'bold',
            color: '#FF4500'
        });

        this.container.add(this.text1);


        this.readyButton = this.scene.add.image(this.width * 2, 50, 'ready').setScale(0.5, 0.5).setOrigin(0.5, 0.5);
        this.readyButton.setInteractive();
        this.container.add(this.readyButton)


    }

    undraw() {
        this.container.setVisible(false)
        this.text1.destroy();
    }
};