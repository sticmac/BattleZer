module.exports = class Player {
    constructor(x, y, scene, player, token, bar, showAttack) {
        this.x = x;
        this.y = y;
        this.scene = scene;
        this.player = player;
        this.token = token;
        this.bar = bar;
        this.showAttack = showAttack;

        this.container = scene.add.container(x, y);
        this.infoContainer = scene.add.container(0, 60);
    }

    draw() {
        const rect = this.scene.add.rectangle(0, 0, 720, 270, 0xffffff).setOrigin(0).setStrokeStyle(0x000000);
        this.container.add(rect);

        this.container.add(this.bar.bar);

        const thumb = this.scene.add.circle(20, 20, this.token.radius / 1.5, this.token.fillColor);
        thumb.setOrigin(0,0);
        this.container.add(thumb);
        
        const name = this.scene.add.text(175, 20, this.player.id.charAt(0).toUpperCase() + this.player.id.slice(1), {
            color: "#000",
            fontFamily: "Arial Black",
        }).setAlign('center')
        .setWordWrapWidth(200)
        .setMaxLines(1);
        this.container.add(name);
        this.container.add(this.infoContainer);
    }

    changeInfoContainer(element) {
        this.infoContainer.removeAll();
        element.setScale((270 - 50) / element.getBounds().height);
        this.infoContainer.add(element);
    }
}