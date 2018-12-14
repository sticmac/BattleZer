const Phaser = require('phaser');

module.exports = class StartScene extends Phaser.Scene {

    constructor() {
        super("start");
    }

    /**
     * Returns function to preload resources
     */
    preload() {
        this.load.image('sky', 'http://labs.phaser.io/assets/skies/space3.png');
    }

    /**
     * Returns function to create scene
     */
    create() {
        this.mode = 1;
        this.add.image(0, 0, 'sky').setOrigin(0, 0).setScale(3.0, 2.0);


        this.add.text(this.game.config.width - 250, this.game.config.height-50, "Mode de choix de cible : ", {
            fontFamily: 'Arial',
            fontSize: 38,
            color: '#c7c7c7'
        }).setOrigin(1);

        let publicB = this.add.text(this.game.config.width-150,this.game.config.height-50, "Public", {
            fontFamily: 'Arial',
            fontSize: 38,
            color: '#c7c7c7'
        }).setOrigin(1);

        this.add.text(this.game.config.width-120,this.game.config.height-55, " | ", {
            fontFamily: 'Arial',
            fontSize: 38,
            color: '#c7c7c7'
        }).setOrigin(1);

        let privateB = this.add.text(this.game.config.width-30,this.game.config.height-50, "Privé", {
            fontFamily: 'Arial',
            fontSize: 38,
            color: '#585858'
        }).setOrigin(1);

        privateB.setInteractive();
        publicB.setInteractive();

        privateB.on('pointerdown',()=>{
            privateB.setColor('#c7c7c7');
            publicB.setColor('#585858');
            this.mode = 0;
        })

        publicB.on('pointerdown',()=>{
            publicB.setColor('#c7c7c7');
            privateB.setColor('#585858');
            this.mode = 1;
        })

        this.addButton(this.game.config.width / 4, this.game.config.height / 2, this.game.config.width / 4, this.game.config.height / 4, "Standalone",
            () => this.scene.start('standalone_game', {mode: this.mode}));

        this.addButton(this.game.config.width * (3 / 4), this.game.config.height / 2, this.game.config.width / 4, this.game.config.height / 4, "Distributed",
            () => this.scene.start('distributed_game'));

    }

    /**
     * Returns function to update scene
     */
    update() {
    }

    addButton(x, y, width, height, textButton, callback) {
        const container = this.add.container(x, y);
        const bg = this.add.rectangle(0, 0, width, height, 0xdadada);
        const text = this.add.text(0, 0, textButton,
            {fontFamily: 'Arial', fontSize: 64, color: '#000'}).setOrigin(0.5);
        container.add(bg);
        container.add(text);
        container.setInteractive(new Phaser.Geom.Circle(0, 0, 100), Phaser.Geom.Circle.Contains)
            .on("pointerover", () => {
                bg.setFillStyle(bg.fillColor, 0.5);
            })
            .on("pointerout", () => {
                bg.setFillStyle(bg.fillColor, 1.0);
            })
            .on("pointerdown", () => callback());
    }
}