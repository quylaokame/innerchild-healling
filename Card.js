import { CARD_WIDTH, CARD_HEIGHT } from "./Config.js";
export class Card extends PIXI.Container {

	constructor(index, game) {
		super();
		this.index = index;
		this.game = game;
		this.id = null;
		this.isOpened = false;
		this._init();
		this._listenEvent();
		this._initGraphics();
		this._initMask();
		this._initLight();
	}

	_init() {
		this.static = new PIXI.Sprite();
		this.addChild(this.static);
		this.static.width = CARD_WIDTH;
		this.static.height = CARD_HEIGHT;
		this.static.anchor.set(0.5, 0.5);
		this.static.visible = false;

		this.cover = new PIXI.Sprite.from("./img/cover.png");
		this.addChild(this.cover);
		this.cover.width = CARD_WIDTH;
		this.cover.height = CARD_HEIGHT;
		this.cover.anchor.set(0.5, 0.5);
	}

	_listenEvent(){
		this.interactive = true;
		this.on("pointerup", this.onPickCard, this);
	}

	_initGraphics() {
		const graphics = new PIXI.Graphics();
		const strokeWidth = 4;
		graphics.lineStyle(strokeWidth, 0x6d28d9, 1);
		graphics.drawRoundedRect(-CARD_WIDTH / 2 + strokeWidth / 2, -CARD_HEIGHT / 2 + strokeWidth / 2, CARD_WIDTH - strokeWidth, CARD_HEIGHT - strokeWidth, 16);
		graphics.endFill();
		this.addChild(graphics);
	}

	_initMask(){
		const graphics = new PIXI.Graphics();
		graphics.beginFill(0x650A5A, 0.25);
		graphics.drawRoundedRect(-CARD_WIDTH/2, -CARD_HEIGHT/2, CARD_WIDTH, CARD_HEIGHT, 20);
		graphics.endFill();
		this.addChild(graphics);
		this.mask = graphics;
	}

	_initLight() {
		this.light = new PIXI.Container();
		this.addChild(this.light);
		this.light.alpha = 0;

		const sprite = new PIXI.Sprite.from("./img/glow.png");
		this.light.addChild(sprite);
		sprite.anchor.set(0.5, 0.5);
		sprite.scale.set(2.5, 2.5);
	}

	onPickCard(){
		this.game.emit("PICK_CARD", this);
	}

	setCardId(id){
		this.id = id;
		let img = id + ".png";
		const texture = new PIXI.Texture.from("./img/" + img);
		this.static.texture = texture;
	}

	flipOpen(dur = 2){
		let duration = dur/5;
		if (this.id === null || this.isOpened) return;
		this.isOpened = true;
		const timeline = gsap.timeline({ paused: true, repeatRefresh: true });
		const { maxScale } = this.game.contentSize;
		timeline
			.to(this, { duration, x: 0, y: 0 , ease: "sine.inOut"})
			.to(this, { duration })
			.to(this.scale, { duration, x: maxScale - 0.3, y: maxScale - 0.3, ease: "sine.inOut" }, 0)
			.to(this.scale, { duration, x: 0, y: maxScale, ease: "sine.inOut" })
			.call(() => {
				this.cover.visible = false;
				this.static.visible = true;
				const tl = gsap.timeline({ paused: true, repeatRefresh: true });
				tl.to(this.light, { duration: duration * 1.1, alpha: 0.6, ease: "sine.inOut" })
					.to(this.light.scale, { duration: duration * 1.1, x: 1.5, y: 1.5, ease: "sine.inOut" }, 0)
					.to(this.light, { duration: duration * 1.1, alpha: 0, ease: "sine.inOut" })
					.to(this.light.scale, { duration: duration * 1.1, x: 1, y: 1, ease: "sine.inOut" }, duration * 1.5)
					.play();
			})
			.to(this.scale, { duration, x: maxScale + 0.3, y: maxScale + 0.3, ease: "sine.inOut" })
			.to(this.scale, { duration, x: maxScale, y: maxScale , ease: "sine.inOut" })
			.play();

	}

	highlight(){
		if (this.id === null) return;
		const { maxScale } = this.game.contentSize;
		const duration = 0.5;
		const timeline = gsap.timeline({ paused: true, repeatRefresh: true });
		timeline
			.to(this, { duration, x: 0, y: 0 }, 0)
			.to(this.scale, { duration, x: maxScale, y: maxScale }, 0)
			.play();
	}

	reset(){
		this.id = null;
	}

} 
