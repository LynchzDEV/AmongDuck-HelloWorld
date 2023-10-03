import Phaser from 'phaser';
import calculateCanvasRatio from '../utils/ratio';
import playerMove from '../utils/playerMove';

let background;
let foreground;
let player;
let camera;
let invisibleWall;
let cursors;

class Forest1 extends Phaser.Scene {
  constructor() {
    super({
      key: 'Forest1',
    });
  }

  preload() {
    this.load.image("background", "src/image/_dev/backGround.png");
    this.load.image("foreground", "src/image/_dev/playermeow.jpg");
    this.load.image("invisibleWall", "src/image/_dev/football.png"); //invisible wall
    this.load.spritesheet("player", "src/image/_dev/playerSpritesheet.png", {
      frameWidth: 669,
      frameHeight: 569,
    });
  }

  create() {
    this.playerMove = playerMove; //Binding function to scene
    const ratio = calculateCanvasRatio(this.sys);
    const width = ratio.canvasWidth;
    const height = ratio.canvasHeight;
    cursors = this.input.keyboard.createCursorKeys();

    background = this.add
      .tileSprite(0, 0, width*2, height, "background")
      .setOrigin(0, 0)
      .setScale(1)
      .setScrollFactor(0)
      .setDepth(-1);
    foreground = this.add
      .image(0, height/1.4, "foreground")
      .setOrigin(0, 0)
      .setScrollFactor(1)
      .setScale(0.5)
      .setDepth(1);
    player = this.physics.add
      .sprite(width/ 2, height/1.5, "player")
      .setScale(0.3)
      .setSize(200, 200)
      .setCollideWorldBounds(true)
      .setDepth(0);

    camera = this.cameras.main
      .setViewport(0, 0, width, height)
      .setBounds(0, 0, width*2, height)
      .setZoom(1.5);

      
      //wait for next pull request
    // invisibleWall = this.add
    //   .image(0, 0, "invisibleWall")
    //   .setOrigin(0, 0)
    //   .setScrollFactor(0)
    //   .setScale(width, 0.3);
    // this.physics.add.world.enable(invisibleWall);
    // invisibleWall.body.setImmovable(true);
    this.physics.world.setBounds(0, 0, width*2, height);

    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("player", {
        start: 0,
        end: 7,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.physics.add.collider(player, invisibleWall);
  }

  changeScene() {
    this.scene.start("Forest1");
  }

  update(delta, time) {
    camera.startFollow(player);
    this.playerMove(player, 200);
    console.log(player.x, player.y)
    background.tilePositionX = camera.scrollX * 0.3;
    background.tilePositionY = camera.scrollY * 0.3;
    // console.log(background.tilePositionY)
    // this.time.delayedCall(1000, this.changeScene, [], this);
  }
}

export default Forest1;