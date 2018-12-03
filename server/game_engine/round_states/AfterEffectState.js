const RoundState = require('./RoundState');

module.exports = class AfterEffectState extends RoundState {
    constructor(context, game, socket) {
        super(context, game, socket);
        this.value = 'after';
    }

    run(attack) {
        /*let action = {};
        action['range'] = data.attack.actions.after[0].value;
        action['codes'] = data.attack.actions.after;
        let status = 'Effet d\'après attaque';

        choice.draw(action, initPosition, status);
        choice.readyButton.on('pointerdown', () => {
            if (choice.grid.choice) {
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
        });*/

        this.sayWhoIAm();
        socket.to(attack).emit('after effect', {
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