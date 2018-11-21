//const SceneManager = require('./SceneManager');
const StandaloneGameScene = require('./scenes/StandaloneGameScene');
const StartScene = require('./scenes/StartScene');
const Phaser = require('phaser');

module.exports = class Game {
    constructor() {
        const config = {
            type: Phaser.AUTO,
            width: window.innerWidth,
            height: window.innerHeight,
            scene: [StartScene, StandaloneGameScene]
        };

        this.game = new Phaser.Game(config);
    }
}