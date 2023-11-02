import Phaser from 'phaser';
import { changeSceneIf } from '../utils/changeScene';
import enableInteractivityOnOverlap from '../utils/collisionUtils';

let player;
let up;
let down;
let cursors;
let ratio;

let interactor;
let overlapObject;
class Dev extends Phaser.Scene {
  constructor() {
    super({
      key: 'Dev',
    });
  }

  preload() {
    this.load.spritesheet('ermine', '../../assets/image/_dev/playerErmine.png', {
      frameWidth: 500,
      frameHeight: 300,
    });
    this.load.image('bubble', '../../assets/image/_dev/Bullet.png');
  }

  create() {
    const canvasWidth = this.sys.game.canvas.width;
    const canvasHeight = this.sys.game.canvas.height;
    if (canvasWidth < canvasHeight) {
      ratio = canvasWidth / canvasHeight;
    } else {
      ratio = (canvasHeight * 1.5) / canvasWidth;
    }

    player = this.physics.add.sprite(canvasWidth / 2, 450, 'ermine');
    player.setCollideWorldBounds(true);
    player.setScale(0.5 * ratio);
    player.setBounce(0.2);

    this.anims.create({
      key: 'ermineAni',
      frames: this.anims.generateFrameNumbers('ermine', {
        start: 0,
        end: 1,
      }),
      frameRate: 10,
      repeat: -1,
    });

    // create overlap object
    overlapObject = this.physics.add
      .sprite(canvasWidth / 2, 250, 'bubble')
      .setCollideWorldBounds(true)
      .setScale(0.5 * ratio);

    if (canvasWidth < 600) {
      up = this.physics.add
        .sprite(50, 830, 'bubble')
        .setScale(0.5)
        .setSize(100, 100)
        .setInteractive();

      down = this.physics.add
        .sprite(150, 830, 'bubble')
        .setScale(0.5)
        .setSize(100, 100)
        .setCollideWorldBounds(true);

      // create interactor button for mobile
      interactor = this.physics.add
        .sprite(400, 830, 'bubble')
        .setScale(0.5)
        .setSize(100, 100)
        .setInteractive();

      // enable interactivity to interact button, if player overlap with overlapObject
      enableInteractivityOnOverlap(this, interactor, player, overlapObject);

      this.input.on('gameobjectdown', (pointer, gameObject) => {
        if (gameObject === up) {
          player.setGravityY(-200);
        }
        if (gameObject === down) {
          player.setVelocityY(1000);
        }
        // change scene to Forest1 if player overlap with overlapObject, and press interactor button
        changeSceneIf(gameObject === interactor, this.scene, 'Forest1');
      });

      this.input.on('gameobjectup', () => {
        player.body.setGravityY(200);
      });
    } else {
      cursors = this.input.keyboard.createCursorKeys();
      // create interactor button for desktop as enter key
      interactor = this.input.keyboard.addKey('ENTER');
    }
  }

  update(delta, time) {
    const canvasWidth = this.sys.game.canvas.width;
    player.anims.play('ermineAni', true);

    if (canvasWidth >= 600) {
      if (cursors.up.isDown) {
        player.setGravityY(-200);
      } else {
        player.body.setGravityY(200);
      }
      if (cursors.down.isDown) {
        player.setVelocityY(1000);
      }
      // change scene to Forest1 if player overlap with overlapObject, and press interactor button
      changeSceneIf(interactor.isDown, this.scene, 'Forest1');
    }
  }
}

export default Dev;
