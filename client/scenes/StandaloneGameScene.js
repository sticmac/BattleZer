const Phaser = require('phaser');
const PlayerModel = require('../model/PlayerModel');
const Grid = require('../components/Grid');
const Bar = require('../components/Bar');
const CardZone = require('../components/CardZone');
const ShowAttack = require('../components/ShowAttack');

module.exports = class StandaloneGameScene extends Phaser.Scene {
    constructor() {
        super("standalone_game");
    }

    /**
     * Preload resources
     */
    preload() {
        this.load.image('sky', 'http://labs.phaser.io/assets/skies/space3.png');
        this.load.image('card_back', 'assets/card_back.jpg');

    }

    /**
     * Create scene
     */
    create() {

        const scene_width = this.game.config.width;
        const scene_height = this.game.config.height;

        this.add.image(0,0,'sky').setOrigin(0,0).setDisplaySize(scene_width, scene_height);

        const grid = new Grid(9, this);

        const colors = [0x2222ee, 0xee2222];
        let players = {};

        const socket = io();
        socket.emit("start game", {players: 2, type: "standalone"});
        socket.on("ready to start", (data) => {
            this.game = data.game;
            const sentPlayers = data.players;
            for (let i = 0 ; i < sentPlayers.length ; i++) {
                const element = sentPlayers[i];
                players[element.id] = {player: new PlayerModel(element.id, element.position, element.health),
                    token: this.add.circle((scene_width / 9) / 2, 0, 30, colors[i]),
                    bar: new Bar(scene_width / 2 - scene_width / 10, (i * (scene_height - 25)), scene_width / 5, 20, this),
                    showAttack: new ShowAttack(scene_width / 2, scene_height - ( (i * 2 + 1) * scene_height / 4 ), scene_width / 10, scene_height / 4, this)};
                grid.addToken("player" + i, players[element.id].token, element.position);
            }
            socket.emit('send cards', {game: this.game});
        });

        socket.on("card distribution", (data) => {
            const players = data.players;

            this.cardZones = [];
            this.cardZones.push(new CardZone(players[0].hitCards, players[0].styleCards, scene_width / 8, scene_height * (14/16),
                scene_width / 10, scene_height / 4, this));
            this.cardZones[0].flip();
            this.cardZones[0].draw();

            this.cardZones.push(new CardZone(players[1].hitCards, players[1].styleCards, scene_width * (7/8), scene_height * (2/16),
                scene_width / 10, scene_height / 4, this));
            this.cardZones[1].flip();
            this.cardZones[1].draw();
            this.cardZones[1].container.setScale(-1.0, -1.0);

            let counter = 0;

            for (let i = 0 ; i < this.cardZones.length ; ++i) {
                this.cardZones[i].readyButton.on('pointerdown', () => {
                    console.log('player ' + (i + 1) + ' picked : ');
                    console.log(this.cardZones[i].hitCards[this.cardZones[i].selectedStyleCard].cardModel.title)
                    console.log(this.cardZones[i].styleCards[this.cardZones[i].selectedHitCard].cardModel.title)
                    
                    counter++;

                    if (counter == this.cardZones.length) {
                        const toSendPlayers = [];
                        for (let i = 0 ; i < this.cardZones.length ; ++i) {
                            toSendPlayers.push({
                                id: players[i].id,
                                stylePick: this.cardZones[i].styleCards[this.cardZones[i].selectedStyleCard].cardModel,
                                hitPick: this.cardZones[i].hitCards[this.cardZones[i].selectedHitCard].cardModel
                            })
                        }
                        socket.emit("players picks", {
                            game: this.game,
                            players: toSendPlayers
                        })
                    }
                });
            }
        });

        socket.on("start round", (data) => {
            const dataPlayers = data.players;
            console.log(dataPlayers);
            for (let i = 0 ; i < dataPlayers.length ; ++i) {
                // set choice section invisible, now that choice is made
                this.cardZones[i].container.setVisible(false);

                const id = dataPlayers[i].id;

                //and show attack of related player
                players[id].showAttack.setHitCard(dataPlayers[i].hitCard);
                players[id].showAttack.setStyleCard(dataPlayers[i].styleCard);
                players[id].showAttack.draw();
            }

            // Shows who plays first
            this.add.text(scene_width * (1/3), scene_height / 2, dataPlayers[0].id + " joue en premier.",
                {backgroundColor: "#fff", padding: 20, color: "#000", fontFamily: 'Arial', fontSize: 30}).setOrigin(0.5);
            this.add.text(scene_width * (2/3), scene_height / 2, dataPlayers[0].id + " joue en premier.",
                {backgroundColor: "#fff", padding: 20, color: "#000", fontFamily: 'Arial', fontSize: 30})
                .setOrigin(0.5).setScale(-1.0, -1.0);
        });

        socket.on("chat message", (data) => {
            console.info(data)
        });
    }

    /**
     * Update scene
     */
    update() {
    }
};