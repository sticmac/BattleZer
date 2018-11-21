const Phaser = require('phaser');
const Player = require('../model/Player');
const Grid = require('../containers/Grid.js');
const Bar = require('../containers/Bar.js');

module.exports = class StandaloneGameScene extends Phaser.Scene {
    constructor() {
        super("standalone_game");
    }

    /**
     * Preload resources
     */
    preload() {
        this.load.image('sky', 'http://labs.phaser.io/assets/skies/space3.png');
    }

    /**
     * Create scene
     */
    create() {
        this.add.image(0,0,'sky').setOrigin(0,0).setScale(3.0, 2.0);

        const grid = new Grid(9, this);

        const colors = [0x2222ee, 0xee2222];
        let players = {};

        const bar = new Bar(this.game.config.width / 2, this.game.config.height - 25, this.game.config.width / 5, 20, this);

        const socket = io.connect('http://localhost:8080');
        socket.emit("start game", {players: 2, type: "standalone"});
        socket.on("ready to start", (data) => {
            const sentPlayers = data.players;
            for (let i = 0 ; i < sentPlayers.length ; i++) {
                const element = sentPlayers[i];
                players[element.id] = {player: new Player(element.id, element.position, element.health),
                    token: this.add.circle((this.game.config.width / 9) / 2, 0, 30, colors[i]) };
                grid.addToken("player" + i, players[element.id].token, element.position);
            }
        });

    }

    /**
     * Update scene
     */
    update() {
    }
}