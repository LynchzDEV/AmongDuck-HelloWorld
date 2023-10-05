// Import necessary modules and functions
import Phaser from 'phaser';
import calculateCanvasRatio from '../utils/ratio';
import playerMove from '../utils/playerMove';

// Declare variables for game elements
let background;
let foreground;
let player;
let camera;
let invisibleWall;
let sign;
let cursors;
let up;
let down;

// Create a Phaser scene called 'Forest1'
class Forest1 extends Phaser.Scene {
  constructor() {
    super({
      key: 'Forest1',
    });
  }

  // Preload game assets
  preload() {
    this.load.image('background', 'assets/image/_dev/backGround.png');
    this.load.image('foreground', 'assets/image/_dev/playermeow.jpg');
    this.load.image('invisibleWall', 'assets/image/_dev/football.png');
    this.load.spritesheet('player', 'assets/image/_dev/playerSpritesheet.png', {
      frameWidth: 669,
      frameHeight: 569,
    });
    this.load.image('sign', 'assets/image/_dev/basketball.png');
    this.load.image('bubble', 'assets/image/_dev/Bullet.png');
  }

  // Create game elements and set up the scene
  create() {
    this.playerMove = playerMove;
    const { width, height, centerX, centerY, ratio } = calculateCanvasRatio(
      this.sys
    );
    cursors = this.input.keyboard.createCursorKeys();

    // Create the background with a tile sprite
    background = this.add
      .tileSprite(0, 0, width * 2, height, 'background')
      .setOrigin(0, 0)
      .setScale(1)
      .setScrollFactor(0)
      .setDepth(-1);

    // Create the foreground image
    foreground = this.add
      .image(0, height / 1.4, 'foreground')
      .setOrigin(0, 0)
      .setScrollFactor(1)
      .setScale(0.5)
      .setDepth(1);

    // Create the player character as a physics sprite
    player = this.physics.add
      .sprite(width / 2, height / 1.5, 'player')
      .setScale(0.3)
      .setSize(200, 200)
      .setCollideWorldBounds(true)
      .setDepth(0);

    // Create the camera and set its properties
    camera = this.cameras.main
      .setViewport(0, 0, width, height)
      .setBounds(0, 0, width * 2, height)
      .setZoom(1.5);

    // Create a sign as a physics image
    sign = this.physics.add
      .image(width * 2 - 200, height / 1.5, 'sign')
      .setScale(0.1)
      .setDepth(0);

    sign.setImmovable(true);

    // Add collision between player and sign
    this.physics.add.collider(player, sign, () => {
      console.log('collide');
    });

    // Set the world bounds for physics
    this.physics.world.setBounds(0, 0, width * 2, height);

    // Create player animation
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('player', {
        start: 0,
        end: 7,
      }),
      frameRate: 5,
      repeat: -1,
    });

    // Add collision between player and invisible wall (commented out in the original code)
    // this.physics.add.collider(player, invisibleWall);
    //!-----------------------------------!//
    up = this.physics.add
      .sprite(centerX - 150, centerY + 300, 'bubble')
      .setScale(0.5)
      .setSize(150, 150)
      .setInteractive()
      .setDepth(2);

    down = this.physics.add
      .sprite(centerX - 50, centerY + 300, 'bubble')
      .setScale(0.5)
      .setSize(150, 150)
      .setInteractive()
      .setDepth(2);
    //!-----------------------------------!//
  }

  // Change the scene (not implemented in the original code)
  changeScene() {
    this.scene.start('Forest1');
  }

  // Update function called in the game loop
  update(delta, time) {
    const { width, height, centerX, centerY, ratio } = calculateCanvasRatio(
      this.sys
    );
    // Make the camera follow the player
    camera.startFollow(player);

    // Call the playerMove function to move the player
    this.playerMove(player, 2000);

    // Update the background tile position for parallax scrolling
    background.tilePositionX = camera.scrollX * 0.3;
    background.tilePositionY = camera.scrollY * 0.3;


    // down.x = camera.ScrollX + centerX + 20; // Adjust the X position as needed
    // down.y = camera.ScrollY + centerY + 120; // Adjust the Y position as needed
  }
}

export default Forest1;
