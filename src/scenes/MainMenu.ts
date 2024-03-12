import { Scene, GameObjects } from "phaser";

export class MainMenu extends Scene {
  title: GameObjects.Text;

  constructor() {
    super("MainMenu");
  }

  create() {
    this.title = this.add
      .text(512, 460, "Main Menu", {
        fontSize: 38,
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);

    this.input.once("pointerdown", () => {
      this.scene.start("Game");
    });
  }
}
