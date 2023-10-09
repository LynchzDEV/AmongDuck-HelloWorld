import Phaser from 'phaser';
import path from 'path';
import {
  BACKGROUND_TEMPLE_PATH,
  FOREGROUND_TEMPLE_PATH,
  COMPONENT_TEMPLE_PATH,
} from '../utils/mapPath';
import {
  SKY_DEPTH,
  BACKGROUND_DEPTH,
  BACKGROUND_COMPONENT_DEPTH,
  MIDDLEGROUND_DEPTH,
  PLAYER_DEPTH,
  FOREGROUND_DEPTH,
} from '../utils/mapDepth';
import { OBJECT_SCROLL } from '../utils/mapObjectScroll';
import playerMoveTemple from '../utils/playerMoveTemple';

const spritesheet_path = path.join(
  'assets',
  'image',
  'Sunny-land-files',
  'spritesheets'
);

const isMobile = /mobile/i.test(navigator.userAgent);
const isSmallScreen = window.innerWidth < 1280;

let background;
let foreground;
let components;
let camera;
let player;
let clouds;

let left;
let right;
let up;
let isLeftPressed = false;
let isRightPressed = false;
let isUpPressed = false;

class Temple extends Phaser.Scene {
  constructor() {
    super('Temple');
  }

  preload() {
    //load background
    this.load.image('sky', path.join(BACKGROUND_TEMPLE_PATH, 'Sky.png'));
    this.load.image('City', path.join(BACKGROUND_TEMPLE_PATH, 'City.png'));
    this.load.image('Clouds', path.join(BACKGROUND_TEMPLE_PATH, 'Clouds.png'));
    this.load.image(
      'fuji',
      path.join(BACKGROUND_TEMPLE_PATH, 'Volcano fuji.png')
    );
    this.load.image(
      'bgTree',
      path.join(BACKGROUND_TEMPLE_PATH, 'Background Trees.png')
    );
    this.load.image('bushes', path.join(BACKGROUND_TEMPLE_PATH, 'Bushes.png'));
    this.load.image(
      'peddlerCar',
      path.join(COMPONENT_TEMPLE_PATH, 'Trading Cart.png')
    );
    this.load.image('ground', path.join(COMPONENT_TEMPLE_PATH, 'ground.png'));

    //load foreground
    this.load.image(
      'tree',
      path.join(FOREGROUND_TEMPLE_PATH, 'Sakura Tree.png')
    );
    this.load.image('water', path.join(FOREGROUND_TEMPLE_PATH, 'Water.png'));

    // load components
    this.load.image('House', path.join(COMPONENT_TEMPLE_PATH, 'House.png'));
    this.load.image('torii', path.join(COMPONENT_TEMPLE_PATH, 'Arc.png'));

    //load player
    this.load.spritesheet('player', path.join(spritesheet_path, 'oposum.png'), {
      frameWidth: 36,
      frameHeight: 28,
    });

    //load button
    this.load.image('left', path.join('assets', 'ui', 'left.png'));
    this.load.image('right', path.join('assets', 'ui', 'right.png'));
    this.load.image('up', path.join('assets', 'ui', 'up.png'));
  }

  create() {
    //config
    const { width, height } = this.scale;
    const mapWidth = width * 4;
    const mapHeight = height;
    const floorHeight = height - 330;

    //setting world bounds
    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);

    //set collision L, R, T, B
    this.physics.world.setBoundsCollision(true, true, true, true);

    //setting camera
    camera = this.cameras.main;
    camera.setBounds(0, 0, mapWidth, mapHeight);

    this.playerMoveTemple = playerMoveTemple;

    //camera and control for each device
    //I don't know why mobile always return true on chorme dev tool (I just use && for this reason)
    if (isMobile && isSmallScreen) {
      this.input.on('gameobjectdown', (pointer, gameObject) => {
        if (gameObject === left) {
          isLeftPressed = true;
        }
        if (gameObject === right) {
          isRightPressed = true;
        }
        if (gameObject === up) {
          isUpPressed = true;
        }
      });

      this.input.on('gameobjectup', (pointer, gameObject) => {
        if (gameObject === left) {
          isLeftPressed = false;
        }
        if (gameObject === right) {
          isRightPressed = false;
        }
        if (gameObject === up) {
          isUpPressed = false;
        }
      });
      if (isMobile && window.innerWidth <= 728) {
        //mobile
        let screenWidth = window.innerWidth; // Get the width of the browser window
        let screenHeight = window.innerHeight; // Get the height of the browser window
        if (screenHeight > 720) screenHeight = 720;
        console.log('Mobile view');
        console.log(`Screen Width: ${screenWidth}px`);
        console.log(`Screen Height: ${screenHeight}px`);

        left = this.physics.add
          .sprite(screenWidth / 2 - 100, screenHeight / 1.2, 'left')
          .setScale(5)
          .setSize(15, 15)
          .setInteractive()
          .setDepth(999)
          .setAlpha(0.7)
          .setScrollFactor(0);

        right = this.physics.add
          .sprite(screenWidth / 2, screenHeight / 1.2, 'right')
          .setScale(5)
          .setSize(15, 15)
          .setInteractive()
          .setDepth(999)
          .setAlpha(0.7)
          .setScrollFactor(0);

        up = this.physics.add
          .sprite(screenWidth / 2 + 100, screenHeight / 1.2, 'up')
          .setScale(5)
          .setSize(15, 15)
          .setInteractive()
          .setDepth(999)
          .setAlpha(0.7)
          .setScrollFactor(0);

        //Implement mobile camera bounds and viewport
        camera.setViewport(
          width / 2 - screenWidth / 2,
          height / 2 - screenHeight / 2,
          screenWidth,
          screenHeight
        );
        camera.setZoom(1);
      } else if (isSmallScreen) {
        //tablet
        let screenWidth = window.innerWidth; // Get the width of the browser window
        let screenHeight = window.innerHeight; // Get the height of the browser window
        if (screenHeight > 720) screenHeight = 720;
        console.log('Tablet view');
        console.log(`Screen Width: ${screenWidth}px`);
        console.log(`Screen Height: ${screenHeight}px`);

        left = this.physics.add
          .sprite(screenWidth / 2 - screenWidth / 4, screenHeight / 1.4, 'left')
          .setScale(5)
          .setSize(15, 15)
          .setInteractive()
          .setDepth(999)
          .setAlpha(0.7)
          .setScrollFactor(0);

        right = this.physics.add
          .sprite(
            screenWidth / 2 - screenWidth / 6,
            screenHeight / 1.4,
            'right'
          )
          .setScale(5)
          .setSize(15, 15)
          .setInteractive()
          .setDepth(999)
          .setAlpha(0.7)
          .setScrollFactor(0);

        up = this.physics.add
          .sprite(screenWidth - screenWidth / 4, screenHeight / 1.4, 'up')
          .setScale(5)
          .setSize(15, 15)
          .setInteractive()
          .setDepth(999)
          .setAlpha(0.7)
          .setScrollFactor(0);

        //Implement tablet camera bounds and viewport
        camera.setViewport(
          width / 2 - screenWidth / 2,
          height / 2 - screenHeight / 2,
          screenWidth,
          height
        );
        camera.setZoom(1.5);
      }
    } else {
      //default (desktop)
      console.log('desktop');
      camera.setViewport(0, 0, width, height);
    }

    //clouds
    clouds = this.add
      .tileSprite(0, 0, mapWidth, mapHeight, 'Clouds')
      .setOrigin(0, 0)
      .setScale(0.7)
      .setDepth(SKY_DEPTH + 1)
      .setScrollFactor(OBJECT_SCROLL.CLOUD);

    //background
    background = this.add.group();
    let sky = this.add
      .tileSprite(0, 0, mapWidth, mapHeight, 'sky')
      .setOrigin(0, 0)
      .setScale(1, 0.7)
      .setDepth(SKY_DEPTH)
      .setScrollFactor(0);

    let city = this.add
      .tileSprite(-100, floorHeight - 200, 550, 200, 'City')
      .setOrigin(0, 0)
      .setScale(1.5)
      .setDepth(BACKGROUND_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.BG);

    let fuji = this.add
      .image(mapWidth - 2200, floorHeight - 250, 'fuji')
      .setOrigin(0, 0)
      .setScale(1.5)
      .setDepth(BACKGROUND_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.BG);

    let bgTree = this.add
      .tileSprite(-100, floorHeight + 20, mapWidth * 2, 180, 'bgTree')
      .setOrigin(0, 0)
      .setScale(0.7)
      .setDepth(BACKGROUND_COMPONENT_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.BG);

    let brush1 = this.add
      .image(500, floorHeight - 50, 'bushes')
      .setOrigin(0, 0)
      .setScale(2)
      .setDepth(BACKGROUND_COMPONENT_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.BG);

    let brush2 = this.add
      .image(mapWidth / 2 - 800, floorHeight - 50, 'bushes')
      .setOrigin(0, 0)
      .setScale(2)
      .setDepth(BACKGROUND_COMPONENT_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.BG);
    brush2.flipX = true;

    let brush3 = this.add
      .image(mapWidth / 2, floorHeight - 50, 'bushes')
      .setOrigin(0, 0)
      .setScale(2)
      .setDepth(BACKGROUND_COMPONENT_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.BG);

    let peddlerCar = this.add
      .image(700, floorHeight - 40, 'peddlerCar')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.PLAYER);

    background.add(sky);
    background.add(city);
    background.add(clouds);
    background.add(fuji);
    background.add(bgTree);
    background.add(peddlerCar);
    background.add(brush1);
    background.add(brush2);
    background.add(brush3);

    //components background
    components = this.physics.add.group();
    let house = this.add
      .image(mapWidth / 2 - 620, floorHeight - 220, 'House')
      .setOrigin(0, 0)
      .setScale(0.8)
      .setDepth(PLAYER_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.PLAYER);

    let torii = this.add
      .image(mapWidth / 2 + 900, floorHeight - 100, 'torii')
      .setOrigin(0, 0)
      .setScale(0.7)
      .setDepth(PLAYER_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.PLAYER);

    components.add(house);
    components.add(torii);

    //player
    player = this.physics.add
      .sprite(300, height - 300, 'player')
      .setCollideWorldBounds(true)
      .setScale(3)
      .setDepth(PLAYER_DEPTH);

    //ground physics
    const grounds = this.physics.add.staticGroup();
    let ground = this.add
      .tileSprite(-100, floorHeight + 100, mapWidth * 2, 60, 'ground')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(PLAYER_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.PLAYER);

    grounds.add(ground);
    this.physics.add.collider(player, grounds);

    //foreground
    foreground = this.add.group();
    let water = this.add
      .tileSprite(-100, 450, mapWidth * 2, 250, 'water')
      .setOrigin(0, 0)
      .setScale(1.1)
      .setDepth(FOREGROUND_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.PLAYER);

    let tree = this.add
      .tileSprite(-100, 300, mapWidth * 4, mapHeight * 2, 'tree')
      .setOrigin(0, 0)
      .setScale(0.5)
      .setDepth(FOREGROUND_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.FG);

    foreground.add(tree);
    foreground.add(water);

    //animations for testing
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('player', {
        start: 0,
        end: 5,
      }),
      frameRate: 10,
      repeat: -1,
    });
  }

  update() {
     //I don't know why mobile always return true on chorme dev tool (I just use && for this reason)
    if (isMobile && isSmallScreen) {
      this.playerMoveTemple(
        player,
        500,
        false,
        true,
        isLeftPressed,
        isRightPressed,
        isUpPressed
      );
    } else {
      this.playerMoveTemple(player, 500, false, false, null, null, null);
    }

    camera.startFollow(player);
    
    //scrolling background
    clouds.tilePositionX += 0.1;
  }
}
export default Temple;
