const RoundState = require('./RoundState');
const AfterEffectState = require('./AfterEffectState');

module.exports = class DamageState extends RoundState {

    constructor(context, game, socket) {
        super(context, game, socket);
        this.value = 'damage'
    }

    run(attack) {
        /*let action = {};
        action['range'] = data.attack.range;
        action['power'] = data.attack.power;
        let status = 'Attaque';

        choice.draw(action, initPosition, status);
        choice.readyButton.on('pointerdown', () => {
            if (choice.grid.choice) {
                this.context.socket.emit('player attack', {
                    game: game,
                    attack: {
                        player: data.id,
                        power: action.power,
                        action: "basic",
                        target: choice.grid.choice
                    }
                });
                choice.undraw();
            } else {
                console.log("damage choice pas ok");
            }
        });*/

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