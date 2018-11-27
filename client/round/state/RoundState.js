module.exports = class RoundState {
    constructor(context) {
        this.context = context;
    }

    run(game, playerData) {
        throw new Error("Not implemented state");
    }

    canRun(playerData) {
        throw new Error("Not implemented running condition");
    }

    next() {
        throw new Error("No next state");
    }
}