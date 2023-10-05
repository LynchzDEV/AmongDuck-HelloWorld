import Phaser from 'phaser';
import calculateCanvasRatio from '../utils/ratio';
import playerMove from '../utils/playerMove';

let background;
let foreground;
let player;
let camera;
let invisibleWall;
let sign;

// Controls [Desktop]
let cursors;

// Controls [Mobile & Tablet]
let left;
let right;
let isLeftPressed = false;
let isRightPressed = false;

class Forest1 extends Phaser.Scene {
  constructor() {
    super({
      key: 'Forest1',
    });
  }

  preload() {
    this.load.image('background', 'src/image/_dev/backGround.png');
    this.load.image('foreground', 'src/image/_dev/playermeow.jpg');
    this.load.image('invisibleWall', 'src/image/_dev/football.png');
    this.load.spritesheet('player', 'src/image/_dev/playerSpritesheet.png', {
      frameWidth: 669,
      frameHeight: 569,
    });
    this.load.image('sign', 'src/image/_dev/basketball.png');
  }

  create() {
    this.playerMove = playerMove;
    const { width, height, centerX, centerY, ratio } = calculateCanvasRatio(
      this.sys
    );
    cursors = this.input.keyboard.createCursorKeys();

    //world bound
    this.physics.world.setBounds(0, 0, width * 2, height);

    //player
    player = this.physics.add
      .sprite(width / 2, height / 1.5, 'player')
      .setScale(0.3)
      .setSize(500, 500)
      .setCollideWorldBounds(true)
      .setDepth(0);

    //background
    background = this.add
      .tileSprite(0, 0, width, height, 'background')
      .setOrigin(0, 0)
      .setScale(1)
      .setScrollFactor(0)
      .setDepth(-1);

    //foreground
    foreground = this.add
      .image(0, height / 1.4, 'foreground')
      .setOrigin(0, 0)
      .setScrollFactor(1)
      .setScale(0.5)
      .setDepth(1);

    //camera
    camera = this.cameras.main
      .setViewport(0, 0, width, height)
      .setBounds(0, 0, width * 2, height)
      .setZoom(1.5);

    sign = this.physics.add
      .image(width * 2 - 200, height / 1.2, 'sign')
      .setScale(0.1)
      .setDepth(-1);
    sign.setImmovable(true);

    this.physics.add.collider(player, sign, () => {
      console.log('collide');
    });

    //animations
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('player', {
        start: 0,
        end: 7,
      }),
      frameRate: 5,
      repeat: -1,
    });
    this.physics.add.collider(player, invisibleWall);

    if (isDevice()) {

    }

  }

  changeScene() {
    this.scene.start('Forest1');
  }

  update(delta, time) {
    this.playerMove(player, 200);
    console.log(player.x, player.y);

    //parallax background and follow player
    camera.startFollow(player);
    background.tilePositionX = camera.scrollX * 0.4;
    background.tilePositionY = camera.scrollY * 0.4;
  }
}

export default Forest1;
