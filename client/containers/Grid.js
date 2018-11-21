module.exports = class Grid {
    constructor(gridLength, scene) {
        this.gridLength = gridLength;
        this.gridContainer = scene.add.container(0, scene.game.config.height / 2);
        
        const gridCaseWidth = scene.game.config.width / this.gridLength;
        for (let i = 0 ; i < gridLength ; i++) {
            const container = scene.add.container(i * (parseInt(scene.game.config.width / gridLength) + 5), 0);
            const rect = scene.add.rectangle(0, 0,
                    parseInt(gridCaseWidth), parseInt(scene.game.config.height / 3), 0xdddddd)
                .setOrigin(0, 0.5);
            container.add(rect);
            this.gridContainer.add(container);
        }
    }

    addToken(token, position) {
        this.gridContainer.list[position].add(token);
    }
}