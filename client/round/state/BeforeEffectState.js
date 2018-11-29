const RoundState = require('./RoundState');
const DamageState = require('./DamageState');

module.exports = class BeforeEffectState extends RoundState {
    constructor(context) {
        super(context);
        this.value = 'before';

    }

    run(game, playerData) {
        if (this.canRun(playerData)) {
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
        this.context.state = new DamageState(this.context);
    }

    canRun(playerData) {
        return playerData.attack.actions.before.length > 0;
    }

    sayWhoIAm(){
        console.log('before state')
    }
}