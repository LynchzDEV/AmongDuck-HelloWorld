import Phaser from "phaser";
import path from "path";
import {
  BACKGROUND_GAME_PATH,
  COMPONENT_GAME_PATH,
  PLATFORM_GAME_PATH,
  SPRITESHEET_GAME_PATH,
} from "../utils/mapPath";
import playerMoveTemple from "../utils/playerMoveTemple";

//spritesheet for testing player
const spritesheet_path = path.join(
  'assets',
  'image',
  'Sunny-land-files',
  'spritesheets'
);

class GameDev extends Phaser.Scene {
  constructor() {
    super({
      key: "GameDev",
    });
  }

  loadBackground() {
    //load background
    this.load.image("background", path.join(BACKGROUND_GAME_PATH, "background-pink.png"));
    this.load.image("clounds_layer1", path.join(BACKGROUND_GAME_PATH, "bg-pink-layer1.png"));
    this.load.image("clounds_layer2", path.join(BACKGROUND_GAME_PATH, "bg-pink-layer2.png"));
  }
  loadPlatforms(){
    this.load.image("ground", path.join(PLATFORM_GAME_PATH, "ground.png"));
    this.load.image("ground-edge", path.join(PLATFORM_GAME_PATH, "ground-edge.png"));
    this.load.image("tile-platform", path.join(PLATFORM_GAME_PATH, "tile-platform.png"));
  }
  loadComponents() {
    // load components
    this.load.image("tree", path.join(COMPONENT_GAME_PATH, "Sakura Tree.png"));
    this.load.image("stone", path.join(COMPONENT_GAME_PATH, "stone.png"));
    this.load.image("stone-wall", path.join(COMPONENT_GAME_PATH, "stone-wall.png"));
    this.load.image("statue-stone", path.join(COMPONENT_GAME_PATH, "statue-stone.png"));
    this.load.image("small-sign", path.join(COMPONENT_GAME_PATH, "small-sign.png"));
    this.load.image("grass", path.join(COMPONENT_GAME_PATH, "grass.png"));
    this.load.image("stone-gate", path.join(COMPONENT_GAME_PATH, "gate.png"));
    this.load.image("stone-gate-active", path.join(COMPONENT_GAME_PATH, "gate-active.png"));
  }
  loadPlayer() {
    //load player
    this.load.spritesheet('player', path.join(spritesheet_path, 'oposum.png'), {
      frameWidth: 36,
      frameHeight: 28,
    });
  }
  loadUI() {
    //load button
    this.load.image('left', path.join('assets', 'ui', 'left.png'));
    this.load.image('right', path.join('assets', 'ui', 'right.png'));
    this.load.image('up', path.join('assets', 'ui', 'up.png'));
  }

  preload() {
    this.loadBackground();
    this.loadPlatforms();
    this.loadComponents();
    this.loadPlayer();
    this.loadUI();
  }

  setWorldBoundsAndCamera(height, mapWidth){
    //setting world bounds
    this.physics.world.setBounds(0, 0, mapWidth, height);

    //set collision L, R, T, B
    this.physics.world.setBoundsCollision(true, true, true, true);

    //setting camera
    camera = this.cameras.main;
    camera.setBounds(0, 0, mapWidth, height);
  }

  create() {
    //config
    const { width, height } = this.scale;
    const mapWidth = width * 3;
    const floorHeight = height - 200;
    this.playerMoveTemple = playerMoveTemple;
  }

  update(delta, time) {
    
  }
}

export default GameDev;
