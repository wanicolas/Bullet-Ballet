import Phaser from "phaser";
import StateMachine from "../statemachine/statemachine";
import { sharedInstance as events } from "../scenes/EventCenter";
export default class Player {
  private scene: Phaser.Scene;
  private sprite: Phaser.Physics.Arcade.Sprite;
  private cursors: {};

  private stateMachine: StateMachine;
  private health = 50;

  private bullets?: Phaser.Physics.Arcade.Sprite[];

  constructor(
    scene: Phaser.Scene,
    sprite: Phaser.Physics.Arcade.Sprite,
    cursors: object
  ) {
    this.scene = scene;
    this.sprite = sprite;
    this.cursors = cursors;

    this.createAnimations();

    this.stateMachine = new StateMachine(this, "player");

    this.stateMachine
      .addState("idle", {
        onEnter: this.idleOnEnter,
        onUpdate: this.idleOnUpdate,
      })
      .addState("move", {
        onEnter: this.moveOnEnter,
        onUpdate: this.moveOnUpdate,
        onExit: this.moveOnExit,
      })
      .addState("jump", {
        onEnter: this.jumpOnEnter,
        onUpdate: this.jumpOnUpdate,
      })
      .addState("health-recover", {
        onEnter: this.healthRecoverOnEnter,
      })
      .addState("dead", {
        onEnter: this.deadOnEnter,
      })
      .setState("idle");
  }

  update(dt: number) {
    this.stateMachine.update(dt);
  }

  private setHealth(value: number) {
    this.health = Phaser.Math.Clamp(value, 0, 100);

    events.emit("health-changed", this.health);

    // TODO: check for death
    if (this.health <= 0) {
      this.stateMachine.setState("dead");
    }
  }

  private idleOnEnter() {
    this.sprite.play("idle");
  }

  private idleOnUpdate() {
    if (this.cursors.left.isDown || this.cursors.right.isDown) {
      this.stateMachine.setState("move");
    }

    const jumpJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up);
    if (jumpJustPressed) {
      this.stateMachine.setState("jump");
    }

    const shootJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.shoot);
    if (shootJustPressed) {
      this.shootBullet();
      console.log("shoot");
    }
  }

  private handleLeftRightMovement() {
    const speed = 3;

    if (this.cursors.left.isDown) {
      this.sprite.flipX = true;
      this.sprite.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      this.sprite.flipX = false;
      this.sprite.setVelocityX(speed);
    } else {
      this.sprite.setVelocityX(0);
    }
  }

  private moveOnEnter() {
    this.sprite.play("move");
  }

  private moveOnUpdate() {
    this.handleLeftRightMovement();

    const jumpJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up);
    if (jumpJustPressed) {
      this.stateMachine.setState("jump");
    }
  }

  private moveOnExit() {
    this.sprite.stop();
  }

  private jumpOnEnter() {
    this.sprite.setVelocityY(-7);
  }

  private jumpOnUpdate() {
    this.handleLeftRightMovement();
  }

  private healthRecoverOnEnter() {
    this.setHealth(this.health + 10);
  }

  private shootBullet() {
    const bullet = this.scene.physics.add.sprite(
      this.sprite.x,
      this.sprite.y,
      "bullet"
    );

    const speed = 10;
    if (this.sprite.flipX) {
      bullet.setVelocityX(-speed);
    } else {
      bullet.setVelocityX(speed);
    }

    this.bullets?.push(bullet);

    this.setupBulletCollision(bullet);
  }  

  private createAnimations() {
    this.sprite.anims.create({
      key: "idle",
      frames: [{ key: "player1", frame: "player1.png" }],
    });

    this.sprite.anims.create({
      key: "move",
      frames: [
        { key: "player1", frame: "player1.png" },
        { key: "player1", frame: "player1-move.png" },
      ],
      frameRate: 10,
      repeat: -1,
    });
  }
}
