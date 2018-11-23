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

        const cardModelsExample = [
            new CardModel({
                "title":"Grosse gifle",
                "type":"Coup",
                "priority":"10",
                "power":"1",
                "range":"2",
                "attack":"",
                "flavor":"\"parle mieux\" - Batman"
            }),
            new CardModel({
                "title":"Grosse gifle",
                "type":"Coup",
                "priority":"10",
                "power":"1",
                "range":"2",
                "attack":"",
                "flavor":"\"parle mieux\" - Batman"
            }),
            new CardModel({
                "title":"Grosse gifle",
                "type":"Coup",
                "priority":"10",
                "power":"1",
                "range":"2",
                "attack":"",
                "flavor":"\"parle mieux\" - Batman"
            })
        ];

        const cardZone = new CardZone(cardModelsExample, [], scene_width / 8, scene_height * (13/16), scene_width / 10, scene_height / 4, this);
        cardZone.draw();

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

            console.log(players);
        });

        socket.on("chat message", (data) => {
            console.error(data);
        })
        
    }

    /**
     * Update scene
     */
    update() {
    }
}