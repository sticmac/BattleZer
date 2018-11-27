//const SceneManager = require('./SceneManager');
const StandaloneGameScene = require('./scenes/StandaloneGameScene');
const StartScene = require('./scenes/StartScene');
const Phaser = require('phaser');

module.exports = class Game {
    constructor() {
        let height = window.innerHeight * window.devicePixelRatio;
        let width = height*16/9;
        const config = {
            type: Phaser.AUTO,
            width:width,
            height:height,
            //width: window.innerWidth * window.devicePixelRatio,
            //height: window.innerHeight * window.devicePixelRatio,
            scene: [StartScene, StandaloneGameScene],
            autoResize: true
        };

        this.game = new Phaser.Game(config);
    }
}