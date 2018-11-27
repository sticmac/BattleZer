module.exports = class Grid {
    constructor(gridLength, scene) {
        this.gridLength = gridLength;
        this.gridContainer = scene.add.container(0, scene.game.config.height / 2);
        this.scene = scene;
        
        const gridCaseWidth = scene.game.config.width / this.gridLength;
        for (let i = 0 ; i < gridLength ; i++) {
            const container = scene.add.container(i * (parseInt(scene.game.config.width / gridLength) + 5), 0);
            const rect = scene.add.rectangle(0, 0,
                    parseInt(gridCaseWidth), parseInt(scene.game.config.height / 3), 0xdddddd)
                .setOrigin(0, 0.5);
            container.add(rect);
            this.gridContainer.add(container);
        }
        
        this.tokens = {};
    }

    addToken(key, token, position) {
        this.tokens[key] = {token: token, position: position};
        this._moveToken(token, undefined, position);
    }

    moveTokenByKey(key, position) {
        const tokenObj = this.tokens[key];
        if (tokenObj !== undefined) {
            this._moveToken(tokenObj.token, tokenObj.position, position);
            tokenObj.position = position;
            this.tokens[key] = tokenObj;
        }
    }

    getTokenPosition(key) {
        return this.tokens[key].position;
    }

    _moveToken(token, oldPosition, position) {
        if (oldPosition !== undefined) {
            this.gridContainer.list[oldPosition].remove(token);
        }
        if (this.gridContainer.list[position].list.length > 1 ) { // there is already a token
            token.setY(token.y - this.scene.game.config.height / 12);
            this.gridContainer.list[position].list[1].setY(this.gridContainer.list[position].list[1].y + this.scene.game.config.height / 12);
        }
        this.gridContainer.list[position].add(token);

        //other loners have to be placed normally
        this.gridContainer.list.forEach(element => {
            if (element.list.length === 2) {
                element.list[1].setY(0);
            }
        });
    }
}