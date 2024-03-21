import Phaser from "phaser";

import PlayerController from "../controllers/Player";

export default class Game extends Phaser.Scene {
  player1?: Phaser.Physics.Arcade.Sprite;
  player2?: Phaser.Physics.Arcade.Sprite;
  player1Controller?: PlayerController;
  player2Controller?: PlayerController;

  constructor() {
    super("Game");
  }

  init() {
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.destroy();
    });
  }

  preload() {
    // Load the player spritesheets
    this.load.spritesheet("player1", "assets/characters/player1.png", {
      frameWidth: 24,
      frameHeight: 24,
    });
    this.load.spritesheet("player2", "assets/characters/player2.png", {
      frameWidth: 24,
      frameHeight: 24,
    });

    // Load the map tiles and background images
    this.load.image("tiles", "assets/tilemaps/tilemap_packed.png");
    this.load.image(
      "backgroundTiles",
      "assets/tilemaps/tilemap-backgrounds_packed.png"
    );
    this.load.tilemapTiledJSON("tilemap", "assets/tilemaps/map.json");

    // Load the health and bullet images
    this.load.image("health", "assets/objects/health.png");
    this.load.image("bullet", "assets/bullet.png");

    // Load the theme music
    this.load.audio("theme", ["assets/theme.mp3"]);
  }

  create() {
    this.scene.launch("UI");
    this.sound.play("theme", { loop: true });

    const map = this.make.tilemap({ key: "tilemap" });
    const backgroundTileset = map.addTilesetImage(
      "tilemap-backgrounds_packed",
      "backgroundTiles"
    );
    const tileset = map.addTilesetImage("tilemap_packed", "tiles");

    map.createLayer("background", backgroundTileset);
    const terrain = map.createLayer("terrain", tileset);
    terrain.setCollisionByProperty({ collides: true });

    const player1Controls = {
      up: "z",
      down: "s",
      left: "q",
      right: "d",
      shoot: "c",
    };

    const player2Controls = {
      up: "i",
      down: "k",
      left: "j",
      right: "l",
      shoot: "n",
    };

    const objectsLayer = map.getObjectLayer("objects");

    objectsLayer?.objects.forEach((objData) => {
      const { x = 0, y = 0, name, width = 0 } = objData;

      switch (name) {
        case "spawn1": {
          this.player1 = this.physics.add.sprite(x + width, y, "player1");

          this.player1Controller = new PlayerController(
            this,
            this.player1,
            player1Controls
          );
          break;
        }
        case "spawn2": {
          this.player2 = this.physics.add.sprite(x + width, y, "player2");

          this.player2Controller = new PlayerController(
            this,
            this.player2,
            player2Controls
          );
          break;
        }

        case "health": {
          const health = this.physics.add.staticSprite(x, y, "health");

          health.setData("type", "health");
          health.setData("healthPoints", 10);
          break;
        }
      }
    });

    // Add collision between the players, the terrain and the objects
    this.physics.add.collider(this.player1, terrain);
    this.physics.add.collider(this.player2, terrain);
    this.physics.add.collider(this.player1, objectsLayer);
    this.player1?.setCollideWorldBounds(true);
    this.player2?.setCollideWorldBounds(true);
  }

  destroy() {
    this.scene.stop("UI");
  }

  update() {
    this.player1Controller?.update();
    this.player2Controller?.update();
  }
}
