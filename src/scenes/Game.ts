import { Scene } from "phaser";

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;

  constructor() {
    super("Game");
  }

  create() {
    const map = this.make.tilemap({ key: "map" });
    map.addTilesetImage("tilemap_packed", "tiles");

    const collides = map.createLayer("map", "tilemap_packed");
    collides.setCollisionByProperty({ collides: true } as any);

    this.matter.world.convertTilemapLayer(collides);
  }
}
