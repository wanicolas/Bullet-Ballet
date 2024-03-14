import Phaser from "phaser";
import StateMachine from "../statemachine/statemachine";
import { sharedInstance as events } from "../scenes/EventCenter";

type CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;

export default class Player {
  private scene: Phaser.Scene;
  private sprite: Phaser.Physics.Matter.Sprite;
  private cursors: CursorKeys;

  private stateMachine: StateMachine;
  private health = 100;

  constructor(
    scene: Phaser.Scene,
    sprite: Phaser.Physics.Matter.Sprite,
    cursors: CursorKeys
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

    this.sprite.setOnCollide((data: MatterJS.ICollisionPair) => {
      const body = data.bodyB as MatterJS.BodyType;

      const gameObject = body.gameObject;

      if (!gameObject) {
        return;
      }

      if (gameObject instanceof Phaser.Physics.Matter.TileBody) {
        if (this.stateMachine.isCurrentState("jump")) {
          this.stateMachine.setState("idle");
        }
        return;
      }

      const sprite = gameObject as Phaser.Physics.Matter.Sprite;
      const type = sprite.getData("type");

      switch (type) {
        case "health": {
          const value = sprite.getData("healthPoints") ?? 10;
          this.health = Phaser.Math.Clamp(this.health + value, 0, 100);
          events.emit("health-changed", this.health);
          sprite.destroy();
          break;
        }
      }
    });
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
  }

  private moveOnUpdate() {
    const speed = 3;

    if (this.cursors.left.isDown) {
      this.sprite.flipX = true;
      this.sprite.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      this.sprite.flipX = false;
      this.sprite.setVelocityX(speed);
    } else {
      this.sprite.setVelocityX(0);
      this.stateMachine.setState("idle");
    }

    const jumpJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space);
    if (jumpJustPressed) {
      this.stateMachine.setState("jump");
    }
  }

  private moveOnExit() {
    this.sprite.stop();
  }

  private jumpOnEnter() {
    this.sprite.setVelocityY(-12);
  }

  private jumpOnUpdate() {
    const speed = 5;

    if (this.cursors.left.isDown) {
      this.sprite.flipX = true;
      this.sprite.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      this.sprite.flipX = false;
      this.sprite.setVelocityX(speed);
    }
  }

  private healthRecoverOnEnter() {
    this.setHealth(this.health + 10);
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
