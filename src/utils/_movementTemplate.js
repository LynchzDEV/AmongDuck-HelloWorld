import Phaser from 'phaser';
import calculateCanvasRatio from './ratio';

let background;
let player;
let camera;
let foreground;
let invisibleWall;

class MovementTemplate extends Phaser.Scene {
  constructor() {
    super({
      key: 'MovementTemplate',
    });
  }

  preload() {
    this.load.image('background', 'src/image/_dev/backGround.png');
    this.load.image('foreground', 'src/image/_dev/playermeow.jpg');
    this.load.image('invisibleWall', 'src/image/_dev/football.png'); //invisible wall
    this.load.spritesheet('player', 'src/image/_dev/playerSpritesheet.png', {
      frameWidth: 669,
      frameHeight: 569,
    });
  }

  create() {
    const ratio = calculateCanvasRatio(this.sys);
    const width = ratio.canvasWidth;
    const height = ratio.canvasHeight;
    background = this.add
      .tileSprite(0, 0, width, height, 'background')
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setScale(1)
      .setDepth(-1);
    foreground = this.add
      .image(0, height - 100, 'foreground')
      .setOrigin(0, 0)
      .setScrollFactor(1)
      .setScale(0.5)
      .setDepth(1);
    player = this.physics.add
      .sprite(width / 2, height / 1.5, 'player')
      .setScale(0.3)
      .setSize(200, 200)
      .setCollideWorldBounds(true)
      .setDepth(0);

    camera = this.cameras.main
      .setViewport(0, 0, width, height)
      .setBounds(0, 0, width, height)
      .setScroll(0, 0)
      .setZoom(1.5);

    invisibleWall = this.add
      .image(0, 0, 'invisibleWall')
      .setOrigin(0, 0)
      .setScale(width, 0.3);
    this.physics.add.world.enable(invisibleWall);
    invisibleWall.body.setImmovable(true);

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
  }

  playerMove(player) {
    const cursors = this.input.keyboard.createCursorKeys();
    let velocityX = 0;
    let velocityY = 0;
    const normalSpeed = 100;
    if (cursors.left.isDown) {
      velocityX = -normalSpeed;
      player.setFlipX(true);
    } else if (cursors.right.isDown) {
      velocityX = normalSpeed;
      player.setFlipX(false);
    }

    if (cursors.up.isDown) {
      velocityY = -normalSpeed;
    } else if (cursors.down.isDown) {
      velocityY = normalSpeed;
    }

    const twoDimentionalSpeed = 70;
    // Check for diagonal movement
    if (cursors.left.isDown && cursors.up.isDown) {
      velocityX = -twoDimentionalSpeed;
      velocityY = -twoDimentionalSpeed;
    } else if (cursors.left.isDown && cursors.down.isDown) {
      velocityX = -twoDimentionalSpeed;
      velocityY = twoDimentionalSpeed;
    } else if (cursors.right.isDown && cursors.up.isDown) {
      velocityX = twoDimentionalSpeed;
      velocityY = -twoDimentionalSpeed;
    } else if (cursors.right.isDown && cursors.down.isDown) {
      velocityX = twoDimentionalSpeed;
      velocityY = twoDimentionalSpeed;
    }

    player.setVelocity(velocityX, velocityY);
    player.anims.play('walk', velocityX !== 0 || velocityY !== 0);
  }

  // changeScene() {
  //   this.scene.start('Forest1');
  // }

  update(delta, time) {
    camera.startFollow(player);
    this.playerMove(player);
    background.tilePositionX = this.cameras.main.scrollX * 0.5;
    background.tilePositionY = this.cameras.main.scrollY * 0.5;
    // this.time.delayedCall(1000, this.changeScene, [], this);
  }
}

export default MovementTemplate;
