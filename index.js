import { game } from "./GameController.js";
import { SCREEN_WIDTH, SCREEN_HEIGHT, gameConfig } from "./Config.js";
const canvasElement = document.getElementById("pixi-canvas");
const gameContainer = document.getElementById("game-container");
const mainDiv = document.getElementById("main");

gsap.registerPlugin(PixiPlugin);
gsap.defaults({ease: "none"});

const app = new PIXI.Application({
	view: canvasElement,
	resolution: 2,
	autoDensity: true,
	backgroundColor: 0x000000,
	width: SCREEN_WIDTH,
	height: SCREEN_HEIGHT,
	backgroundAlpha: 0
});

globalThis.__PIXI_APP__ = app;
globalThis.app = app;
app.stage.addChild(game);

app.renderer.plugins.interaction.autoPreventDefault = false;
app.renderer.view.style.touchAction = "auto";

resizeCanvas();

function resizeCanvas() {
	setTimeout(() => {
		const { width, height } = mainDiv.getBoundingClientRect();
		const realWidth = width;
		const realHeight = height;
		gameContainer.style.width = `${realWidth}px`;
		gameContainer.style.height = `${realHeight}px`;
		app.renderer.resize(realWidth, realHeight);

		const screenRatio = realWidth / realHeight;
		gameConfig.gameHeight = SCREEN_WIDTH / screenRatio;
		const scale = realWidth / SCREEN_WIDTH;
		game.scale.set(scale, scale);
		game.x = app.screen.width / 2;
		game.y = app.screen.height / 2;
		game.init(gameConfig.gameWidth, gameConfig.gameHeight);
	}, 1);
}

const messageContainer = document.getElementById("messageContainer");
const messageDiv = document.getElementById("messageContainer");

const showMessage = function (isShow, message = "") {
	messageContainer.style.display = isShow ? 'block' : "none";
	if (message) messageDiv.innerHTML = message;
}

game.on("SHOW_MESSAGE", showMessage);


