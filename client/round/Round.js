const BeforeEffectState = require('./state/BeforeEffectState');

module.exports = class Round {
    constructor(game, players, socket) {
        this.game = game;
        this.players = players;
        this.socket = socket;
        this.finished = false;

        this.socket.on("update players", (update) => this.cbUpdate(update));
    }

    start(i, attacks) {
        this.currentIndex = i;
        this.attacks = attacks;
        console.log(this.attacks);

        this.state = new BeforeEffectState(this);
        this.runNextState();
    }

    runNextState() {
        while (this.state !== undefined && !this.state.canRun(this.attacks[this.currentIndex])) {
            this.state.next();
        }
        if (this.state) {
            this.state.run(this.game, this.attacks[this.currentIndex]);
        } else {
            this.finished = true;
        }
    }

    cbUpdate(update) {
        update.players.forEach(playerUpdate => {
            const player = this.players[playerUpdate.id];
            player.player.health = playerUpdate.health;
            player.player.position = playerUpdate.position;
        });
        this.state.next();
        this.runNextState();
    }

    reset() {
        this.finished = false;
    }
}