const RoundState = require('./RoundState');

module.exports = class AfterEffectState extends RoundState {
    constructor(context) {
        super(context);
    }

    run(game, playerData) {
        if (this.canRun(playerData)) {
            for (let j = 0 ; j < playerData.attack.actions.after.length ; j++) {
                this.context.socket.emit('player effect', {
                    game: game,
                    player: playerData.id,
                    action: playerData.attack.actions.after[j].action,
                    value: playerData.attack.actions.after[j].value
                });
            }
        }
    }

    next() {
        this.context.state = undefined;
    }

    canRun(playerData) {
        return playerData.attack.actions.after.length > 0;
    }
}