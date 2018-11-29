const RoundState = require('./RoundState');
const DamageState = require('./DamageState');

module.exports = class BeforeEffectState extends RoundState {
    constructor(context) {
        super(context);
        this.value = 'before';

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
        this.context.state = new DamageState(this.context);
    }

    canRun(playerData) {
        return playerData.attack.actions.before.length > 0;
    }

    sayWhoIAm(){
        console.log('before state')
    }
}