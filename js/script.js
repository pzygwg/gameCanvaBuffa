import Game from "./Game.js";

window.addEventListener("load", () => {
  const canvas = document.getElementById("gameCanvas");
  const game = new Game(canvas);
  game.init();
  game.start();
});
