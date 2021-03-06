const GameScene = require('./GameScene');
const Round = require('../round/Round');
const StartRoundTransition = require('../transitions/StartRound');

module.exports = class DistributedGameScene extends GameScene {
    constructor() {
        super("distributed");

    }

    choiceStep(players) {

    }

    create() {
        super.create();

        this.socket.on("update players", (update) => this.cbUpdate(update));

    }

    runRound() {
        // clear game space
        this.playersIds.forEach((id) => {
            this.players[id].showAttack.undraw();
        });
        if (this.round === null) {
            this.round = new Round(this.gameId, this.players, this.socket);
        }

        new StartRoundTransition(
            this,
            this.lastChosenAttacks,
            this.lastPlayedIndex,
            this.scene_width / 2,
            this.scene_height / 2,
            () => {
                this.round.start(this.lastPlayedIndex++, this.lastChosenAttacks);
                this.lastPlayedIndex = 0; // player 0 starts
                this.roundStep = true;
            });
    }

    cbUpdate(update) {
        update.players.forEach(playerUpdate => {
            const player = this.players[playerUpdate.id];
            player.player.health = playerUpdate.health;
            player.player.position = playerUpdate.position;
        });
    }


}