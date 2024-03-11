import { Boot } from "./scenes/Boot";
import { Game as MainGame } from "./scenes/Game";
import { GameOver } from "./scenes/GameOver";
import { MainMenu } from "./scenes/MainMenu";
import { Preloader } from "./scenes/Preloader";

import { Game, Types } from "phaser";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 972,
  height: 540,
  backgroundColor: "#fff",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300, x: 0 },
      debug: false,
    },
  },
  parent: "game-container",
  scene: [Boot, Preloader, MainMenu, MainGame, GameOver],
};

export default new Game(config);
