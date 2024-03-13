import { Scene } from "phaser";

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  private cursors!: Phaser.Input.Keyboard.CursorKeys;
  private player1!: Phaser.Physics.Matter.Sprite;
  private isTouchingGround = false;

  constructor() {
    super("Game");
  }

  init() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  preload() {
    this.load.atlas(
      "player1",
      "assets/characters/player1.png",
      "assets/characters/player1.json"
    );
    this.load.image("tiles", "assets/tilemaps/tilemap_packed.png");
    this.load.tilemapTiledJSON("tilemap", "assets/tilemaps/map.json");
  }

  create() {
    this.createPlayerAnimation();

    const map = this.make.tilemap({ key: "tilemap" });
    const tileset = map.addTilesetImage("tilemap_packed", "tiles");

    const ground = map.createLayer("ground", tileset);
    ground.setCollisionByProperty({ collides: true });

    // Show the collision layer
    // this.matter.world.convertTilemapLayer(ground);

    const objectsLayer = map.getObjectLayer("objects");

    objectsLayer.objects.forEach((objData) => {
      const { x = 0, y = 0, name, width = 0 } = objData;

      switch (name) {
        case "spawn": {
          this.player1 = this.matter.add
            .sprite(x + width, y, "player1")
            .play("still")
            .setFixedRotation();

          this.player1.setOnCollide((data: MatterJS.ICollisionPair) => {
            this.isTouchingGround = true;
          });

          break;
        }
      }
    });
  }

  update() {
    const speed = 5;

    if (this.cursors.left.isDown) {
      this.player1.flipX = false;
      this.player1.setVelocityX(-speed);
      this.player1.anims.play("move", true);
    } else if (this.cursors.right.isDown) {
      this.player1.flipX = true;
      this.player1.setVelocityX(speed);
      this.player1.anims.play("move", true);
    } else {
      this.player1.setVelocityX(0);
      this.player1.anims.play("still");
    }

    const jumpPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up.isDown);
    if (jumpPressed && this.isTouchingGround) {
      this.player1.setVelocityY(-5);
      this.isTouchingGround = false;
    }
  }

  private createPlayerAnimation() {
    this.anims.create({
      key: "still",
      frames: [{ key: "player1", frame: "player1.png" }],
    });

    this.anims.create({
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
