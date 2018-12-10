module.exports = class PlayerModel {
    constructor(id, initPosition, health, team) {
        this.id = id;
        this.position = initPosition;
        this.health = health;
        this.maxHealth = health;
        this.team = team;
    }
}