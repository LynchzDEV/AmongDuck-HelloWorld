import Phaser from 'phaser';
import playerMoveTemple from '../utils/playerMoveTemple';
import setWorldBoundsAndCamera from '../utils/setWorldAndCameraBound';
import path from 'path';
import {
  BACKGROUND_GAME_PATH,
  PLATFORM_GAME_PATH,
  SPRITESHEET_GAME_PATH,
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

let backgrounds;
let cloundLayer1;
let cloundLayer2;
let platforms;
//slide platform
let platformSlide1;
let platformSlide2;
//gate
let gatePrevios;
let gateNext;
//interaction
let key;
let chess;
let house;
//player
let player;

class Delivery2 extends Phaser.Scene {
  constructor() {
    super({
      key: 'Delivery2',
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
      'platform-long1',
      path.join(PLATFORM_GAME_PATH, 'platform-long1.png')
    );
    this.load.image(
      'platform-long2',
      path.join(PLATFORM_GAME_PATH, 'platform-long2.png')
    );
    this.load.image(
      'platform-long3',
      path.join(PLATFORM_GAME_PATH, 'platform-long3.png')
    );
    this.load.image(
      'ground-main',
      path.join(PLATFORM_GAME_PATH, 'ground-main.png')
    );
  }
  loadMainComponents() {
    this.load.image('house2', path.join(COMPONENT_GAME_PATH, 'house2.png'));
    this.load.image('gate', path.join(COMPONENT_GAME_PATH, 'gate.png'));
    this.load.image(
      'gate-active',
      path.join(COMPONENT_GAME_PATH, 'gate-active.png')
    );
    this.load.image('key', path.join(COMPONENT_GAME_PATH, 'key.png'));
    this.load.spritesheet(
      'chess',
      path.join(SPRITESHEET_GAME_PATH, 'chess.png'),
      {
        frameWidth: 128,
        frameHeight: 128,
      }
    );
  }

  preload() {
    this.loadBackground();
    this.loadPlatforms();
    this.loadMainComponents();
  }

  addBackgroundElements(mapWidth, mapHeight) {
    backgrounds = this.add.group();
    let bg = this.add
      .tileSprite(0, 0, mapWidth, mapHeight, 'background')
      .setOrigin(0, 0)
      .setScale(1.6)
      .setDepth(SKY_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.CLOUD - 0.1);
    //mid clound
    cloundLayer1 = this.add
      .tileSprite(0, 0, mapWidth, mapHeight, 'clound-layer2')
      .setOrigin(0, 0)
      .setScale(1.6)
      .setDepth(SKY_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.CLOUD);
    // front
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
  //add platforms
  addPlatforms(floorHeight) {
    platforms = this.physics.add.staticGroup();
    let ground = this.add
      .tileSprite(-810, floorHeight, 1383, 218, 'ground-main')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);
    platformSlide1 = this.add
      .image(573, 1230, 'platform')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);
    let platformHouse = this.add
      .image(1294, 1236, 'platform-long3')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);

    //path to key
    let platformToKey1 = this.add
      .image(2268, 1142, 'platform')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);
    let platformToKey2 = this.add
      .image(2600, 1032, 'platform-long1')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);
    platformSlide2 = this.add
      .image(3066, 893, 'platform')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);
    let platformToKey3 = this.add
      .image(2804, 582, 'platform')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);
    //key on this platform
    let platformToKey4 = this.add
      .image(2343, 458, 'platform-long1')
      .setOrigin(0, 0)
      .setScale(0.8, 1)
      .setDepth(MIDDLEGROUND_DEPTH);

    //path to chess
    let platformToChess1 = this.add
      .image(1069, 1068, 'platform')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);
    let platformToChess2 = this.add
      .image(625, 940, 'platform-long1')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);
    let platformToChess3 = this.add
      .image(353, 810, 'platform')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);
    let platformToChess4 = this.add
      .image(84, 717, 'platform')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);

    //gate on this platform
    let platformGate = this.add
      .image(3418, 360, 'platform-long1')
      .setOrigin(0, 0)
      .setScale(0.8, 1)
      .setDepth(MIDDLEGROUND_DEPTH);

    platforms.add(ground);
    platforms.add(platformSlide1);
    platforms.add(platformHouse);
    platforms.add(platformToKey1);
    platforms.add(platformToKey2);
    platforms.add(platformSlide2);
    platforms.add(platformToKey3);
    platforms.add(platformToKey4);
    platforms.add(platformToChess1);
    platforms.add(platformToChess2);
    platforms.add(platformToChess3);
    platforms.add(platformToChess4);
    platforms.add(platformGate);
    // Set collision boxes for each platform
    platforms.children.iterate((child) => {
      child.body.setSize(child.width, 20).setOffset(0, 0);
    });
  }
  addMainComponents() {
    
  }
  //add props
  addComponents() {}
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

    // background
    this.addBackgroundElements(mapWidth, mapHeight);

    // platforms
    this.addPlatforms(floorHeight);
  }

  update(delta, time) {}
}

export default Delivery2;
