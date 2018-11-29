const Phaser = require('phaser');
const PlayerModel = require('../model/PlayerModel');
const Grid = require('../components/Grid');
const Bar = require('../components/Bar');
const CardZone = require('../components/CardZone');
const ShowAttack = require('../components/ShowAttack');
const DisplayText = require('../components/DisplayText');
const Round = require('../round/Round');
const io = require('socket.io-client');

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
        this.load.image('bg','assets/bg.png');
    }

    /**
     * Create scene
     */
    create() {

        this.scene_width = this.game.config.width;
        this.scene_height = this.game.config.height;

        this.add.image(0,0,'bg').setOrigin(0,0).setDisplaySize(this.scene_width, this.scene_height);

        this.grid = new Grid(9, this);

        const colors = [0x2222ee, 0xee2222];
        this.players = {};
        this.playersIds = [];

        this.socket = io();
        this.socket.emit("start game", {players: 2, type: this.type});
        this.socket.on("ready to start", (data) => {
            this.gameId = data.game;
            const sentPlayers = data.players;
            for (let i = 0 ; i < sentPlayers.length ; i++) {
                const element = sentPlayers[i];
                this.playersIds.push(element.id);
                this.players[element.id] = {player: new PlayerModel(element.id, element.position, element.health),
                    token: this.add.circle((this.scene_width / 9) / 2, 0, 30, colors[i]),
                    bar: new Bar(this.scene_width / 2 - this.scene_width / 10, (i * (this.scene_height - 25)), this.scene_width / 5, 20, this),
                    showAttack: new ShowAttack(this.scene_width / 2, this.scene_height - ( (i * 2 + 1) * this.scene_height / 4 ), this.scene_width / 10, this.scene_height / 4, this)};
                this.grid.addToken(element.id, this.players[element.id].token, element.position);
            }
            this.socket.emit('send cards', {game: this.gameId});
        });

        this.socket.on("card distribution", (data) => this.choiceStep(data.players));

        this.socket.on("start round", (data) => {
            this.lastChosenAttacks = data.players;
            for (let i = 0 ; i < this.lastChosenAttacks.length ; ++i) {
                this.displayAttacksOfPlayer(i);
            }

            // Shows who plays first
            const text = new DisplayText(this.lastChosenAttacks[0].id + " joue en premier", this.scene_width * (1/3), this.scene_height * (1/2), this);
            text.draw();

            setTimeout(() => {
                text.undraw();

                this.runRound();
            }, 3000);
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

            if (this.players[id].player.position != this.grid.getTokenPosition(id)) {
                this.grid.moveTokenByKey(id, this.players[id].player.position);
            }
        })

        //update round
        if (this.roundStep && this.round.finished) {
            if (this.lastPlayedIndex != this.playersIds.length - 1) { // not last round
                this.round.reset();
                this.lastPlayedIndex++;
                setTimeout(() => {
                    this.round.start(this.lastPlayedIndex, this.lastChosenAttacks);
                }, 1500);
            } else { // last round finished
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

        //and show attack of related player
        this.players[id].showAttack.setHitCard(this.lastChosenAttacks[i].hitCard);
        this.players[id].showAttack.setStyleCard(this.lastChosenAttacks[i].styleCard);
        this.players[id].showAttack.draw();
    }

    runRound() {

    }
};