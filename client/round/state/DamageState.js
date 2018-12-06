const RoundState = require('./RoundState');
const AfterEffectState = require('./AfterEffectState');

module.exports = class DamageState extends RoundState {

    constructor(context) {
        super(context);
        this.value = 'damage'
    }

    run(game, data, initPosition, choice) {
        let action = {};
        action['range'] = data.attack.range;
        action['power'] = data.attack.power;
        let status = 'Attaque';

        choice.draw(action, initPosition, status);
        this.context.players[data.id].changeInfoContainer(choice.container);
        choice.readyButton.on('pointerdown', () => {
            if (choice.grid.choice !== null) {
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
        });

    }

    next() {
        this.context.state = new AfterEffectState(this.context);
    }

    canRun(playerData) {
        return true;
    }

    sayWhoIAm() {
        console.log('attack state')
    }

}