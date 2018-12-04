const BeforeEffectState = require('./round_states/BeforeEffectState');

module.exports = class Round {
    constructor(game, socket) {
        this.game = game;
        this.finished = false;
        this.socket = socket;
    }

    start(attack) {
        this.finished = false;
        this.state = new BeforeEffectState(this, this.game, this.socket);
        this.attack = attack;
        if (this.state.canRun(this.attack)) {
            this.state.run(this.attack, this.socket);
        } else {
            this.runNextState();
        }
    }

    runNextState() {
        this.state.next();
        while (this.state && !this.state.canRun(this.attack)) {
            this.state.next();
        }

        if (this.state) {
            this.state.run(this.attack, this.socket);
        } else {
            this.finished = true;
            this.game.updateRound();
        }
    }
}