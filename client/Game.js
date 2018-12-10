const StandaloneGameScene = require('./scenes/StandaloneGameScene');
const DistributedGameScene = require('./scenes/DistributedGameScene');
const StartScene = require('./scenes/StartScene');
const Phaser = require('phaser');

module.exports = class Game {
    constructor() {
        let height = 1080;
        let width = 1920;
        const config = {
            type: Phaser.AUTO,
            width:width,
            height:height,
            scene: [StartScene, StandaloneGameScene, DistributedGameScene],
            autoResize: true
        };

        this.game = new Phaser.Game(config);
    }
}