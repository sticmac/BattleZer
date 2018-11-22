const PicksState = require('./PicksState');

/**
 * 2
 */

module.exports = class DistributionState {
    constructor(game) {
        this.self = this;
        this.game = game;
        this.value = 'distribution';
        console.log('[2] ' + game.name + ' waiting for distribution');
        game.state = this;
    }

    next(){
        this.game.state = new PicksState(this.self.game);
    }
};