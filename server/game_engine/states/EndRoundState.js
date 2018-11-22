const PicksState = require('./PicksState')


/**
 * 5
 */

module.exports = class EndRoundState {
    constructor(game) {
        this.self = this;
        this.game = game;
        this.value = 'new round';
        console.log('[5] ' + game.name + ' ended round ' + game.currentRound);
        game.state = this;
    }

    next(){
        this.game.state = new PicksState(this.self.game);
    }
};