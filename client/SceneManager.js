const Scene = require('./scenes/Scene.js');

module.exports = class SceneManager {
    /**
     * 
     * @param {Scene[]} scenes 
     */
    constructor(scenes) {
        this.scenes = (scenes === null || scenes === undefined) ? {} : scenes; 
        this.currentScene = undefined;
    }

    /**
     * Add a scene to the SceneManager
     * @param {String} key
     * @param {Scene} scene 
     */
    addScene(key, scene) {
        this.scenes[key] = scene;
    }

    /**
     * Change current scene to the one corresponding to key, if any
     * @param {String} key 
     */
    changeScene(key) {
        if (this.scenes[key] !== undefined) {
            this.currentScene = this.scenes[key];
        } else {
            throw new Error("No scene saved with key " + key);
        }
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