const GameScene = require('./GameScene');
const Round = require('../round/Round');

module.exports = class DistributedGameScene extends GameScene {
    constructor() {
        super("distributed");
    }

    choiceStep(players) {

    }

    runRound() {
        // clear game space
        this.playersIds.forEach((id) => {
            this.players[id].showAttack.undraw();
        });
        if (this.round === null) {
            this.round = new Round(this.gameId, this.players, this.socket);
        }
        this.round.start(0, this.lastChosenAttacks);
        this.lastPlayedIndex = 0; // player 0 starts
        this.roundStep = true;
    }
}