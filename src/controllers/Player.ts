import Phaser from "phaser";

export default class Player {
  scene: Phaser.Scene;
  player: Phaser.Physics.Arcade.Sprite;
  cursors: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
    shoot: Phaser.Input.Keyboard.Key;
  };
  speed: 120;
  hp: 50;

  constructor(
    scene: Phaser.Scene,
    player: Phaser.Physics.Arcade.Sprite,
    cursors: object
  ) {
    this.scene = scene;
    this.player = player;
    this.cursors = cursors as {
      up: Phaser.Input.Keyboard.Key;
      down: Phaser.Input.Keyboard.Key;
      left: Phaser.Input.Keyboard.Key;
      right: Phaser.Input.Keyboard.Key;
      shoot: Phaser.Input.Keyboard.Key;
    };

    player.anims.create({
      key: "idle",
      frames: [{ key: player.name, frame: 0 }],
      frameRate: 20,
    });

    player.anims.create({
      key: "move",
      frames: player.anims.generateFrameNumbers(player.name, {
        start: 0,
        end: 1,
      }),
      frameRate: 10,
      repeat: -1,
    });

    // scene.physics.add.overlap(
    //   this.player,
    //   scene.health,
    //   collectHealth,
    //   null,
    //   this
    // );
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.anims.play("move", true);
      this.player.setVelocityX(-this.speed);
    } else if (this.cursors.right.isDown) {
      this.player.anims.play("move", true);
      this.player.setVelocityX(this.speed);
      this.player.flipX;
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("idle");
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-160);
    }

    // collectHealth(player, health);
    // {
    //   health.disableBody(true, true);
    //   this.health += 10;
    // }
  }
}
