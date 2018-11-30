const RoundState = require('./RoundState');

module.exports = class AfterEffectState extends RoundState {
    constructor(context) {
        super(context);
        this.value = 'after';
    }

    run(game, id, actions, value) {
        console.log('--> id',id);

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
        this.context.state = undefined;
    }

    canRun(playerData) {
        return playerData.attack.actions.after.length > 0;
    }

    sayWhoIAm(){
        console.log('after state')
    }
}