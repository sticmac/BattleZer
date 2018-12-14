const RoundState = require('./RoundState');
const AfterEffectState = require('./AfterEffectState');

module.exports = class DamageState extends RoundState {

    constructor(context, game, socket) {
        super(context, game, socket);
        this.value = 'damage'
    }

    run(attack) {
        this.sayWhoIAm();
        this.socket.to(attack.id).emit('attack', {
            game: this.game.name,
            attack: {
                action: "basic",
                power: attack.attack.power,
                value: attack.attack.range
            }
        });
    }

    next() {
        this.context.state = new AfterEffectState(this.context, this.game, this.socket);
    }

    canRun(attack) {
        return true;
    }

    sayWhoIAm() {
        console.log('attack state')
    }

}