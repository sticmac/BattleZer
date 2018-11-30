const RoundState = require('./RoundState');
const AfterEffectState = require('./AfterEffectState');

module.exports = class DamageState extends RoundState {
    constructor(context) {
        super(context);
    }

    run(game, playerData) {
        // Choose position of the opponent
        let targetId = undefined;
        for (let i = 0 ; i < this.context.attacks.length ; ++i) {
            if (this.context.attacks[i].id !== playerData.id) {
                targetId = this.context.attacks[i].id;
            }
        }

        // play the attack
        if (this.canRun(playerData)) {
            this.context.socket.emit('player attack', {
                game: game,
                attack: {
                    player: playerData.id,
                    action: 'basic',
                    power: playerData.attack.power,
                    target: Math.min(
                        playerData.attack.range,
                        this.context.players[targetId].player.position
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