import Phaser from 'phaser';
import playerMoveTemple from '../utils/playerMoveTemple';
import { setWorldBoundsAndCamera } from '../utils/setWorldAndCameraBound';
import {
  BACKGROUND_COMPONENT_DEPTH,
  MIDDLEGROUND_DEPTH,
  SKY_DEPTH,
} from '../utils/mapDepth';
import { OBJECT_SCROLL } from '../utils/mapObjectScroll';

const isMobile = /mobile/i.test(navigator.userAgent);
const tablet = window.innerWidth < 1280;

let camera;
let water;
let backgrounds;
let cloundLayer1;
let cloundLayer2;
let platforms;
let components;
//gate
let gatePrevious;
let gateNext;
//interaction
let milk1;
let house;
let house2;
let chest;
let key;
let sign;
let ladder;
//player
let player;

class Delivery3 extends Phaser.Scene {
  constructor() {
    super('Delivery3');
  }

  setDeviceSpecificControls(height, width, camera) {
    //camera and control for each device
    if (isMobile || tablet) {
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

      //get screen width and height
      let screenWidth = window.innerWidth;
      let screenHeight = window.innerHeight;

      //device check
      if (isMobile) {
        //mobile
        if (screenHeight > 720) screenHeight = 720;
        console.log('Mobile view');
        console.log(`Screen Width: ${screenWidth}px`);
        console.log(`Screen Height: ${screenHeight}px`);

        left = this.physics.add
          .sprite(screenWidth / 2 - screenWidth / 3, screenHeight / 1.2, 'left')
          .setScale(5)
          .setSize(15, 15)
          .setInteractive()
          .setDepth(999)
          .setAlpha(0.7)
          .setScrollFactor(0);

        right = this.physics.add
          .sprite(
            screenWidth / 2 - screenWidth / 8,
            screenHeight / 1.2,
            'right'
          )
          .setScale(5)
          .setSize(15, 15)
          .setInteractive()
          .setDepth(999)
          .setAlpha(0.7)
          .setScrollFactor(0);

        up = this.physics.add
          .sprite(screenWidth / 2 + screenWidth / 3.5, screenHeight / 1.2, 'up')
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
      } else if (tablet) {
        //tablet
        if (screenHeight > 720) screenHeight = 720;
        console.log('Tablet view');
        console.log(`Screen Width: ${screenWidth}px`);
        console.log(`Screen Height: ${screenHeight}px`);

        left = this.physics.add
          .sprite(
            screenWidth / 2 - screenWidth / 2.5,
            screenHeight / 1.2,
            'left'
          )
          .setScale(7)
          .setSize(15, 15)
          .setInteractive()
          .setDepth(999)
          .setAlpha(0.7)
          .setScrollFactor(0);

        right = this.physics.add
          .sprite(
            screenWidth / 2 - screenWidth / 3.5,
            screenHeight / 1.2,
            'right'
          )
          .setScale(7)
          .setSize(15, 15)
          .setInteractive()
          .setDepth(999)
          .setAlpha(0.7)
          .setScrollFactor(0);

        up = this.physics.add
          .sprite(screenWidth - screenWidth / 8, screenHeight / 1.2, 'up')
          .setScale(7)
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
      }
    } else {
      //default (desktop)
      console.log('desktop');
      camera.setViewport(0, 0, width, height);
    }
  }
  addBackgroundElements(mapWidth, mapHeight) {
    backgrounds = this.add.group();
    let bg = this.add
      .tileSprite(0, 0, mapWidth, mapHeight, 'background')
      .setOrigin(0, 0)
      .setScale(1.4)
      .setDepth(SKY_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.CLOUD - 0.1);
    //mid clound
    cloundLayer1 = this.add
      .tileSprite(0, 0, mapWidth, mapHeight, 'clound-layer2')
      .setOrigin(0, 0)
      .setScale(1.4)
      .setDepth(SKY_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.CLOUD);
    // front
    cloundLayer2 = this.add
      .tileSprite(0, 0, mapWidth, mapHeight, 'clound-layer1')
      .setOrigin(0, 0)
      .setScale(1.4)
      .setDepth(SKY_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.CLOUD2);

    backgrounds.add(bg);
    backgrounds.add(cloundLayer2);
    backgrounds.add(cloundLayer1);
  }
  addPlatforms(floorHeight) {
    platforms = this.physics.add.staticGroup();
    let ground = this.add
      .image(0, floorHeight, 'ground-main3')
      .setOrigin(0, 0)
      .setDepth(MIDDLEGROUND_DEPTH);
    let platformHouse = this.add
      .image(647, 1230, 'platform-long4')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);
    //path to jump
    let platformToJump1 = this.add
      .image(2260, 1084, 'platform2')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);
    let platformToJump2 = this.add
      .image(2628, 986, 'platform')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);
    //this platform has jump boost
    let platformToJump3 = this.add
      .image(2890, 870, 'platform2')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);

    //path to gateNext
    let platformToGateNext1 = this.add
      .image(3275, 944, 'platform')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);
    //this platform has gate.
    let platformToGateNext2 = this.add
      .image(3445, 1230, 'platform2')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);

    //path to chest
    let platformToChest1 = this.add
      .image(1982, 391, 'platform')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);

    //path to milk
    let platformToMilk1 = this.add
      .image(477, 218, 'platform2')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);

    let ladderPlatform = this.add
      .image(3435, 231, 'platform2')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);

    platforms.add(ground);
    platforms.add(platformHouse);
    platforms.add(platformToJump1);
    platforms.add(platformToJump2);
    platforms.add(platformToJump3);
    platforms.add(platformToGateNext1);
    platforms.add(platformToGateNext2);
    platforms.add(platformToChest1);
    platforms.add(platformToMilk1);
    platforms.add(ladderPlatform);

    // Set collision boxes for each platform
    platforms.children.iterate((child) => {
      child.body.setSize(child.width, 20).setOffset(0, 0);
    });
  }
  addMainComponents() {
    //add gate
    gatePrevious = this.physics.add
      .image(52, 1140, 'gate-active')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);
    gateNext = this.physics.add
      .image(3640, 1140, 'gate')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);
    gateNext.flipX = true;
    house = this.add
      .image(1311, 720, 'house4')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
    house2 = this.add
      .image(845, 939, 'house3')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
    chest = this.add
      .sprite(2010, 291, 'chest')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
    //default chest frame
    chest.setFrame(21);

    key = this.add
      .image(2400, 1023, 'key')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
    sign = this.add
      .image(3456, 1088, 'sign')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
    milk1 = this.add
      .image(555, 107, 'milk')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
    ladder = this.add
      .image(3609, 0, 'ladder')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
  }
  create() {
    //config
    const { width, height } = this.scale;
    // main scale
    // const mapWidth = width * 3;
    // const mapHeight = height * 2;

    //Dev scale 3840 * 1440
    const mapWidth = width;
    const mapHeight = height;

    const floorHeight = mapHeight - 215;

    //binding function
    this.playerMoveTemple = playerMoveTemple;
    this.setWorldBoundsAndCamera = setWorldBoundsAndCamera;

    //setting world and camera
    const returnCamera = this.setWorldBoundsAndCamera(
      mapHeight,
      mapWidth,
      camera
    );
    camera = returnCamera;
    this.setDeviceSpecificControls(height, width, camera);
    //add background
    this.addBackgroundElements(mapWidth, mapHeight);
    //add platforms
    this.addPlatforms(floorHeight);
    //add main components
    this.addMainComponents();
  }

  update(delta, time) {
    //dev skip the scene
    // this.scene.start('Delivery4');
  }
}

export default Delivery3;
