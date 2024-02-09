import { Card } from "./Card.js";
import { IntroCard } from "./IntroCard.js";
import { CARD_WIDTH, CARD_HEIGHT } from "./Config.js";
function getUrlParam(name) {
	const url = new URL(window.location.href);
	return url.searchParams.get(name);
};

const STATE = { INIT: 0, INTRO: 1, SHUFFLE: 2, WAITING: 3, OPENING: 4, FOCUS: 5, CLOSING: 6 };
class Game extends PIXI.Container {

	init(width, height) {
		window.game = this;
		this._setupView(width, height);
		if (this.isInit) return this._alignGame();
		this.isInit = true;
		this.state = STATE.INIT;
		this._initIntroCards();
		this._initCards();
		this._initOverLay();
		this._initIntroText();
		this.cardDecks = [];
	}

	_setupView(width, height) {
		width *= 11 / 12;
		height *= 11 / 12;
		const maxWidth = width / 3.1;
		const maxHeight = height / 2.1;
		const scaleX = maxWidth / CARD_WIDTH;
		const scaleY = maxHeight / CARD_HEIGHT;
		const scale = Math.min(scaleX, scaleY);
		this.contentSize = { width, height, scale };
		this.contentSize.maxScale = this._getMaxScale();
		this.state = STATE.WAITING;
		console.log(this.contentSize)
	}

	_initIntroCards() {
		const { width, height } = this.contentSize;
		this._introCards = [];
		this.introNode = new PIXI.Container();
		this.introNode.sortableChildren = true;
		this.addChild(this.introNode);

		const radius = Math.min(width / 2.7, height / 4);
		const scale = radius * 0.9 / CARD_HEIGHT;
		const maxCard = 18;
		for (let index = 0; index < maxCard; index++) {
			let angle = 360 / maxCard * index;
			const card = new IntroCard(this);
			card.scale.set(scale, scale);
			card.angle = angle + 90;
			card.x = radius * Math.cos(this._toRad(angle));
			card.y = height / 6 + radius * Math.sin(this._toRad(angle));
			this._introCards.push(card);
			this.introNode.addChild(card);
		}
	}

	_toRad(degree) {
		return Math.PI * degree / 180;
	}
	_initIntroText() {
		const { width, height, scale } = this.contentSize;
		const { height: introNodeHeight } = this.introNode;
		const h = (height - introNodeHeight);
		this.introTextHolder = new PIXI.Container();
		this.addChild(this.introTextHolder);
		this.introTextHolder.y = -height / 2 + h / 2;
		this.introTextHolder.scale.set(scale, scale);

		const style = new PIXI.TextStyle({
			fontFamily: 'Karla',
			fontSize: 40,
			fontWeight: 'bold',
			fill: [
				"#066b2d",
			],
			stroke: '#0x000000',
			strokeThickness: 2,
			wordWrap: true,
			wordWrapWidth: 700,
			lineJoin: 'round',
			align: "center"
		});

		const basicText = new PIXI.Text("Let's think about your own question and choose 5 cards you want".toUpperCase(), style);
		this.introTextHolder.addChild(basicText);
		basicText.anchor.set(0.5, 0.5);
	}

	_initCards() {
		const { scale } = this.contentSize;
		this.state = STATE.INIT;
		this._cards = [];
		this.cardHolder = new PIXI.Container();
		this.cardHolder.visible = false;
		this.addChild(this.cardHolder);
		let ids = getUrlParam("tokenId");
		ids = ids ? ids.split(";") : this._randomCards();
		for (let index = 0; index < 5; index++) {
			const card = new Card(index, this);
			card.scale.set(scale, scale);
			this._cards.push(card);
			card.setCardId(ids[index]);
			this.cardHolder.addChild(card);
		}
		this.on("PICK_CARD", this.onPickCard, this);
	}

	_initOverLay() {
		if (this.overlay) return;
		this.overlay = new PIXI.Container();
		this.addChild(this.overlay);

		let { width, height } = this.contentSize;
		width *= 12 / 11;
		height *= 12 / 11;
		const graphics = new PIXI.Graphics();
		graphics.beginFill(0x000000);
		graphics.drawRect(-width / 2, -height / 2, width, height);
		graphics.endFill();
		this.overlay.addChild(graphics);
		this.graphics = graphics;
		this.graphics.alpha = 0;
		this.overlay.on("pointerup", this.onClickOverlay, this, true);
		this._initGlow();
	}

	_initGlow() {
		this.glow = new PIXI.Sprite.from("./img/GlowRed.png");
		this.glow.anchor.set(0.5, 0.5);
		this.overlay.addChild(this.glow);
		const { maxScale } = this.contentSize;
		this.glow.scale.set(maxScale * 2, maxScale * 2);
		this.glow.visible = false;
	}
	_playGlowIdle() {
		this.glow.visible = true;
		this._tweenGlow && this._tweenGlow.kill();
		this._tweenGlow = this.tween();
		this._tweenGlow.to(this.glow, { duration: 30, angle: "+=360", repeat: -1 })
		this._tweenGlow.play();
	}
	_stopGlowIdle() {
		this._tweenGlow && this._tweenGlow.kill();
		this._tweenGlow = null;
		this.glow.visible = false;
	}
	_alignGame() {

	}
	_getPosition(index) {
		const { width, height, scale } = this.contentSize;
		let x, y;
		switch (index) {
			case 0:
				x = -width / 2 + CARD_WIDTH * scale / 2;
				y = -height / 2 + CARD_HEIGHT * scale / 2;
				return { x, y };
			case 1:
				x = width / 2 - CARD_WIDTH * scale / 2;
				y = -height / 2 + CARD_HEIGHT * scale / 2;
				return { x, y };
			case 2:
				x = 0;
				y = 0;
				return { x, y };
			case 3:
				x = -width / 2 + CARD_WIDTH * scale / 2;
				y = height / 2 - CARD_HEIGHT * scale / 2;
				return { x, y };
			case 4:
				x = width / 2 - CARD_WIDTH * scale / 2;
				y = height / 2 - CARD_HEIGHT * scale / 2;
				return { x, y };
		}
	}

	playAnimShuffle() {
		this.state = STATE.SHUFFLE;
		this._cards.forEach((card) => {
			const index = card.index;
			const { x, y } = this._getPosition(index);
			const timeline = gsap.timeline({ paused: true, repeatRefresh: true });
			let duration = 0.15;
			timeline
				.to(card, { duration: 0.3, x: 0, y: 0 })
				.to(card, { duration: 0.3 })
				.to(card, { duration, x: this._randomX(index) })
				.to(card, { duration, x: 0 })
				.to(card, { duration, x: this._randomX(index) })
				.to(card, { duration, x: 0 })
				.to(card, { duration, x: this._randomX(index) })
				.to(card, { duration, x: 0 })
				.to(card, { duration: 0.3, x, y });
			if (card.index == 4) {
				timeline.call(() => {
					this.state = STATE.WAITING;
				})
			}
			timeline.play();
		});
	}

	_randomX(index) {
		let direction = (index % 2 === 0) ? 1 : -1;
		const { width } = this.contentSize;
		const min = 10;
		const max = width / 2.5;
		return direction * Math.floor(Math.random() * (max - min + 1)) + min;
	}

	onPickCard(card) {
		if (this.state === STATE.WAITING) {
			this.focusCard(card);
			this.state = STATE.OPENING;
			if (!card.isOpened) {
				let dur = 2;
				card.flipOpen(dur);
				this.scheduleOnce(() => {
					this.state = STATE.FOCUS;
					this.overlay.interactive = true;
					this._playGlowIdle();
				}, dur);
			} else {
				let dur = 0.5;
				card.highlight(dur);
				this.scheduleOnce(() => {
					this._playGlowIdle();
					this.state = STATE.FOCUS;
					this.overlay.interactive = true;
				}, dur);
			}
		} else if (this.state === STATE.FOCUS) {
			card = card || this.card;
			this.state = STATE.CLOSING;
			if (card.isOpened) {
				this._moveCurrentCardBack();
			}
		}
	}
	focusCard(card) {
		this.card = card;
		this.state = STATE.OPEN;
		this.overlay.visible = true;
		this.overlay.interactive = false;
		this.overlay.addChild(card);
		const duration = 0.5;
		this.tween().to(this.graphics, { duration, alpha: 0.8 }).play();
	}

	onClickOverlay() {
		if (this.state === STATE.FOCUS) {
			this._moveCurrentCardBack();
		}
	}
	_moveCurrentCardBack() {
		this._stopGlowIdle();
		if (!this.card) return;
		const card = this.card;
		const { scale } = this.contentSize;
		const { x, y } = this._getPosition(card.index);
		const tl = this.tween().to(card, { duration: 0.5, x, y }, 0);
		tl.to(card.scale, { duration: 0.5, x: scale, y: scale }, 0);
		tl.to(this.graphics, { duration: 0.5, alpha: 0 }, 0).play();
		this.overlay.interactive = false;
		this.scheduleOnce(() => {
			this.cardHolder.addChild(card);
			this.state = STATE.WAITING;
			this.overlay.visible = false;
		}, 0.5);
		this.card = null;
	}

	scheduleOnce(callback, time) {
		this.tween()
			.to(this, { duration: time })
			.call(() => { callback && callback() })
			.play();
	}

	tween() {
		return gsap.timeline({ paused: true, repeatRefresh: true });
	}

	_getMaxScale() {
		const { width, height } = this.contentSize;
		const scaleX = width * 11 / 12 / CARD_WIDTH;
		const scaleY = height * 11 / 12 / CARD_HEIGHT;
		return Math.min(scaleX, scaleY);
	}

	_randomCards() {
		return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].sort(() => Math.random() - 0.5).slice(5);
	}

	onClickIntroCard(card) {
		this.introTextHolder.visible = false;
		if (this.cardDecks.length >= 5) return;
		const index = this.cardDecks.length;
		this.cardDecks.push(card);
		card.zIndex = this._introCards.length - 1;
		const { x, y } = this._getCardPosInDesk(card, index);
		const tl = this.tween();
		tl.to(card, { duration: 0.5, x, y, angle: 0, ease: "sine.inOut" })
			.call(() => {
				if (index === 4) {
					this.startShowCard();
				}
			})
			.play();
	}
	_getCardPosInDesk(card, index) {
		let scale = card.scale.x;
		const { width, height } = this.contentSize;
		const startX = -width / 5 * 2;
		const x = startX + width / 5 * index;
		const y = -height / 2 + scale * CARD_HEIGHT / 2;
		return { x, y };
	}
	startShowCard() {
		let count = 0;
		const { width, height } = this.contentSize;
		this._introCards.forEach((card) => {
			if (this.cardDecks.includes(card)) return;
			count++;
			let scale = card.scale.x;
			const x = -width / 2 - scale * CARD_WIDTH;
			const y = height / 2 + scale * CARD_HEIGHT;
			let tl = this.tween();
			tl.to(card, { duration: 0.5, x, y, angle: 0, ease: "sine.inOut" })
				.to(card, { duration: 0.5 })
				.call(() => {
					if (count === this._introCards.length - 5) {
						this._hideIntroCards();
					}
				})
				.play();
		});
	}
	_hideIntroCards() {
		this._introCards.forEach((card) => {
			if (this.cardDecks.includes(card)) return;
			card.visible = false;
		});
		const { scale } = this.contentSize;
		const duration = 0.5;
		this.cardDecks.forEach((card) => {
			let tl = this.tween();
			tl.to(card, { duration, x: 0, y: 0, angle: 0, ease: "sine.inOut" })
			tl.to(card.scale, { duration, x: scale, y: scale, ease: "sine.inOut" }, 0)
				.play();
		});
		this.scheduleOnce(() => {
			this.introNode.visible = false;
			this.cardHolder.visible = true;
			this.playAnimShuffle();
		}, duration);
	}

}

export const game = new Game();

