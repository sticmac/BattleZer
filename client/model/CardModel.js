module.exports = class CardModel {
    constructor(data) {
        this.title = data.title;
        this.type = data.type;
        this.priority = data.priority;
        this.power = data.power;
        this.range = data.range;
        this.effect = data.effect;
    }
}