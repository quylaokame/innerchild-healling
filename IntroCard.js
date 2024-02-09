import { CARD_WIDTH, CARD_HEIGHT } from "./Config.js";
export class IntroCard extends PIXI.Container {

	constructor(game) {
		super();
		this.game = game;
		this._init();
		this._initGraphics();
		this._initMask();
		this._listenEvent();
	}

	_init() {
		this.cover = new PIXI.Sprite.from("./img/cover.png");
		this.addChild(this.cover);
		this.cover.width = CARD_WIDTH;
		this.cover.height = CARD_HEIGHT;
		this.cover.anchor.set(0.5, 0.5);
	}

	_initGraphics() {
		const graphics = new PIXI.Graphics();
		const strokeWidth = 8;
		graphics.lineStyle(strokeWidth, 0x6d28d9, 1);
		graphics.drawRoundedRect(-CARD_WIDTH / 2 + strokeWidth / 2, -CARD_HEIGHT / 2 + strokeWidth / 2, CARD_WIDTH - strokeWidth, CARD_HEIGHT - strokeWidth, 12);
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

	_listenEvent(){
		this.interactive = true;
		this.on("pointerup", this.onPickCard, this);
	}

	onPickCard(){
		this.game.onClickIntroCard(this);
	}

} 
