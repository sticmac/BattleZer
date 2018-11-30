const Phaser = require('phaser');
const ControllerScene = require('./ControllerScene');

module.exports = class Controller {
    constructor(gameId) {

        window.gameId = gameId;

        const height = window.innerHeight;
        const width = window.innerWidth;

        const config = {
            type: Phaser.AUTO,
            width:width,
            height:height,
            scene: ControllerScene,
        };

        this.game = new Phaser.Game(config);
    }

}