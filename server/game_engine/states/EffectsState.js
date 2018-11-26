const GameOverState = require('./GameOverState')
/**
 * 4
 */

module.exports = class EffectsState {
    constructor(game) {
        this.self = this;
        this.game = game;
        this.value = 'effects';
        console.log('[4] ' + game.name+ ' waiting for effects and attacks');
        game.state = this;
    }

    next(){
        this.game.state = new GameOverState(this.self.game);
    }

};