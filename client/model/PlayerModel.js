module.exports = class PlayerModel {
    constructor(id, initPosition, health) {
        this.id = id;
        this.position = initPosition;
        this.health = health;
        this.maxHealth = health;
    }

    /**
     * Move the player to a certain amount to the left or the right
     * 
     * @param {Number} moveAmount 
     * @param {Boolean} right true if the player moves to the right
     * @returns {Number} the new position of the player
     */
    move(moveAmount, right) {
        this.position += (right ? 1 : -1) * moveAmount;
        return this.position;
    }
}