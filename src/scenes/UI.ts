import Phaser from "phaser";
import { sharedInstance as events } from "./EventCenter";

export default class UI extends Phaser.Scene {
  private graphics!: Phaser.GameObjects.Graphics;

  private lastHealth = 100;

  constructor() {
    super("ui");
  }

  init() {}

  create() {
    this.graphics = this.add.graphics();
    this.setHealthBar(100);

    events.on("health-changed", this.handleHealthChanged, this);
  }

  private setHealthBar(value: number) {
    const width = 200;
    const percent = Phaser.Math.Clamp(value, 0, 100) / 100;

    this.graphics.clear();
    this.graphics.fillStyle(0x808080);
    this.graphics.fillRoundedRect(10, 10, width, 20, 5);
    if (percent > 0) {
      this.graphics.fillStyle(0x00ff00);
      this.graphics.fillRoundedRect(10, 10, width * percent, 20, 5);
    }
  }

  private handleHealthChanged(value: number) {
    this.tweens.addCounter({
      from: this.lastHealth,
      to: value,
      duration: 200,
      ease: Phaser.Math.Easing.Sine.InOut,
      onUpdate: (tween) => {
        const value = tween.getValue();
        this.setHealthBar(value);
      },
    });

    this.lastHealth = value;
  }
}
