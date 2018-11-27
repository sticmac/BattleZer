const EffectsState = require('./EffectsState');

/**
 * 3
 */

module.exports = class PicksState {
    constructor(game) {
        this.self = this;
        this.game = game;
        this.value = 'picks';
        console.log('[3] ' + game.name+ ' waiting for picks');
        game.state = this;
    }

    next(){
        this.game.state = new EffectsState(this.self.game);
    }
};