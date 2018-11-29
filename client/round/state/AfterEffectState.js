const RoundState = require('./RoundState');

module.exports = class AfterEffectState extends RoundState {
    constructor(context) {
        super(context);
        this.value = 'after';
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
        this.context.state = undefined;
    }

    canRun(playerData) {
        return playerData.attack.actions.after.length > 0;
    }

    sayWhoIAm(){
        console.log('after state')
    }
}