module.exports = class Round {
    constructor(data, players, socket) {
        this.data = data;
        this.players = players;
        this.socket = socket;
        this.socket.on("update players", function(update) {
            update.forEach(playerUpdate => {
                const player = this.players[playerUpdate.id];
                player.player.health = playerUpdate.health;
                player.player.position = playerUpdate.position;
            });
        });
    }

    start() {
        this.socket.emit("attack", data[0]);
        
    }
}