const Scene = require('./scenes/Scene.js');

module.exports = class SceneManager {
    /**
     * 
     * @param {Scene[]} scenes 
     */
    constructor(scenes) {
        this.scenes = (scenes === null || scenes === undefined) ? [] : scenes; 
        this.currentScene = undefined;
    }

    /**
     * Add a scene to the SceneManager
     * @param {Scene} scene 
     */
    addScene(scene) {
        this.scenes.push(scene);
    }

    /**
     * Change current scene
     * @param {Number} index 
     */
    changeScene(index) {
        this.currentScene = this.scenes[index];
    }

    /**
     * Returns current scene
     * @returns {Scene} the current scene
     */
    getCurrentScene() {
        return this.currentScene;
    }

    preload() {
        return this.currentScene.preload();
    }

    create() {
        return this.currentScene.create();
    }

    update() {
        return this.currentScene.update();
    }
}