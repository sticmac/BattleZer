const RoundState = require('./RoundState');
const DamageState = require('./DamageState');

module.exports = class BeforeEffectState extends RoundState {
    constructor(context) {
        super(context);
        this.value = 'before';

    }

    run(game, data, initPosition, choice) {
        let action = {};
        action['range'] = data.attack.actions.before[0].value;
        action['codes'] = data.attack.actions.before;
        let status = 'Effet d\'avant attaque';

        if (action.codes[0].action === "heal") { //Works only with one effect for before state
            this.context.socket.emit('player effect', {
                game: game,
                attack: {
                    player: data.id,
                    action: action.codes[0].action,
                    value: action.codes[0].value
                }
            });
        } else {
            choice.draw(action, initPosition, status);
            this.context.players[data.id].changeInteractContainer(choice.container);
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
                    console.log("before choice pas ok");
                }
            });
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