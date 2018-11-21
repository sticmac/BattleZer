const SceneManager = require('./SceneManager.js');
const StandaloneGameScene = require('./scenes/StandaloneGameScene.js');
const Phaser = require('phaser');

module.exports = class Game {
    constructor() {
        this.sceneManager = new SceneManager();
        this.sceneManager.addScene("standalone_game", new StandaloneGameScene());
        this.sceneManager.changeScene("standalone_game");

        const config = {
            type: Phaser.AUTO,
            width: window.innerWidth,
            height: window.innerHeight,
            scene: {
                preload: this.sceneManager.preload(),
                create: this.sceneManager.create(),
                update: this.sceneManager.update()
            }
        };

        this.game = new Phaser.Game(config);
    }
}