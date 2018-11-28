//const SceneManager = require('./SceneManager');
const StandaloneGameScene = require('./scenes/StandaloneGameScene');
const StartScene = require('./scenes/StartScene');
const Phaser = require('phaser');

module.exports = class Game {
    constructor() {
        let height = window.innerHeight * window.devicePixelRatio;
        let width = height*16/10;
        const config = {
            type: Phaser.AUTO,
            width:width,
            height:height,
            scene: [StartScene, StandaloneGameScene],
            autoResize: true
        };

        this.game = new Phaser.Game(config);
    }
}