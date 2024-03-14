import Game from "./scenes/Game";
import UI from "./scenes/UI";
import GameOver from "./scenes/GameOver";

import Phaser from "phaser";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 972,
  height: 540,
  backgroundColor: "#fff",
  physics: {
    default: "matter",
    matter: {
      debug: true,
    },
  },
  parent: "game-container",
  scene: [Game, UI, GameOver],
};

export default new Phaser.Game(config);
