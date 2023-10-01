import Phaser from "phaser";
import { config } from "../main";

let background;
let player;
let camera;
let cursors;
class CutScene1 extends Phaser.Scene {
  constructor() {
    super({
      key: "CutScene1",
    });
  }

  preload() {
    this.load.image("background", "src/image/_dev/backGround.png");
    this.load.spritesheet("player", "src/image/_dev/playerSpritesheet.png", {
      frameWidth: 669,
      frameHeight: 569,
    });
  }

  create() {
    background = this.add
      .tileSprite(0, 0, 720, 1080, "background")
      .setOrigin(0, 0)
      .setScale(1.5);

    player = this.physics.add
      .sprite(config.width / 2, config.height / 2, "player")
      .setScale(0.5)
      .setSize(200, 200)
      .setCollideWorldBounds(true);

    camera = this.cameras.main;
    camera.setViewport(0, 0, 720, 1080).setBounds(0, 0, 720, 1080).setZoom(1.5);

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
    cursors = this.input.keyboard.createCursorKeys();
    if (cursors.left.isDown) {
      player.setVelocityX(-100);
      player.anims.play("walk", true);
      player.flipX = true;
    } else if (cursors.right.isDown) {
      player.setVelocityX(100);
      player.anims.play("walk", true);
      player.flipX = false;
    } else if (cursors.up.isDown) {
      player.setVelocityY(-100);
      player.anims.play("walk", true);
    } else if (cursors.down.isDown) {
      player.setVelocityY(100);
      player.anims.play("walk", true);
    } else if (cursors.left.isDown && cursors.up.isDown) {
      player.setVelocityX(-70);
      player.setVelocityY(70);
      player.anims.play("walk", true);
    } else if (cursors.left.isDown && cursors.down.isDown) {
      player.setVelocityX(-70);
      player.setVelocityY(-70);
      player.anims.play("walk", true);
    } else if (cursors.right.isDown && cursors.up.isDown) {
      player.setVelocityX(70);
      player.setVelocityY(70);
      player.anims.play("walk", true);
    } else if (cursors.right.isDown && cursors.down.isDown) {
      player.setVelocityX(70);
      player.setVelocityY(-70);
      player.anims.play("walk", true);
    } else {
      player.setVelocityX(0);
      player.setVelocityY(0);
      player.anims.play("walk", false);
    }
  }

  update(delta, time) {
    camera.startFollow(player);
    this.playerMove(player);
  }
}

export default CutScene1;
