const DistributionState = require('./DistributionState')

/**
 * 1
 */

module.exports = class ConnectionState {
    constructor(game) {
        this.self = this;
        this.game = game;
        this.value = 'connection';
        console.log('[1] ' + game.name + ' waiting for connections');
        game.state = this;
    }

    next(){
        this.game.state = new DistributionState(this.self.game);
    }
};