const RoundState = require('./RoundState');

module.exports = class AfterEffectState extends RoundState {
    constructor(context, game, socket) {
        super(context, game, socket);
        this.value = 'after';
    }

    run(attack) {
        this.sayWhoIAm();
        this.socket.to(attack.id).emit('after effects', {
            game: this.game.name,
            effects: attack.attack.actions.after
        });
    }

    next() {
        this.context.state = undefined;
    }

    canRun(attack) {
        return attack.attack.actions.after.length > 0;
    }

    sayWhoIAm(){
        console.log('after state')
    }
}