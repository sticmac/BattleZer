module.exports = class CardModel {
    constructor(data) {
        this.title = data.title;
        this.type = data.type;
        this.priority = data.priority;
        this.power = data.power;
        this.range = data.range;
        this.actions = data.actions;
        this.before = data.before;
        this.during = data.during;
        this.after = data.after;
    }
}