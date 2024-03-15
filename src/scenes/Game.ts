import Phaser from "phaser";

import PlayerController from "../controllers/Player";

export default class Game extends Phaser.Scene {
  private player1Controller?: PlayerController;
  private player2Controller?: PlayerController;

  constructor() {
    super("Game");
  }

  init() {
    this.cursors = this.input.keyboard.createCursorKeys();

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.destroy();
    });
  }

  preload() {
    this.load.atlas(
      "player1",
      "assets/characters/player1.png",
      "assets/characters/player1.json"
    );
    this.load.atlas(
      "player2",
      "assets/characters/player2.png",
      "assets/characters/player2.json"
    );
    this.load.image("tiles", "assets/tilemaps/tilemap_packed.png");
    this.load.image(
      "backgroundTiles",
      "assets/tilemaps/tilemap-backgrounds_packed.png"
    );
    this.load.tilemapTiledJSON("tilemap", "assets/tilemaps/map.json");
    this.load.image("health", "assets/objects/health.png");
    this.load.image("bullet", "assets/bullet.png");
    this.load.audio("theme", ["assets/theme.mp3"]);
  }

  create() {
    this.scene.launch("UI");
    this.sound.play("theme", { loop: true });

    const player1Controls = this.input.keyboard.addKeys({
      up: "z",
      down: "s",
      left: "q",
      right: "d",
      shoot: "c",
    });

    const player2Controls = this.input.keyboard.addKeys({
      up: "i",
      down: "k",
      left: "j",
      right: "l",
      shoot: "n",
    });

    const map = this.make.tilemap({ key: "tilemap" });
    const backgroundTileset = map.addTilesetImage(
      "tilemap-backgrounds_packed",
      "backgroundTiles"
    );
    const tileset = map.addTilesetImage("tilemap_packed", "tiles");

    const background = map.createLayer("background", backgroundTileset);
    const ground = map.createLayer("ground", tileset);
    ground.setCollisionByProperty({ collides: true });

    // Convert the layer. Any colliding tiles will be given a Matter body. If a tile has collision
    // shapes from Tiled, these will be loaded. If not, a default rectangle body will be used. The
    // body will be accessible via tile.physics.matterBody.
    this.matter.world.convertTilemapLayer(ground);

    const objectsLayer = map.getObjectLayer("objects");

    objectsLayer.objects.forEach((objData) => {
      const { x = 0, y = 0, name, width = 0 } = objData;

      switch (name) {
        case "spawn1": {
          this.player1 = this.matter.add
            .sprite(x + width, y, "player1")
            .setFixedRotation();

          this.player1Controller = new PlayerController(
            this,
            this.player1,
            player1Controls
          );

          break;
        }
        case "spawn2": {
          this.player2 = this.matter.add
            .sprite(x + width, y, "player2")
            .setFixedRotation();

          this.player2Controller = new PlayerController(
            this,
            this.player2,
            player2Controls
          );

          break;
        }

        case "health": {
          const health = this.matter.add.sprite(x, y, "health", undefined, {
            isStatic: true,
            isSensor: true,
          });

          health.setData("type", "health");
          health.setData("healthPoints", 10);
          break;
        }
      }
    });
  }

  destroy() {
    this.scene.stop("UI");
  }

  update(dt: number) {
    this.player1Controller?.update(dt);
    this.player2Controller?.update(dt);
  }
}
