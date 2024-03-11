import { Scene } from "phaser";

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  msg_text: Phaser.GameObjects.Text;

  constructor() {
    super("Game");
  }

  create() {
    let platforms = this.physics.add.staticGroup();
    platforms.create(400, 588, "ground");
    platforms.create(600, 450, "island");
    platforms.create(50, 250, "island");
    platforms.create(650, 220, "island");
    platforms.create(250, 520, "island");
    platforms.create(250, 320, "island");
  }
}
