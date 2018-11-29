const Phaser = require('phaser');
const ControllerScene = require('./ControllerScene');

module.exports = class Controller {
    constructor(gameId) {

        window.gameId = gameId;

        const height = window.innerHeight * window.devicePixelRatio;
        const width = height*16/10;
        const config = {
            type: Phaser.AUTO,
            width:width,
            height:height,
            scene: ControllerScene,
            autoResize: true
        };

        this.game = new Phaser.Game(config);
    }

}