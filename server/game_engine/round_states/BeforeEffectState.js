const RoundState = require('./RoundState');
const DamageState = require('./DamageState');

module.exports = class BeforeEffectState extends RoundState {
    constructor(context, game, socket) {
        super(context, game, socket);
        this.value = 'before';
    }

    run(attack) {
        /*let action = {};
        action['range'] = data.attack.actions.before[0].value;
        action['codes'] = data.attack.actions.before;
        let status = 'Effet d\'avant attaque';

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
                console.log("before choice pas ok");
            }
        });*/

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