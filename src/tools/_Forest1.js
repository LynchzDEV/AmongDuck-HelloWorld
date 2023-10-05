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
let isUpPressed = false;
let isDownPressed = false;
let mainCamera;
let text;

// const isMobile = navigator.userAgentData.mobile;

// Create a Phaser scene called 'Forest1'
class ForestDev extends Phaser.Scene {
  constructor() {
    super({
      key: 'ForestDev',
    });
  }

  // Preload game assets
  preload() {
    this.load.image('background', 'src/image/_dev/backGround.png');
    this.load.image('foreground', 'src/image/_dev/playermeow.jpg');
    this.load.image('invisibleWall', 'src/image/_dev/football.png');
    this.load.spritesheet('player', 'src/image/_dev/playerSpritesheet.png', {
      frameWidth: 669,
      frameHeight: 569,
    });
    this.load.image('sign', 'src/image/_dev/basketball.png');
    this.load.image('bubble', 'src/image/_dev/Bullet.png');
  }

  // Create game elements and set up the scene
  create() {
    this.playerMove = playerMove;
    const { width, height, centerX, centerY, ratio } = calculateCanvasRatio(
      this.sys
    );

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
      // .setViewport(0, 0, width, height)
      // .setBounds(0, 0, width * 2, height)
      .setZoom(1.5);

    // Create a sign as a physics image
    sign = this.physics.add
      .image(width * 2 - 200, height / 1.5, 'sign')
      .setScale(0.1)
      .setDepth(99);

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
    //* MOBILE SITE AND TABLET SITE *//
    if (/mobile/i.test(navigator.userAgent) || window.innerWidth < 1280) {
      up = this.physics.add
        .sprite(0, 0, 'bubble')
        .setScale(0.5)
        .setSize(150, 150)
        .setInteractive()
        .setDepth(999)
        .setAlpha(0.3);

      down = this.physics.add
        .sprite(0, 0, 'bubble')
        .setScale(0.5)
        .setSize(150, 150)
        .setInteractive()
        .setDepth(999)
        .setAlpha(0.3);

      this.input.on('gameobjectdown', (pointer, gameObject) => {
        if (gameObject === up) {
          isUpPressed = true;
        }
        if (gameObject === down) {
          isDownPressed = true;
        }
      });

      this.input.on('gameobjectup', (pointer, gameObject) => {
        if (gameObject === up) {
          isUpPressed = false;
        }
        if (gameObject === down) {
          isDownPressed = false;
        }
      });
    } else if (/ipad|tablet/i.test(navigator.userAgent)) {
    } else {
      cursors = this.input.keyboard.createCursorKeys();
    }

    //!-----------------------------------!//

    const textStyle = {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#ffffff',
    };
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

    const offsetY = 180;

    const upY = player.y + offsetY;
    const downY = player.y + offsetY;

    const screenY = height - 50; // Adjust this value as needed

    // Update the background tile position for parallax scrolling
    background.tilePositionX = camera.scrollX * 0.3;
    background.tilePositionY = camera.scrollY * 0.3;

    // console.log(window.innerWidth, window.innerHeight);
    // console.log(camera.scrollX, camera.scrollY);
    if (/mobile/i.test(navigator.userAgent) || window.innerWidth < 1280) {
      if (/mobile/i.test(navigator.userAgent)) {
        up.x = camera.scrollX + 550;
        up.y = Math.max(0, Math.min(upY, screenY));
        down.x = camera.scrollX + 650;
        down.y = Math.max(0, Math.min(downY, screenY));
      } else {
        up.x = camera.scrollX + 300;
        up.y = Math.max(0, Math.min(upY, screenY));
        down.x = camera.scrollX + 400;
        down.y = Math.max(0, Math.min(downY, screenY));
      }

      if (isUpPressed) {
        player.setVelocityX(-200);
        player.anims.play('walk', true);
        player.setFlipX(true);
        console.log('up');
      }
      if (isDownPressed) {
        player.setVelocityX(200);
        player.anims.play('walk', true);
        player.setFlipX(false);
        console.log('down');
      }
      if (!isUpPressed && !isDownPressed) {
        player.setVelocityX(0);
        player.anims.play('walk', false);
        // console.log('stop');
      }
    } else {
      this.playerMove(player, 2000);
    }
  }
}

export default ForestDev;
