const EffectsState = require('./EffectsState');

/**
 * 3
 */

module.exports = class PicksState {
    constructor(game) {
        let self = this;
        this.game = game;
        this.value = 'picks';
        game.state = this;
        console.log('[3] ' + game.name + ' waiting for picks');
        this.next = function () {
            return new EffectsState(self.game);
        }
    }
};