import { game } from "./GameController.js";
import { SCREEN_WIDTH, SCREEN_HEIGHT, gameConfig } from "./Config.js";

gsap.registerPlugin(PixiPlugin);
gsap.defaults({ ease: "none" });

const app = new PIXI.Application({
	view: document.getElementById("pixi-canvas"),
	resolution: 2,
	autoDensity: true,
	backgroundColor: 0x000000,
	width: SCREEN_WIDTH,
	height: SCREEN_HEIGHT,
	backgroundAlpha: 0
});

globalThis.__PIXI_APP__ = app;
// globalThis.app = app;
app.stage.addChild(game);

app.renderer.plugins.interaction.autoPreventDefault = false;
app.renderer.view.style.touchAction = "auto";

const gameContainer = document.getElementById("game-container");
const mainDiv = document.getElementById("main");

const resizeGame = function () {
	const { width, height } = mainDiv.getBoundingClientRect();
	gameContainer.style.width = `${width}px`;
	gameContainer.style.height = `${height}px`;
	app.renderer.resize(width, height);
	game.x = app.screen.width / 2;
	game.y = app.screen.height / 2;
	let scale;
	if (game.isInit) {
		const { gameWidth, gameHeight } = gameConfig;
		scale = Math.min(width / gameWidth, height / gameHeight);
		game.scale.set(scale, scale);
	} else {
		const screenRatio = width / height;
		gameConfig.gameHeight = SCREEN_WIDTH / screenRatio;
		scale = width / SCREEN_WIDTH;
		game.scale.set(scale, scale);
		game.init(gameConfig.gameWidth, gameConfig.gameHeight);
	}
	// console.error({ width, height , scale});
	// const { width: w, height: h } = game;
	// console.error({ w, h, ...gameConfig });
}

resizeGame();

let timeoutResize;
const onResize = function () {
	if (timeoutResize) clearTimeout(timeoutResize);
	timeoutResize = setTimeout(() => {
		timeoutResize = null;
		resizeGame();
	}, 100);
}
window.addEventListener("resize", onResize);

const messageContainer = document.getElementById("messageContainer");
const messageDiv = document.getElementById("messageContainer");

const showMessage = function (isShow, message = "") {
	messageContainer.style.display = isShow ? 'block' : "none";
	if (message) messageDiv.innerHTML = message;
}

game.on("SHOW_MESSAGE", showMessage);