module.exports = class Scene {

    constructor(context) {
        this.context = context;
    }

    /**
     * Preload resources
     * /!\ Abstract method
     */
    preload() {
        throw new Error("Not implemented method: preload");
    }

    /**
     * Creates scene
     * /!\ Abstract method
     */
    create() {
        throw new Error("Not implemented method: create");
    }

    /**
     * Updates scene
     * /!\ Abstract method
     */
    update() {
        throw new Error("Not implemented method: update");
    }
}