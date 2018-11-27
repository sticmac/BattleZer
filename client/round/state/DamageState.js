const RoundState = require('./RoundState');
const AfterEffectState = require('./AfterEffectState');

module.exports = class DamageState extends RoundState {
    constructor(context) {
        super(context);
    }

    run(game, playerData) {
        if (this.canRun(playerData)) {
            this.context.socket.emit('player attack', {
                game: game,
                attack: {
                    player: playerData.id,
                    action: 'basic',
                    power: playerData.attack.power,
                    target: Math.min(
                        playerData.attack.range,
                        this.context.players["player 2"].player.position
                    )
                }
            });
        }
    }

    next() {
        this.context.state = new AfterEffectState(this.context);
    }

    canRun(playerData) {
        return true;
    }
}