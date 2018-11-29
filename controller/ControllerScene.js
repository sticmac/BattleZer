const Phaser = require('phaser');
const CardZone = require('./components/CardZone');
const io = require('socket.io-client');

module.exports = class ControllerScene extends Phaser.Scene {
    constructor() {
        super("controller");
    }

    preload() {
        this.load.image('style_card','assets/style_card_template.png');
        this.load.image('hit_card','assets/hit_card_template.png');
        this.load.image('arrow_left','assets/left_arrow.png');
        this.load.image('arrow_right','assets/right_arrow.png');
        this.load.image('ready','assets/ready.png');
    }

    create() {
        this.socket = io();

        this.socket.on("chat message", (data) => {
            console.info(data)
        });

        this.socket.on("card distribution", (data) => {
            this.cardZone = new CardZone(data.player.hitCards, data.player.styleCards, 20, this.game.config.height / 2,
                this.game.config.width / 10, this.game.config.height / 4, this);
            this.cardZone.draw();
        });

        this.socket.emit('join game', {game: window.gameId});
    }
}