import Phaser from 'phaser';
import path from 'path';
import {
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
    FOREGROUND_DEPTH
} from '../utils/mapDepth';

import {
  setWorldBoundsAndCamera,
} from '../utils/setWorldAndCameraBound';

import {
  playerMoveTemple,
} from '../utils/playerMoveTemple';

//bg component
let backgrounds;
let cloundLayer1;
let cloundLayer2;
let platforms;
let components;
// player
let player;
let camera;
//interactive
let chess;
let house;
let gate;

class Delivery extends Phaser.Scene {
  constructor() {
    super({
      key: 'Delivery',
    });
  }

  loadBackground() {
    this.load.image('background', path.join(BACKGROUND_GAME_PATH, 'background-pink.png'));
    this.load.image('clound-layer1', path.join(BACKGROUND_GAME_PATH, 'bg-pink-layer1.png'));
    this.load.image('clound-layer2', path.join(BACKGROUND_GAME_PATH, 'bg-pink-layer2.png'));
  }
  loadPlatforms() {
    this.load.image('platform', path.join(PLATFORM_GAME_PATH, 'platform.png'));
    this.load.image('tile-platfrom', path.join(PLATFORM_GAME_PATH, 'tile-platform.png'));
    this.load.image('platform-glass', path.join(PLATFORM_GAME_PATH, 'platform-glass.png'));
    this.load.image('platform-vine', path.join(PLATFORM_GAME_PATH, 'platform-vine.png'));
  }
  loadComponents() {
    this.load.image('gate', path.join(COMPONENT_GAME_PATH, 'gate.png'));
    this.load.image('gate-active', path.join(COMPONENT_GAME_PATH, 'gate-active.png'));
    this.load.image('sakura-tree', path.join(COMPONENT_GAME_PATH, 'Sakura tree.png'));
    this.load.image('small-sign', path.join(COMPONENT_GAME_PATH, 'small-sign.png'));
    this.load.image('statue-stone', path.join(COMPONENT_GAME_PATH, 'statue-stone.png'));
    this.load.image('stone-wall', path.join(COMPONENT_GAME_PATH, 'stone-wall.png'));
    this.load.image('stone', path.join(COMPONENT_GAME_PATH, 'stone.png'));
    
    //load spritesheet
    //I'm not trying yet, this scale is not correct
    this.load.spritesheet('chess', path.join(SPRITESHEET_GAME_PATH, 'chess.png'), {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('flame', path.join(SPRITESHEET_GAME_PATH, 'flame.png'), {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet('torch-flame', path.join(SPRITESHEET_GAME_PATH, 'torch-flame.png'), {
      frameWidth: 16,
      frameHeight: 16,
    });
  }
  loadPlayer() {
    this.load.spritesheet('player', path.join(PLAYER_SPRITESHEET_PATH, 'oposum.png'), {
      frameWidth: 36,
      frameHeight: 28,
    });
  }
  loadUI() {
    //load button
    this.load.image('left', path.join(UI_PATH, 'left.png'));
    this.load.image('right', path.join(UI_PATH, 'right.png'));
    this.load.image('up', path.join(UI_PATH, 'up.png'));
  }

  preload() {
    this.loadBackground();
    this.loadPlatforms();
    this.loadComponents();
    this.loadPlayer();
    this.loadUI();
  }

  create() {
    //config
    const { width, height } = this.scale;
    const mapWidth = width * 3;
    const mapHeight = height * 2;
    // const floorHeight = height - 330;
    this.playerMoveTemple = playerMoveTemple;
    this.setWorldBoundsAndCamera = setWorldBoundsAndCamera;
    this.setWorldBoundsAndCamera(mapHeight, mapWidth, camera);
    
  }

  update(delta, time) {}
}

export default Delivery;
