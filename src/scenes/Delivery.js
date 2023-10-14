import Phaser from 'phaser';
import path from 'path';
import {
    BACKGROUND_GAME_PATH,
    COMPONENT_GAME_PATH,
    PLATFORM_GAME_PATH,
    SPRITESHEET_GAME_PATH
} from '../utils/mapPath';
import {
    SKY_DEPTH,
    BACKGROUND_DEPTH,
    BACKGROUND_COMPONENT_DEPTH,
    MIDDLEGROUND_DEPTH,
    PLAYER_DEPTH,
    FOREGROUND_DEPTH
} from '../utils/mapDepth';

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
  }
  loadComponents() {
    this.load.image('gate', path.join(COMPONENT_GAME_PATH, 'gate.png'));
    this.load.image('gate-active', path.join(COMPONENT_GAME_PATH, 'gate-active.png'));
    this.load.image('grass', path.join(COMPONENT_GAME_PATH, 'grass.png'));
    this.load.image('sakura-tree', path.join(COMPONENT_GAME_PATH, 'Sakura tree.png'));
    this.load.image('small-sign', path.join(COMPONENT_GAME_PATH, 'small-sign.png'));
    this.load.image('statue-stone', path.join(COMPONENT_GAME_PATH, 'statue-stone.png'));
    this.load.image('stone-wall', path.join(COMPONENT_GAME_PATH, 'stone-wall.png'));
    this.load.image('stone', path.join(COMPONENT_GAME_PATH, 'stone.png'));
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

  create() {}

  update(delta, time) {}
}

export default Delivery;
