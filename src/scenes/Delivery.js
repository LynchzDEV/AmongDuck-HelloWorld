import Phaser from 'phaser';
import path from 'path';
import {
  FOREGROUND_TEMPLE_PATH,
  BACKGROUND_GAME_PATH,
  COMPONENT_GAME_PATH,
  PLATFORM_GAME_PATH,
  SPRITESHEET_GAME_PATH,
  PLAYER_SPRITESHEET_PATH,
  UI_PATH,
} from '../utils/mapPath';
import {
  SKY_DEPTH,
  BACKGROUND_DEPTH,
  BACKGROUND_COMPONENT_DEPTH,
  MIDDLEGROUND_DEPTH,
  PLAYER_DEPTH,
  FOREGROUND_DEPTH,
} from '../utils/mapDepth';

import { setWorldBoundsAndCamera } from '../utils/setWorldAndCameraBound';

import playerMoveTemple from '../utils/playerMoveTemple';
import { OBJECT_SCROLL } from '../utils/mapObjectScroll';

import { shallowWater, playerDrown } from '../utils/event/drown';

const isMobile = /mobile/i.test(navigator.userAgent);
const tablet = window.innerWidth < 1280;

//bg component
let backgrounds;
let water;
let shallow_water;
let cloundLayer1;
let cloundLayer2;
let platforms;
let components;
// player
let player;
let camera;
//interactive
let milkShop;
let house;
let gate;
let milk1;
let sign;
//control flow
let left;
let right;
let up;
let isLeftPressed = false;
let isRightPressed = false;
let isUpPressed = false;

class Delivery extends Phaser.Scene {
  constructor() {
    super({
      key: 'Delivery',
    });
  }

  loadBackground() {
    this.load.image(
      'background',
      path.join(BACKGROUND_GAME_PATH, 'background-pink.png')
    );
    this.load.image(
      'clound-layer1',
      path.join(BACKGROUND_GAME_PATH, 'bg-pink-layer1.png')
    );
    this.load.image(
      'clound-layer2',
      path.join(BACKGROUND_GAME_PATH, 'bg-pink-layer2.png')
    );
  }
  loadPlatforms() {
    this.load.image('platform', path.join(PLATFORM_GAME_PATH, 'platform.png'));
    this.load.image(
      'tile-platfrom',
      path.join(PLATFORM_GAME_PATH, 'tile-platform.png')
    );
    this.load.image(
      'platform-long1',
      path.join(PLATFORM_GAME_PATH, 'platform-long1.png')
    );
    this.load.image(
      'platform-long2',
      path.join(PLATFORM_GAME_PATH, 'platform-long2.png')
    );
    this.load.image('ground', path.join(PLATFORM_GAME_PATH, 'ground.png'));
    this.load.image(
      'ground-edge',
      path.join(PLATFORM_GAME_PATH, 'ground-edge.png')
    );
    this.load.image(
      'ground-main',
      path.join(PLATFORM_GAME_PATH, 'ground-main.png')
    );
  }
  loadMainComponents() {
    this.load.image(
      'milk-shop',
      path.join(COMPONENT_GAME_PATH, 'milk-shop.png')
    );
    this.load.image('house', path.join(COMPONENT_GAME_PATH, 'house.png'));
    this.load.image('milk', path.join(COMPONENT_GAME_PATH, 'milk.png'));
    this.load.image('gate', path.join(COMPONENT_GAME_PATH, 'gate.png'));
    this.load.image(
      'gate-active',
      path.join(COMPONENT_GAME_PATH, 'gate-active.png')
    );
    this.load.sign = this.load.image(
      'sign',
      path.join(COMPONENT_GAME_PATH, 'sign.png')
    );
  }
  loadComponents() {
    this.load.image(
      'sakura-tree',
      path.join(COMPONENT_GAME_PATH, 'Sakura tree.png')
    );
    this.load.image(
      'small-sign',
      path.join(COMPONENT_GAME_PATH, 'small-sign.png')
    );
    this.load.image(
      'statue-stone',
      path.join(COMPONENT_GAME_PATH, 'statue-stone.png')
    );
    this.load.image(
      'stone-wall',
      path.join(COMPONENT_GAME_PATH, 'stone-wall.png')
    );
    this.load.image('stone', path.join(COMPONENT_GAME_PATH, 'stone.png'));
    this.load.image('bench', path.join(COMPONENT_GAME_PATH, 'bench.png'));
    this.load.image('lantern', path.join(COMPONENT_GAME_PATH, 'lantern.png'));
    this.load.image('grass', path.join(COMPONENT_GAME_PATH, 'grass.png'));
    this.load.image('vine', path.join(COMPONENT_GAME_PATH, 'vine.png'));
  }
  loadForeground() {
    this.load.image('water', path.join(FOREGROUND_TEMPLE_PATH, 'Water.png'));
    this.load.image(
      'shadow-platform',
      path.join(COMPONENT_GAME_PATH, 'shadow-short.png')
    );
    this.load.image(
      'shadow-platform-long2',
      path.join(COMPONENT_GAME_PATH, 'shadow-long2.png')
    );
    this.load.image(
      'shadow-platform-long1',
      path.join(COMPONENT_GAME_PATH, 'shadows.png')
    );
  }
  loadPlayer() {
    this.load.spritesheet(
      'player',
      path.join(PLAYER_SPRITESHEET_PATH, 'oposum.png'),
      {
        frameWidth: 36,
        frameHeight: 28,
      }
    );
  }
  loadUI() {
    //load button
    this.load.image('left', path.join(UI_PATH, 'left.png'));
    this.load.image('right', path.join(UI_PATH, 'right.png'));
    this.load.image('up', path.join(UI_PATH, 'up.png'));
  }

  preload() {
    this.loadBackground();
    this.loadForeground();
    this.loadPlatforms();
    this.loadMainComponents();
    this.loadComponents();
    this.loadPlayer();
    this.loadUI();
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
      .setScale(1.6)
      .setDepth(SKY_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.CLOUD - 0.1);
    //front clound
    cloundLayer1 = this.add
      .tileSprite(0, 0, mapWidth, mapHeight, 'clound-layer2')
      .setOrigin(0, 0)
      .setScale(1.6)
      .setDepth(SKY_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.CLOUD);
    // mid clound
    cloundLayer2 = this.add
      .tileSprite(0, 0, mapWidth, mapHeight, 'clound-layer1')
      .setOrigin(0, 0)
      .setScale(1.6)
      .setDepth(SKY_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.CLOUD2);

    backgrounds.add(bg);
    backgrounds.add(cloundLayer2);
    backgrounds.add(cloundLayer1);
  }
  //water and shadows
  addForeground(mapWidth, mapHeight) {
    shallow_water = shallowWater(
      this,
      0,
      mapHeight - 20,
      mapWidth * 2,
      200,
      BACKGROUND_COMPONENT_DEPTH
    );

    this.physics.add.existing(shallow_water);

    water = this.add
      .tileSprite(0, mapHeight - 200, mapWidth, 200, 'water')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);

    //add shadows
    this.add
      .image(1370, mapHeight - 80, 'shadow-platform')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
    this.add
      .image(1650, mapHeight - 80, 'shadow-platform-long1')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
    this.add
      .image(2110, mapHeight - 80, 'shadow-platform')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
    this.add
      .image(2380, mapHeight - 110, 'shadow-platform-long2')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
    this.add
      .image(mapWidth - 300, mapHeight - 80, 'shadow-platform')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
  }
  //platforms
  addPlatforms(floorHeight) {
    platforms = this.physics.add.staticGroup();
    let ground = this.add
      .tileSprite(0, floorHeight, 1383, 218, 'ground-main')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);

    let platformSmall = this.add
      .image(1405, 1100, 'platform')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);

    let platformVine = this.add
      .image(1355, 860, 'platform')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);

    let platformStatue_long = this.add
      .image(1659, 1002, 'platform-long1')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);

    let platformGlass = this.add
      .image(2124, 921, 'platform')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);

    let platformHouse = this.add
      .image(2375, 847, 'platform-long2')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);

    let platformGate = this.add
      .image(3549, 872, 'platform')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);

    let platformSakuraTree = this.add
      .image(929, 695, 'platform-long1')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);

    platforms.add(ground);
    platforms.add(platformSmall);
    platforms.add(platformVine);
    platforms.add(platformStatue_long);
    platforms.add(platformGlass);
    platforms.add(platformHouse);
    platforms.add(platformGate);
    platforms.add(platformSakuraTree);
    // Set collision boxes for each platform
    platforms.children.iterate((child) => {
      child.body.setSize(child.width, 20).setOffset(0, 0);
    });
  }

  //house, milk shop, milk, gate, sign
  addMainComponents() {
    components = this.add.group();
    milkShop = this.add
      .image(574, 884, 'milk-shop')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
    house = this.add
      .image(2620, 400, 'house')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
    milk1 = this.add
      .image(1102, 584, 'milk')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);
    gate = this.add
      .image(3650, 787, 'gate')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);
    gate.flipX = true;
    sign = this.add
      .image(2447, 701, 'sign')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);

    components.add(milkShop);
    components.add(house);
    components.add(milk1);
    components.add(gate);
    components.add(sign);
  }
  //prop
  addComponents() {
    //sakura milk shop
    this.add
      .image(141, 612, 'sakura-tree')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH - 1).flipX = true;
    this.add
      .image(700, 266, 'sakura-tree')
      .setOrigin(0, 0)
      .setScale(0.7)
      .setDepth(BACKGROUND_COMPONENT_DEPTH - 1);
    this.add
      .image(1704, 907, 'stone-wall')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH - 1);
    this.add
      .image(1950, 825, 'statue-stone')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH - 1);
    this.add
      .image(1075, 589, 'bench')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH - 1);
    this.add
      .image(1377, 818, 'stone')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH - 1);
    this.add
      .image(1430, 978, 'lantern')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH - 1);
    //add vine on platformVine
    this.add
      .image(1430, 865, 'vine')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH + 1);
    this.add
      .image(2178, 940, 'grass')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(PLAYER_DEPTH + 1);
    //sakura house
    this.add
      .image(2400, 238, 'sakura-tree')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH - 1);
  }
  //player and colider
  addPlayerAndColider(floorHeight) {
    //player
    player = this.physics.add
      .sprite(100, floorHeight - 150, 'player')
      .setCollideWorldBounds(true)
      .setScale(3)
      .setSize(30, 25)
      .setDepth(PLAYER_DEPTH);

    this.physics.add.collider(player, platforms);
  }
  //animations
  addAnimations() {
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

    // //water animation
    // this.anims.create({
    //   key: 'waterAnim',
    //   frames: this.anims.generateFrameNumbers('water', {
    //     start: 0,
    //     end: 5,
    //   }),
    //   frameRate: 5.5,
    //   repeat: -1,
    // });

    // //sakura animation
    // this.anims.create({
    //   key: 'sakura',
    //   frames: this.anims.generateFrameNumbers('sakura', {
    //     start: 0,
    //     end: 20,
    //   }),
    //   frameRate: 8,
    //   repeat: -1,
    // });
  }
  create() {
    //config
    const { width, height } = this.scale;
    // main scale
    const mapWidth = width * 3;
    const mapHeight = height * 2;

    //Dev scale 3840 * 1440
    // const mapWidth = width;
    // const mapHeight = height;

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

    //animations
    this.addAnimations();
    //background
    this.addBackgroundElements(mapWidth, mapHeight);
    //foreground
    this.addForeground(mapWidth, mapHeight);
    //platforms
    this.addPlatforms(floorHeight);
    //main components
    this.addMainComponents();
    //components pragob
    this.addComponents();
    //player and colider
    this.addPlayerAndColider(floorHeight);
  }

  update(delta, time) {
    //testing movement
    this.playerMoveTemple(player, 1000, false, false, null, null, null);
    //camera follow player
    camera.startFollow(player);
    //player drown
    playerDrown(this, player, shallow_water);
  }
}

export default Delivery;
