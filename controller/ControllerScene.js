const Phaser = require('phaser');
const CardZone = require('./components/CardZone');
const ChoiceZone = require('./components/ChoiceZone');
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

        this.socket.on("ready to start", (data) => {
            this.player = data.player;
        });

        this.socket.on("card distribution", (data) => {
            this.playerId = data.player.id;
            this.choiceAttack(data.player);
        });

        this.socket.on("start round", (data) => this.startRound(data));

        this.socket.on("before effects", (data) => this.applyEffects(data.effects));

        this.socket.on("attack", (data) => console.log(data));

        this.socket.on("after effects", (data) => console.log(data));

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

    startRound(data) {
        console.log(data);
    }

    applyEffects(effects) {
        const choiceZone = new ChoiceZone(20, 200, 1920, 1080, this, false);
        choiceZone.draw(effects[0], this.player.position, "Effet d'avant attaque");
        console.log(choiceZone.grid);
        choiceZone.readyButton.on("pointerdown", () => {
            if (choiceZone.grid.choice) {
                this.socket.emit('player effect', {
                    game: window.gameId,
                    attack: {
                        player: this.playerId,
                        action: choiceZone.grid.actions.action,
                        value: choiceZone.grid.choice
                    }
                });
            }
            choiceZone.undraw();
        });
    }
}