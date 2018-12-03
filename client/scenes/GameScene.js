const Phaser = require('phaser');
const PlayerModel = require('../model/PlayerModel');
const Grid = require('../components/Grid');
const Bar = require('../components/Bar');
const CardZone = require('../components/CardZone');
const ShowAttack = require('../components/ShowAttack');
const DisplayText = require('../components/DisplayText');
const Round = require('../round/Round');
const io = require('socket.io-client');
const DeckTransition = require('../transitions/Distribution');
const ReadyTransition = require('../transitions/Ready');
const StartRoundTransition = require('../transitions/StartRound');

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
        this.load.image('style_card', 'assets/style_card_template.png');
        this.load.image('hit_card', 'assets/hit_card_template.png');
    }

    /**
     * Create scene
     */
    create() {

        this.scene_width = this.game.config.width;
        this.scene_height = this.game.config.height;

        this.add.image(0, 0, 'bg').setOrigin(0, 0).setDisplaySize(this.scene_width, this.scene_height);

        this.grid = new Grid(9, this);

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
                this.players[element.id] = {
                    player: new PlayerModel(element.id, element.position, element.health),
                    token: this.add.circle((this.scene_width / 9) / 2, 0, 30, colors[i]),
                    bar: new Bar(i * ((4 / 5) * this.scene_width - 5), ((1 - i) * (this.scene_height - 25)), this.scene_width / 5, 20, this),
                    showAttack: new ShowAttack(this.scene_width / 2, this.scene_height - ((i * 2 + 1) * this.scene_height / 4),
                        this.scene_width / 10, this.scene_height / 4, i == 1, this)
                };
                this.grid.addToken(element.id, this.players[element.id].token, element.position);
            }
            this.socket.emit('send cards', {game: this.gameId});
        });

        this.socket.on("card distribution", (data) => {

            new ReadyTransition(this,
                this.scene_width / 2,
                this.scene_height / 2,
                () =>
                    new DeckTransition(this,
                        5,
                        this.scene_width / 2,
                        this.scene_height / 2,
                        () => this.choiceStep(data.players),
                        [
                            this.scene_width / 4,
                            this.scene_height * 7 / 8,
                            this.scene_width * 3 / 4 - 100,
                            this.scene_height / 8
                        ]
                    ));
        });

        this.socket.on("start round", (data) => {

            console.log("dab on haters");

            this.lastChosenAttacks = data.players;

            new StartRoundTransition(
                this,
                data.players,
                this.scene_width / 2,
                this.scene_height / 2,
                () => {
                    this.runRound();
                });

            for (let i = 0; i < this.lastChosenAttacks.length; ++i) {
                this.displayAttacksOfPlayer(i);
            }

        });

        this.socket.on("end round", (data) => this.choiceStep(data.players));

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
            this.players[id].bar.changeValue(this.players[id].player.health);
            this.players[id].bar.draw();

            if (this.players[id].player.position !== this.grid.getTokenPosition(id)) {
                this.grid.moveTokenByKey(id, this.players[id].player.position);
            }
        });

        //update round
        if (this.roundStep && this.round.finished) {
            this.round.reset();
            if (this.lastPlayedIndex !== this.playersIds.length - 1) { // not last round
                setTimeout(() => {
                    if (this.lastPlayedIndex + 1 < this.playersIds.length) { // if not present, too much rounds are launched
                        this.lastPlayedIndex++;
                        console.log("next round " + this.lastPlayedIndex);
                        this.round.start(this.lastPlayedIndex, this.lastChosenAttacks);
                    }
                }, 1000);
            } else { // last round finished
                console.log("send end round after " + this.lastPlayedIndex);
                this.socket.emit('end round', {
                    game: this.gameId
                });
                this.roundStep = false;
            }
        }
    }

    choiceStep(players) {
        throw new Error("Not implemented choice step");
    }

    displayAttacksOfPlayer(i) {
        const id = this.lastChosenAttacks[i].id;

        this.players[id].showAttack.setHitCard(this.lastChosenAttacks[i].hitCard);
        this.players[id].showAttack.setStyleCard(this.lastChosenAttacks[i].styleCard);
        this.players[id].showAttack.draw();
    }


};