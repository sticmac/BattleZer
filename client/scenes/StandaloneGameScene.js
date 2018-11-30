const GameScene = require('./GameScene');
const PlayerModel = require('../model/PlayerModel');
const Grid = require('../components/Grid');
const Bar = require('../components/Bar');
const CardZone = require('../components/CardZone');
const ShowAttack = require('../components/ShowAttack');
const DisplayText = require('../components/DisplayText');
const Round = require('../round/Round');
const io = require('socket.io-client');

module.exports = class StandaloneGameScene extends GameScene {
    constructor() {
        super("standalone_game");
        this.round = null;
        this.roundStep = false;
    }

    /**
     * Preload resources
     */
    preload() {
        super.preload();
        this.load.image('card_back', 'assets/card_back.jpg');
        this.load.image('style_card','assets/style_card_template.png');
        this.load.image('hit_card','assets/hit_card_template.png');
        this.load.image('arrow_left','assets/left_arrow.png');
        this.load.image('arrow_right','assets/right_arrow.png');
        this.load.image('ready','assets/ready.png');

    }

    choiceStep(players) {
        this.game.input.addPointer(10);

        this.cardZones = [];
        this.cardZones.push(new CardZone(players[0].hitCards, players[0].styleCards, this.scene_width / 8, this.scene_height * (14/16),
            this.scene_width / 10, this.scene_height / 4, this));
        this.cardZones[0].flip();
        this.cardZones[0].draw();

        this.cardZones.push(new CardZone(players[1].hitCards, players[1].styleCards, this.scene_width * (7/8), this.scene_height * (2/16),
            this.scene_width / 10, this.scene_height / 4, this));
        this.cardZones[1].flip();
        this.cardZones[1].draw();
        this.cardZones[1].container.setScale(-1.0, -1.0);

        let counter = 0;

        for (let i = 0 ; i < this.cardZones.length ; ++i) {
            this.cardZones[i].readyButton.on('pointerdown', () => {
                console.log('player ' + (i + 1) + ' picked : ');
                console.log(this.cardZones[i].hitCards[this.cardZones[i].selectedStyleCard].cardModel.title);
                console.log(this.cardZones[i].styleCards[this.cardZones[i].selectedHitCard].cardModel.title);
                
                counter++;

                if (counter == this.cardZones.length) {
                    const toSendPlayers = [];
                    for (let i = 0 ; i < this.cardZones.length ; ++i) {
                        toSendPlayers.push({
                            id: players[i].id,
                            stylePick: this.cardZones[i].styleCards[this.cardZones[i].selectedStyleCard].cardModel,
                            hitPick: this.cardZones[i].hitCards[this.cardZones[i].selectedHitCard].cardModel
                        });
                    }
                    this.socket.emit("players picks", {
                        game: this.gameId,
                        players: toSendPlayers
                    });
                }
                this.cardZones[i].readyButton.setVisible(false);
            });
        }
    }

    displayAttacksOfPlayer(i) {
        super.displayAttacksOfPlayer(i);

        // set choice section invisible, now that choice is made
        this.cardZones[i].container.setVisible(false);
    }

    runRound() {
        // clear game space
        this.playersIds.forEach((id) => {
            this.players[id].showAttack.undraw();
        });
        if (this.round === null) {
            this.round = new Round(this.gameId, this.players, this.socket);
        }
        this.round.start(0, this.lastChosenAttacks);
        this.lastPlayedIndex = 0; // player 0 starts
        this.roundStep = true;
    }
};