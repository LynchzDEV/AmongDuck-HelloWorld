import Phaser from 'phaser';

let player;
let up;
let down;

class _dev extends Phaser.Scene {
  constructor() {
    super({
      key: 'GameScene',
    });
  }

  preload() {
    this.load.spritesheet('ermine', 'src/image/_dev/playerErmine.png', {
      frameWidth: 500,
      frameHeight: 300,
    });
    this.load.image('bubble', 'src/image/_dev/Bullet.png');
  }

  create() {
    player = this.physics.add.sprite(100, 450, 'ermine');
    player.setCollideWorldBounds(true);

    this.anims.create({
      key: 'ermineAni',
      frames: this.anims.generateFrameNumbers('ermine', {
        start: 0,
        end: 1,
      }),
      frameRate: 10,
      repeat: -1,
    });

    up = this.physics.add
      .sprite(50, 830, 'bubble')
      .setScale(0.5)
      .setSize(100, 100)
      .setCollideWorldBounds(true);

    down = this.physics.add
      .sprite(150, 830, 'bubble')
      .setScale(0.5)
      .setSize(100, 100)
      .setCollideWorldBounds(true);

    up.setInteractive();
    down.setInteractive();

    this.input.on('gameobjectdown', (pointer, gameObject) => {
      if (gameObject === up) {
        player.setGravityY(-200);
      } else if (gameObject === down) {
        player.setVelocityY(1000);
      }
    });

    this.input.on('gameobjectup', () => {
      player.body.setGravityY(200);
    });
  }

  update(delta, time) {
    player.anims.play('ermineAni', true);
  }
}

export default _dev;
