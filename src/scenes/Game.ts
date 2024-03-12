import { Scene } from "phaser";

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;

  constructor() {
    super("Game");
  }

  preload() {
    this.load.atlas(
      "spritesheet",
      "assets/characters/spritesheet.png",
      "assets/characters/spritesheet.json"
    );
    this.load.image("tiles", "assets/tilemaps/tilemap_packed.png");
    this.load.tilemapTiledJSON("tilemap", "assets/tilemaps/map.json");
  }

  create() {
    const map = this.make.tilemap({ key: "tilemap" });
    const tileset = map.addTilesetImage("tilemap_packed", "tiles");

    if (tileset) {
      const ground = map.createLayer("map", tileset);
      ground.setCollisionByProperty({ collides: true });

      this.matter.world.convertTilemapLayer(ground);
    }

    this.matter.add.sprite(100, 100, "spritesheet");
  }
}
