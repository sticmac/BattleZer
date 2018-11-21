const Phaser = require('phaser');

module.exports = class StandaloneGameScene extends Phaser.Scene {
    constructor() {
        super("standalone_game");
    }

    /**
     * Returns function to preload resources
     */
    preload() {
        this.load.image('sky', 'http://labs.phaser.io/assets/skies/space3.png');
    }

    /**
     * Returns function to create scene
     */
    create() {
        this.add.image(0,0,'sky').setOrigin(0,0).setScale(3.0, 2.0);

        const gridContainer = this.add.container(0, this.game.config.height / 2);
        
        const gridLength = 9;
        const gridCaseWidth = this.game.config.width / gridLength;
        for (let i = 0 ; i < gridLength ; i++) {
            const container = this.add.container(i * (parseInt(this.game.config.width / gridLength) + 5), 0);
            const rect = this.add.rectangle(0, 0,
                    parseInt(gridCaseWidth), parseInt(this.game.config.height / 3), 0xdddddd)
                .setOrigin(0, 0.5);
            container.add(rect);
            gridContainer.add(container);
        }

        const player = this.add.circle(gridCaseWidth / 2, 0, 30, 0x2222ee);
        gridContainer.list[2].add(player);
        let lastPlayerPosition = 2;

        const socket = io.connect('http://192.168.1.17:8080');
        socket.on('move', function(data) {
            const caseId = parseInt(data.caseId);
            if (caseId != NaN) {
                gridContainer.list[lastPlayerPosition].remove(player);
                gridContainer.list[caseId].add(player);
                lastPlayerPosition = caseId;
            }
        })
    }

    /**
     * Returns function to update scene
     */
    update() {

    }
}