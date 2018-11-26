module.exports = class Round {
    constructor(game, data, players, socket) {
        this.game = game;
        this.data = data;
        this.players = players;
        this.socket = socket;
        this.socket.on("update players", (update) => {
            update.players.forEach(playerUpdate => {
                const player = this.players[playerUpdate.id];
                player.player.health = playerUpdate.health;
                player.player.position = playerUpdate.position;
            });
        });
    }

    start() {
        console.log(this.data);
        if (this.data[0].attack.actions.before.length > 0) {
            this.socket.emit('player effect', {
                game: this.game,
                player: this.data[0].id,
                action: this.data[0].attack.actions.before[0].action,
                value: this.data[0].attack.actions.before[0].value
            })
        }
    }
}