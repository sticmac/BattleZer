const BeforeEffectState = require('./state/BeforeEffectState');

module.exports = class Round {
    constructor(game, data, players, socket) {
        this.game = game;
        this.data = data;
        this.players = players;
        this.socket = socket;
        this.finished = false;
        this.socket.on("update players", (update) => {
            update.players.forEach(playerUpdate => {
                const player = this.players[playerUpdate.id];
                player.player.health = playerUpdate.health;
                player.player.position = playerUpdate.position;
            });
            this.state.next();
            this.runNextState();
        });
    }

    start(i) {
        console.log(this.data);
        this.currentIndex = i;

        this.state = new BeforeEffectState(this);
        this.runNextState();
    }

    runNextState() {
        while (this.state !== undefined && !this.state.canRun(this.data[this.currentIndex])) {
            this.state.next();
        }
        if (this.state !== undefined) {
            this.state.run(this.game, this.data[this.currentIndex]);
        } else {
            this.finished = true;
        }
    }
}