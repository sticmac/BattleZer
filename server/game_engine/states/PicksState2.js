const GameOverState = require('./GameOverState')
const PicksState = require('./PicksState')
/**
 * 4
 */

module.exports = class PicksState2 {
    constructor(game) {
        this.self = this;
        this.game = game;
        this.value = 'effects';
        console.log('[3] ' + game.name+ ' waiting for picks (v2)');
        game.state = this;
    }

    next(){
        this.game.state = new EffectsState(this.self.game);
    }

};