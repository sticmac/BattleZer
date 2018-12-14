const RoundState = require('./RoundState');
const DamageState = require('./DamageState');

module.exports = class BeforeEffectState extends RoundState {
    constructor(context, game, socket) {
        super(context, game, socket);
        this.value = 'before';
    }

    run(attack) {
        this.sayWhoIAm();
        this.socket.to(attack.id).emit('before effects', {
            game: this.game.name,
            effects: attack.attack.actions.before
        });
    }

    next() {
        this.context.state = new DamageState(this.context, this.game, this.socket);
    }

    canRun(attack) {
        return attack.attack.actions.before.length > 0;
    }

    sayWhoIAm(){
        console.log('before state')
    }
}