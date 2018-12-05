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
            const bg = this.scene.add.image(0, 0, this.cardModel.type === 'Coup' ? 'hit_card' : 'style_card');
            bg.displayHeight = this.height;
            bg.displayWidth = this.width;

            this.container.add(bg);
            this.container.add(this.createInfoContainer(this.width / 2, 0, false));

        } else {
            const bg = this.scene.add.image(0, 0, 'card_back');
            bg.displayHeight = this.height;
            bg.displayWidth = this.width;
            this.container.add(bg);
        }


    }

    drawBehind(showBack, shift) {
        this.container.removeAll();


        if (!showBack) {

            const bg = this.scene.add.image(shift, -45,  this.cardModel.type === 'Coup' ? 'hit_card' : 'style_card');
            bg.displayHeight = this.height;
            bg.displayWidth = this.width;
            bg.setTint(0x777777);

            this.container.add(bg);
            this.container.add(this.createInfoContainer((this.width / 2) + shift, -45, true));


        } else {

            const bg = this.scene.add.image(0, 0, 'card_back');
            bg.displayHeight = this.height;
            bg.displayWidth = this.width;
            this.container.add(bg);

        }

    }

    drawWithAngle(angle) {
        this.container.removeAll();
        this.container.rotation = angle;

        if (this.cardModel.type === 'Coup') {
            const bg = this.scene.add.image(0, 0, this.cardModel.type === 'Coup' ? 'hit_card' : 'style_card');
            bg.displayHeight = this.height;
            bg.displayWidth = this.width;

            this.container.add(bg);
            this.container.add(this.createInfoContainer(this.width / 2, 0, false));

        } else {
            const bg = this.scene.add.image(0, 0, this.cardModel.type === 'Coup' ? 'hit_card' : 'style_card');
            bg.displayHeight = this.height;
            bg.displayWidth = this.width;

            this.container.add(bg);
            this.container.add(this.createInfoContainer(-this.width / 2, 0, false));

        }
    }


    createInfoContainer(x, y, isBehind) {

        let color1;
        let color2;
        if(this.cardModel.type === 'Coup'){
            color1 = isBehind ? '#afafaf' : '#fff';
            color2 = isBehind ? '#9e665f' : '#e29288';
        } else {
            color1 = isBehind ? '#afafaf' : '#fff';
            color2 = isBehind ? '#59996a' : '#9ce3b1';
        }



        const infos = this.scene.add.container(x, y);

        const priority = this.scene.add.container(-18, -72);
        priority.add(this.scene.add.text(0, 0, this.cardModel.priority, {
            fontFamily: 'Impact',
            fontSize: 20,
            color: color1
        }).setOrigin(0.5));
        infos.add(priority);

        const power = this.scene.add.container(-18, -35);
        power.add(this.scene.add.text(0, 0, this.cardModel.power, {
            fontFamily: 'Impact',
            fontSize: 20,
            color: color1
        }).setOrigin(0.5));
        infos.add(power);

        const range = this.scene.add.container(-17, 0);
        range.add(this.scene.add.text(0, 0, this.cardModel.range, {
            fontFamily: 'Impact',
            fontSize: 20,
            color: color1
        }).setOrigin(0.5));
        infos.add(range);


        const title = this.scene.add.text(-7, -this.height/2+23, this.cardModel.title,
            {fontFamily: 'Impact', fontSize: 18, color: color2}).setOrigin(1);
        infos.add(title);


        return infos;
    }

};