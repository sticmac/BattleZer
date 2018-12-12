const Phaser = require('phaser');
const SliderCardZone = require('./components/SliderCardZone');
const ListCardZone = require('./components/ListCardZone');
const ChoiceZone = require('./components/ChoiceZone');
const io = require('socket.io-client');

module.exports = class ControllerScene extends Phaser.Scene {
    constructor() {
        super("controller");
    }

    preload() {
        this.load.image('style_card', 'assets/style_card_template3.png');
        this.load.image('hit_card', 'assets/hit_card_template3.png');
        this.load.image('arrow_left_hit', 'assets/hit_left.png');
        this.load.image('arrow_right_hit', 'assets/hit_right.png');
        this.load.image('arrow_left_style', 'assets/style_left.png');
        this.load.image('arrow_right_style', 'assets/style_right.png');
        this.load.image('ready','assets/ready.png');
        this.load.image('token', 'assets/token.png');
    }

    create() {
        this.socket = io();

        const colors = [0x2222ee, 0xee2222];

        this.socket.on("chat message", (data) => {
            console.info(data)
        });

        this.socket.on("ready to start", (data) => {
            this.player = data.player;
            this.drawInterface(this.player);
        });

        this.socket.on("card distribution", (data) => {
            this.playerId = data.player.id;
            this.choiceAttack(data.player);
        });

        this.socket.on("update player", (data) => {
            this.player.health = data.health;
            this.player.position = data.position;
        });

        this.socket.on("start round", (data) => this.startRound(data));

        this.socket.on("before effects", (data) => this.applyEffects(data.effects, "Effet d'avant attaque"));

        this.socket.on("attack", (data) => this.applyAttack(data.attack));

        this.socket.on("after effects", (data) => this.applyEffects(data.effects, "Effet d'après attaque"));

        this.socket.on("end round", (data) => this.choiceAttack(data));

        this.socket.emit('join game', {game: window.gameId});
    }

    choiceAttack(player) {
        this.cardZone = new ListCardZone(player.hitCards, player.styleCards, 20, 200, 164, 230, this);
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
                    hitPick: this.cardZone.hitCards[this.cardZone.selectedHitCard].cardModel
                }
            });

            this.cardZone.container.setVisible(false);
        });
    }

    startRound(data) {
        console.log(data);
    }

    applyEffects(effects, status) {
        console.log("apply effects")
        const choiceZone = new ChoiceZone(20, 200, 1920, 1080, this, this.player.team % 2 != 0);
        choiceZone.draw(effects[0], this.player.position, status);
        choiceZone.readyButton.on("pointerdown", () => {
            if (choiceZone.grid.choice !== null) {
                this.socket.emit('player effect', {
                    game: window.gameId,
                    attack: {
                        player: this.playerId,
                        action: choiceZone.grid.actions.action,
                        value: choiceZone.grid.choice
                    }
                });
                choiceZone.undraw();
            }
        });
    }

    applyAttack(attack) {
        console.log("apply attack")
        const choiceZone = new ChoiceZone(20, 200, 1920, 1080, this, this.player.team % 2 != 0);
        choiceZone.draw(attack, this.player.position, "Attaque");
        choiceZone.readyButton.on("pointerdown", () => {
            if (choiceZone.grid.choice !== null) {
                this.socket.emit('player attack', {
                    game: window.gameId,
                    attack: {
                        player: this.playerId,
                        action: choiceZone.grid.actions.action,
                        power: attack.power,
                        target: choiceZone.grid.choice
                    }
                });
                choiceZone.undraw();
            }
        });
    }

    drawInterface(player) {
        const colors = [0x2222ee, 0xee2222];
        this.add.image(30, 30, 'token').setTint(colors[player.team]).setScale(0.7);

        this.add.text(175, 20, this.player.id.charAt(0).toUpperCase() + this.player.id.slice(1), {
            color: "#fff",
            fontFamily: "Arial Black",
        }).setAlign('center');
    }
}