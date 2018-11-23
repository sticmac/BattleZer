const Phaser = require('phaser');
const PlayerModel = require('../model/PlayerModel');
const Grid = require('../components/Grid.js');
const Bar = require('../components/Bar.js');
const CardZone = require('../components/CardZone.js');
const CardModel = require('../model/CardModel.js');

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

        const socket = io.connect('http://localhost:8080');
        socket.emit("start game", {players: 2, type: "standalone"});
        socket.on("ready to start", (data) => {
            this.game = data.game;
            const sentPlayers = data.players;
            for (let i = 0 ; i < sentPlayers.length ; i++) {
                const element = sentPlayers[i];
                players[element.id] = {player: new PlayerModel(element.id, element.position, element.health),
                    token: this.add.circle((scene_width / 9) / 2, 0, 30, colors[i]),
                    bar: new Bar(scene_width / 2 - scene_width / 10, (i * (scene_height - 25)), scene_width / 5, 20, this) };
                grid.addToken("player" + i, players[element.id].token, element.position);
            }
            socket.emit('send cards', {game: this.game});
        });

        socket.on("card distribution", (data) => {
            const players = data.players;

            const cardZones = [];
            cardZones.push(new CardZone(players[0].hitCards, players[0].styleCards, scene_width / 8, scene_height * (13/16),
                scene_width / 10, scene_height / 4, this));
            cardZones[0].flip();
            cardZones[0].draw();

            cardZones.push(new CardZone(players[1].hitCards, players[1].styleCards, scene_width * (7/8), scene_height * (3/16),
                scene_width / 10, scene_height / 4, this));
            cardZones[1].flip();
            cardZones[1].draw();
            cardZones[1].cardsContainer.setScale(-1.0, -1.0);

            socket.emit("players picks", {
                game: this.game, 
                players: [
                    {
                        id: players[0].id,
                        stylePick: players[0].styleCards[0],
                        hitPick: players[0].hitCards[0]
                    },
                    {
                        id: players[1].id,
                        stylePick: players[1].styleCards[0],
                        hitPick: players[1].hitCards[0]
                    }
                ]
            });
        });

        socket.on("start round", (data) => {
            data.players.sort((a,b) => {
                return a.rank - b.rank;
            });
            console.log(data);
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
}