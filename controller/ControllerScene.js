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
            this.playerId = data.player.id;
            this.choiceAttack(data.player);
        });

        this.socket.on("start round", (data) => console.log(data));

        this.socket.on("end round", (data) => this.choiceStep(data));

        this.socket.emit('join game', {game: window.gameId});
    }

    choiceAttack(player) {
        this.cardZone = new CardZone(player.hitCards, player.styleCards, 20, 200, this.game.config.width / 1920, this);
        this.cardZone.draw();
        this.cardZone.readyButton.on('pointerdown', () => {
            console.log('player ' + this.playerId + ' picked : ');
            console.log(this.cardZone.hitCards[this.cardZone.selectedStyleCard].cardModel.title);
            console.log(this.cardZone.styleCards[this.cardZone.selectedHitCard].cardModel.title);

            this.socket.emit("player pick", {
                game: window.gameId,
                player: {
                    id: this.playerId,
                    stylePick: this.cardZone.styleCards[this.cardZone.selectedStyleCard].cardModel,
                    hitPick: this.cardZone.hitCards[this.cardZone.selectedStyleCard].cardModel
                }
            });

            this.cardZone.container.setVisible(false);
        });
    }
}