module.exports = class RoundState {
    constructor(context, game, socket) {
        this.context = context;
        this.game = game;
        this.socket = socket;
        this.value = null;
    }

    run(attack, socket) {
        throw new Error("Not implemented state");
    }

    canRun(attack) {
        throw new Error("Not implemented running condition");
    }

    next() {
        throw new Error("No next state");
    }

    sayWhoIAm() {
        throw new Error("I am nobody...");
    }
}