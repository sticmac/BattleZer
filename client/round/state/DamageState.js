const RoundState = require('./RoundState');
const AfterEffectState = require('./AfterEffectState');

module.exports = class DamageState extends RoundState {

    constructor(context) {
        super(context);
        this.value = 'damage'
    }

    run(game, id, actions, value) {
        console.log('--> id',id);

        console.log('--> actions',actions);
        actions.codes.forEach(c => {
            this.context.socket.emit('player attack', {
                game: game,
                attack : {
                    player: id,
                    action: c.action,
                    value: value,
                    power : actions.power
                }
            });
        });

    }

    next() {
        this.context.state = new AfterEffectState(this.context);
    }

    canRun(playerData) {
        return true;
    }

    sayWhoIAm() {
        console.log('attack state')
    }

}