import { Scene } from "phaser";

export class Boot extends Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
    //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

    this.load.image("ground", "assets/ground.png");
    this.load.image("island", "assets/island.png");
    this.load.spritesheet("player", "assets/player.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
    // this.load.tilemapTiledJSON('map', 'assets/Tiled/map.json');
  }

  create() {
    this.scene.start("Preloader");
  }
}
