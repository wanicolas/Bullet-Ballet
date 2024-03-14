import Phaser from "phaser";

import PlayerController from "../controllers/Player";

export default class Game extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private playerController?: PlayerController;

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
    this.load.image("tiles", "assets/tilemaps/tilemap_packed.png");
    this.load.tilemapTiledJSON("tilemap", "assets/tilemaps/map.json");
    this.load.image("health", "assets/objects/health.png");
  }

  create() {
    this.scene.launch("UI");

    const map = this.make.tilemap({ key: "tilemap" });
    const tileset = map.addTilesetImage("tilemap_packed", "tiles");

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

          this.playerController = new PlayerController(
            this,
            this.player1,
            this.cursors
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
    this.scene.stop("ui");
  }

  update(t: number, dt: number) {
    this.playerController?.update(dt);
  }
}
