import Phaser from "phaser";
import { config } from "../main";

let background;
let player;
let camera;
let foreground;

class CutScene1 extends Phaser.Scene {
  constructor() {
    super({
      key: "CutScene1",
    });
  }

  preload() {
    this.load.image("background", "src/image/_dev/backGround.png");
    this.load.image("foreground", "src/image/_dev/playermeow.jpg");
    this.load.spritesheet("player", "src/image/_dev/playerSpritesheet.png", {
      frameWidth: 669,
      frameHeight: 569,
    });
  }

  create() {
    background = this.add
      .tileSprite(0, 0, 720, 1080, "background")
      .setOrigin(0, 0)
      .setScale(1.5)
      .setDepth(-1);

    foreground = this.add
      .image(0, config.height - 100, "foreground")
      .setOrigin(0, 0)
      .setScale(0.5)
      .setDepth(1);
    player = this.physics.add
      .sprite(config.width / 2, config.height / 2, "player")
      .setScale(0.5)
      .setSize(200, 200)
      .setCollideWorldBounds(true)
      .setDepth(0);

    camera = this.cameras.main
      .setViewport(0, 0, 720, 1080)
      .setBounds(0, 0, 720, 1080)
      .setZoom(2);

    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("player", {
        start: 0,
        end: 7,
      }),
      frameRate: 4,
      repeat: -1,
    });
  }

  playerMove(player) {
    const cursors = this.input.keyboard.createCursorKeys();
    let velocityX = 0;
    let velocityY = 0;

    if (cursors.left.isDown) {
      velocityX = -100;
      player.setFlipX(true);
    } else if (cursors.right.isDown) {
      velocityX = 100;
      player.setFlipX(false);
    }

    if (cursors.up.isDown) {
      velocityY = -100;
    } else if (cursors.down.isDown) {
      velocityY = 100;
    }

    // Check for diagonal movement
    if (cursors.left.isDown && cursors.up.isDown) {
      velocityX = -70;
      velocityY = -70;
    } else if (cursors.left.isDown && cursors.down.isDown) {
      velocityX = -70;
      velocityY = 70;
    } else if (cursors.right.isDown && cursors.up.isDown) {
      velocityX = 70;
      velocityY = -70;
    } else if (cursors.right.isDown && cursors.down.isDown) {
      velocityX = 70;
      velocityY = 70;
    }

    player.setVelocity(velocityX, velocityY);
    player.anims.play("walk", velocityX !== 0 || velocityY !== 0);
  }

  update(delta, time) {
    camera.startFollow(player);
    this.playerMove(player);
  }
}

export default CutScene1;
