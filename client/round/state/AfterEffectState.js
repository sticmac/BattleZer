const RoundState = require('./RoundState');

module.exports = class AfterEffectState extends RoundState {
    constructor(context) {
        super(context);
        this.value = 'after';
    }

    run(game, data, initPosition, choice) {
        let action = {};
        action['range'] = data.attack.actions.after[0].value;
        action['codes'] = data.attack.actions.after;
        let status = 'Effet d\'après attaque';

        choice.draw(action, initPosition, status);
        this.context.players[data.id].changeInfoContainer(choice.container);
        choice.readyButton.on('pointerdown', () => {
            if (choice.grid.choice !== null) {
                choice.grid.actions.codes.forEach(c => {
                    this.context.socket.emit('player effect', {
                        game: game,
                        attack: {
                            player: data.id,
                            action: c.action,
                            value: choice.grid.choice
                        }
                    });
                    choice.undraw();
                });
            } else {
                console.log("after choice pas ok");
            }
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