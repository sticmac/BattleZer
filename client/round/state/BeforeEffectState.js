const RoundState = require('./RoundState');
const DamageState = require('./DamageState');

module.exports = class BeforeEffectState extends RoundState {
    constructor(context) {
        super(context);
        this.value = 'before';

    }

    run(game, id, actions, value) {
        console.log('--> id',id)

        console.log('--> actions',actions)
        actions.codes.forEach(c => {
            this.context.socket.emit('player effect', {
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
        this.context.state = new DamageState(this.context);
    }

    canRun(playerData) {
        return playerData.attack.actions.before.length > 0;
    }

    sayWhoIAm(){
        console.log('before state')
    }
}