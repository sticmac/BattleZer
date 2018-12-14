const Phaser = require('phaser');
const PlayerModel = require('../model/PlayerModel');
const Grid = require('../components/Grid');
const Bar = require('../components/Bar');
const Player = require('../components/Player');
const ShowAttack = require('../components/ShowAttack');
const io = require('socket.io-client');
const DeckTransition = require('../transitions/Distribution');
const ReadyTransition = require('../transitions/Ready');
const StartRoundTransition = require('../transitions/StartRound');
const GameOverTransition = require('../transitions/GameOver');

module.exports = class GameScene extends Phaser.Scene {
    constructor(name) {
        super(name + "_game");
        this.type = name;
        this.round = null;
        this.roundStep = false;
    }

    /**
     * Preload resources
     */
    preload() {
        this.load.image('sky', 'http://labs.phaser.io/assets/skies/space3.png');
        this.load.image('bg', 'assets/bg.png');
        this.load.image('style_card', 'assets/style_card_template3.png');
        this.load.image('hit_card', 'assets/hit_card_template3.png');
        this.load.image('card_back', 'assets/card_back.jpg');
        this.load.image('game_over','assets/gameover.png');
        this.load.image('token', 'assets/token.png');
        this.load.image('run_icon','assets/run.png');
        this.load.image('heal_icon','assets/heal.png');
    }

    /**
     * Create scene
     */
    create() {

        this.scene_width = this.game.config.width;
        this.scene_height = this.game.config.height;

        this.add.image(0, 0, 'bg').setOrigin(0, 0).setDisplaySize(this.scene_width, this.scene_height);

        this.grid = new Grid(9, this);

        /**
         * 0 = Private Choice Grid
         * 1 = Public Choice Grid
         **/
        this.mode;

        const colors = [0x2222ee, 0xee2222];
        this.players = {};
        this.playersIds = [];

        this.socket = io();
        this.socket.emit("start game", {players: 2, type: this.type});
        this.socket.on("ready to start", (data) => {
            this.gameId = data.game;
            const sentPlayers = data.players;
            for (let i = 0; i < sentPlayers.length; i++) {
                const element = sentPlayers[i];
                this.playersIds.push(element.id);
                this.players[element.id] = new Player(
                    20 + (element.team) * (this.game.config.width - 50),
                    this.game.config.height * (1/3) + (1 - element.team) * (this.game.config.height * (1/3)),
                    this.game.config.width / 2 - 50,
                    this.game.config.height * (1/3),
                    this,
                    new PlayerModel(element.id, element.position, element.health, element.team),
                    this.add.image(30, 30, 'token').setTint(colors[i]).setScale(0.7),
                    new Bar(400, 15, this.scene_width / 5, 20, this),
                    new ShowAttack(this.scene_width / 2, this.scene_height - ((i * 2 + 1) * this.scene_height / 4),
                        this.scene_width / 10, this.scene_height / 4, i === 1, this)
                );
                this.players[element.id].draw();
                const token = this.add.image(this.scene_width / 18, 0, 'token').setTint(colors[i]);
                if (this.players[element.id].player.team === 1) {
                    this.players[element.id].container.setScale(-1.0, -1.0);
                    token.setScale(-1.0, -1.0);
                }
                this.grid.addToken(element.id, token, element.position);
            }

            //transition to next step
            new ReadyTransition(this,
                this.scene_width / 2,
                this.scene_height / 2,
                () =>
                    new DeckTransition(this,
                        5,
                        this.scene_width / 2,
                        this.scene_height / 2,
                        () => this.socket.emit('send cards', {game: this.gameId}),
                        [
                            this.scene_width / 4,
                            this.scene_height * 7 / 8,
                            this.scene_width * 3 / 4 - 100,
                            this.scene_height / 8
                        ]
                    ));
        });

        this.socket.on("card distribution", (data) => this.choiceStep(data.players));

        this.socket.on("start round", (data) => {

            this.lastChosenAttacks = data.players;

            this.startRoundStep();

            for (let i = 0; i < this.lastChosenAttacks.length; ++i) {
                this.displayAttacksOfPlayer(i);
            }

        });

        this.socket.on("end round", (data) => this.choiceStep(data.players));

        this.socket.on("game over", (data) => {
            this.showGameOver(data);
        });

        this.socket.on("chat message", (data) => {
            console.info(data)
        });
    }

    /**
     * Update scene
     */
    update() {
        //update each players according to their model
        this.playersIds.forEach((id) => {
            let newHP = this.players[id].player.health;
            let oldHP = this.players[id].bar.value;
            let x = oldHP - newHP;
            if (x !== 0) {
                this.grid.showDamage(this.players[id].player.position, x)
            }

            this.players[id].bar.changeValue(this.players[id].player.health);
            this.players[id].bar.draw();

            if (this.players[id].player.position !== this.grid.getTokenPosition(id)) {
                this.grid.moveTokenByKey(id, this.players[id].player.position);
            }
        });

        //update round
        if (this.roundStep && this.round.finished) {
            this.runRound();
        }
    }

    choiceStep(players) {
        throw new Error("Not implemented choice step");
    }

    displayAttacksOfPlayer(i) {
        const id = this.lastChosenAttacks[i].id;

        this.players[id].showAttack.setHitCard(this.lastChosenAttacks[i].hitCard);
        this.players[id].showAttack.setStyleCard(this.lastChosenAttacks[i].styleCard);
    }

    showGameOver(data){
        this.events.emit('gameover');
        new GameOverTransition(
            this,
            this.scene_width / 2,
            this.scene_height / 2,
            data )
    }

    startRoundStep() {

    }
};