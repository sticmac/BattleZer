const RoundState = require('./RoundState');
const AfterEffectState = require('./AfterEffectState');

module.exports = class BeforeEffectState extends RoundState {
    constructor(context) {
        super(context);
    }

    run(game, playerData) {
        if (playerData.attack.actions.before.length > 0) {
            for (let j = 0 ; j < playerData.attack.actions.before.length ; j++) {
                this.context.socket.emit('player effect', {
                    game: game,
                    player: playerData.id,
                    action: playerData.attack.actions.before[j].action,
                    value: playerData.attack.actions.before[j].value
                });
            }
        }
    }

    next() {
        this.context.state = new AfterEffectState(this.context);
    }
}