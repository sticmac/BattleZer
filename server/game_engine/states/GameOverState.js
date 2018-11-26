
/**
 * 5
 */

module.exports = class GameOverState {
    constructor(game) {
        this.self = this;
        this.game = game;
        this.value = 'game over';
        console.log('[5] ' + game.name + ' is over');
        game.state = this;
    }

    next(){
        this.game.state = null;
    }
};