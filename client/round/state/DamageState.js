const RoundState = require('./RoundState');
const AfterEffectState = require('./AfterEffectState');

module.exports = class DamageState extends RoundState {

    constructor(context) {
        super(context);
        this.value = 'damage'
    }

    run(game, id, actions, value) {
        console.log('--> id',id);
        actions.codes.forEach(c => {
            console.log('--> action',c.action)
            this.context.socket.emit('player effect', {
                game: game,
                player: id,
                action: c.action,
                value: value
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