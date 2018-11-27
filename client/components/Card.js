module.exports = class Card {
    constructor(model, x, y, width, height, scene, back) {
        this.cardModel = model;

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.scene = scene;

        this.back = back;
        this.container = scene.add.container(x, y);
    }


    draw(showBack) {
        this.container.removeAll();

        if (!showBack) {
            console.log(this.cardModel.type)

            if(this.cardModel.type === 'Coup'){
                const bg = this.scene.add.image(0, 0, this.cardModel.type === 'Coup' ? 'hit_card' : 'style_card');
                bg.displayHeight = this.height;
                bg.displayWidth = this.width;

                this.container.add(bg);
                this.container.add(this.createHitInfoContainer(-this.width / 2, 0,this.cardModel.type).setScale(-1.0, -1.0));
                this.container.add(this.createHitInfoContainer(this.width / 2, 0,this.cardModel.type));

            } else {
                const bg = this.scene.add.image(0, 0, this.cardModel.type === 'Coup' ? 'hit_card' : 'style_card');
                bg.displayHeight = this.height;
                bg.displayWidth = this.width;

                this.container.add(bg);
                this.container.add(this.createStyleInfoContainer(this.width / 2, 0,this.cardModel.type).setScale(-1.0, -1.0));
                this.container.add(this.createStyleInfoContainer(-this.width / 2, 0,this.cardModel.type));

            }

        } else {

            const bg = this.scene.add.image(0, 0, 'card_back');
            bg.displayHeight = this.height;
            bg.displayWidth = this.width;
            this.container.add(bg);

        }

    }

    drawBehind(showBack) {
        this.container.removeAll();

        if (!showBack) {
            console.log(this.cardModel.type)

            if(this.cardModel.type === 'Coup'){
                const bg = this.scene.add.image(-30, -30, this.cardModel.type === 'Coup' ? 'hit_card' : 'style_card');
                bg.displayHeight = this.height;
                bg.displayWidth = this.width;

                this.container.add(bg);
                this.container.add(this.createHitInfoContainer(-this.width / 2, 0,this.cardModel.type).setScale(-1.0, -1.0));
                this.container.add(this.createHitInfoContainer(this.width / 2, 0,this.cardModel.type));

            } else {
                const bg = this.scene.add.image(0, 0, this.cardModel.type === 'Coup' ? 'hit_card' : 'style_card');
                bg.displayHeight = this.height;
                bg.displayWidth = this.width;

                this.container.add(bg);
                this.container.add(this.createStyleInfoContainer(-this.width / 2, 0,this.cardModel.type).setScale(-1.0, -1.0));
                this.container.add(this.createStyleInfoContainer(-this.width / 2, 0,this.cardModel.type));

            }

        } else {

            const bg = this.scene.add.image(0, 0, 'card_back');
            bg.displayHeight = this.height;
            bg.displayWidth = this.width;
            this.container.add(bg);

        }

    }


    createHitInfoContainer(x,y){
        const infos = this.scene.add.container(x, y);

        const priority = this.scene.add.container(-21, -72);
        priority.add(this.scene.add.text(0, 0, this.cardModel.priority, {
            fontFamily: 'Impact',
            fontSize: 20,
            color: "#fff"
        }).setOrigin(0.5));
        infos.add(priority);

        const power = this.scene.add.container(-21, -35);
        power.add(this.scene.add.text(0, 0, this.cardModel.power, {
            fontFamily: 'Impact',
            fontSize: 20,
            color: "#fff"
        }).setOrigin(0.5));
        infos.add(power);

        const range = this.scene.add.container(-20, 0);
        range.add(this.scene.add.text(0, 0, this.cardModel.range, {
            fontFamily: 'Impact',
            fontSize: 20,
            color: "#fff"
        }).setOrigin(0.5));
        infos.add(range);



        const title = this.scene.add.text(-this.width + 8, this.height / 2-24, this.cardModel.title,
            {fontFamily: 'Impact', fontSize: 18, color: "#e29288"}).setOrigin(1);
        title.setScale(-1.0, -1.0);
        infos.add(title);


        return infos;
    }

    createStyleInfoContainer(x, y) {
        const infos = this.scene.add.container(x, y);

        const priority = this.scene.add.container(22, -72);
        priority.add(this.scene.add.text(0, 0, this.cardModel.priority, {
            fontFamily: 'Impact',
            fontSize: 20,
            color: "#fff"
        }).setOrigin(0.5));
        infos.add(priority);

        const power = this.scene.add.container(22, -35);
        power.add(this.scene.add.text(0, 0, this.cardModel.power, {
            fontFamily: 'Impact',
            fontSize: 20,
            color: "#fff"
        }).setOrigin(0.5));
        infos.add(power);

        const range = this.scene.add.container(21, 0);
        range.add(this.scene.add.text(0, 0, this.cardModel.range, {
            fontFamily: 'Impact',
            fontSize: 20,
            color: "#fff"
        }).setOrigin(0.5));
        infos.add(range);


        const title = this.scene.add.text(this.width - 10, this.height / 2-3, this.cardModel.title,
            {fontFamily: 'Impact', fontSize: 18, color: "#9ce3b1"}).setOrigin(0);
        title.setScale(-1.0, -1.0);
        infos.add(title);

        return infos;
    }
};