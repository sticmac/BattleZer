const GameScene = require('./GameScene');
const CardZone = require('../components/CardZone');
const Round = require('../round/Round');
const ChoiceZone = require('../components/ChoiceZone');
const io = require('socket.io-client');

module.exports = class StandaloneGameScene extends GameScene {
    constructor() {
        super("standalone");
    }

    /**
     * Preload resources
     */
    preload() {
        super.preload();
        this.load.image('arrow_left_hit', 'assets/hit_left.png');
        this.load.image('arrow_right_hit', 'assets/hit_right.png');
        this.load.image('arrow_left_style', 'assets/style_left.png');
        this.load.image('arrow_right_style', 'assets/style_right.png');
        this.load.image('ready', 'assets/ready.png');
    }

    choiceStep(players) {
        this.game.input.addPointer(10);

        this.cardZones = [];
        this.cardZones.push(new CardZone(players[0].hitCards, players[0].styleCards, 0, 160,
            164, 230, this));
        this.cardZones[0].flip();
        this.cardZones[0].draw();
        this.players[this.playersIds[0]].changeInteractContainer(this.cardZones[0].container);

        this.cardZones.push(new CardZone(players[1].hitCards, players[1].styleCards, 0, 160,
            164, 230, this));
        this.cardZones[1].flip();
        this.cardZones[1].draw();
        this.players[this.playersIds[1]].changeInteractContainer(this.cardZones[1].container);

        let counter = 0;

        for (let i = 0; i < this.cardZones.length; ++i) {



            this.cardZones[i].readyButton.on('pointerdown', () => {

                this.cardZones[i].ready();

                counter++;

                if (counter === this.cardZones.length) {
                    const toSendPlayers = [];
                    for (let i = 0; i < this.cardZones.length; ++i) {
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

                //this.cardZones[i].readyButton.setVisible(false);
            });
        }
    }

    displayAttacksOfPlayer(i) {
        super.displayAttacksOfPlayer(i);

        // set choice section invisible, now that choice is made
        this.cardZones[i].container.setVisible(false);
    }

    runRound() {
        this.round.reset();
        console.log(this.lastPlayedIndex);
        if (this.lastPlayedIndex < this.playersIds.length) { // not last round
            setTimeout(() => {
                if (this.lastPlayedIndex + 1 <= this.playersIds.length) { // if not present, too much rounds are launched
                    console.log("next round " + this.lastPlayedIndex);
                    this.round.start(this.lastPlayedIndex++, this.lastChosenAttacks);
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

    startRoundStep() {
        if (!this.round)
            this.round = new Round(this.gameId, this.players, this.socket, this.choiceZones);
        this.lastPlayedIndex = 0;

        this.choiceZones = [];

        this.choiceZones.push(new ChoiceZone(150, 100,
            this.scene_width / 10, this.scene_height / 4, this, false));

        this.choiceZones.push(new ChoiceZone(150, 100,
            this.scene_width / 10, this.scene_height / 4, this, true));

        let i = 0;
        this.playersIds.forEach((id) => {
            this.players[id].showAttack.undraw();
            this.players[id].choiceZone = this.choiceZones[i++];
        });
        this.roundStep = true;

        this.runRound();
    }
};