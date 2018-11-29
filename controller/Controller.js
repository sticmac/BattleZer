const Phaser = require('phaser');
const io = require('socket.io-client');

module.exports = class Controller {
    constructor(gameId) {
        this.socket = io();

        this.socket.on("chat message", (data) => {
            console.info(data)
        });

        this.socket.emit('join game', {game: gameId});

        const height = window.innerHeight * window.devicePixelRatio;
        const width = height*16/10;
        const config = {
            type: Phaser.AUTO,
            width:width,
            height:height,
            scene: {
                preload: this.preload,
                create: this.create
            },
            autoResize: true
        };

        this.game = new Phaser.Game(config);
    }

    preload() {
        this.load.image('style_card','assets/style_card_template.png');
        this.load.image('hit_card','assets/hit_card_template.png');
        this.load.image('arrow_left','assets/left_arrow.png');
        this.load.image('arrow_right','assets/right_arrow.png');
        this.load.image('ready','assets/ready.png');
    }

    create() {
        console.log("create");
    }
}