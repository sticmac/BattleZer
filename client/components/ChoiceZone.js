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
    }

    draw(data, playerData, state) {
        console.log(playerData)

        let action = {};
        action['power'] = data.attack.power;
        action['range'] = data.attack.range;
        action['codes'] = [];
        switch(state){
            case 'before':
                action['codes'] = data.attack.actions.before;
                break;
            case 'damage':
                action['codes'] = data.attack.actions.during;
                break;
            case 'after':
                action['codes'] = data.attack.actions.after;
                break;
            default:
                action = null;
                break;
        }
        console.log('power',action.power);
        console.log('range',action.range);
        action['codes'].forEach(c => console.log('action : '+c.action));


        this.container.setVisible(true);

        /**
         * todo
         * - afficher une grille avec 9 cases
         * - si dans la portée --> couleur différente
         * - case.OnPointerDown --> couleur active, recuper l'ID de la case, afficher Ready
         * - créer une réponse que le State peut récuperer
         **/

        let position = playerData;
        let grid = new ChoiceGrid(9,this.scene, playerData.player.position, action.range, this.reverseGrid);
        this.container.add(grid.gridContainer);



        this.readyButton = this.scene.add.image(this.width/2, 0,'ready').setScale(0.5,0.5).setOrigin(0.5,0.5);
        this.readyButton.setInteractive();
        this.container.add(this.readyButton)




    }

    undraw() {
        this.container.setVisible(false)
    }
};