import Phaser from "phaser";
import path from "path";
import {
  FOREGROUND_TEMPLE_PATH,
  BACKGROUND_GAME_PATH,
  BACKGROUND_TEMPLE_PATH,
  COMPONENT_GAME_PATH,
  COMPONENT_TEMPLE_PATH,
  PLATFORM_GAME_PATH,
  SPRITESHEET_GAME_PATH,
  PLAYER_SPRITESHEET_PATH,
  UI_PATH,
  TEXT_GAME_PATH,
  AUDIO_GAME_PATH,
} from "../../utils/mapPath";
import { CUTSCENE_PATH } from "../../utils/cutScenePath";
let words = [];
let currentFrameIndex = 0;
let delayText = 5000;
let delayTransition = 2000;
// let delayText = 1;
// let delayTransition = 1;
let frame;

class Summarize extends Phaser.Scene {
  constructor() {
    super({
      key: "Summarize",
    });
  }

  preload() {
    //assets
    this.load.image("frame", path.join(CUTSCENE_PATH, "frame.png"));
    //text
    this.load.image("scene1", path.join(CUTSCENE_PATH, "2-1.png"));
    this.load.image("word1", path.join(CUTSCENE_PATH, "2-2.png"));
    this.load.image("scene2", path.join(CUTSCENE_PATH, "2-3.png"));
    this.load.image("word2", path.join(CUTSCENE_PATH, "2-4.png"));
    this.load.image("scene3", path.join(CUTSCENE_PATH, "2-5.png"));
    this.load.image("word3", path.join(CUTSCENE_PATH, "2-6.png"));
  }

  create() {
    this.cameras.main.fadeIn(500);
    const width = this.sys.game.canvas.width;
    const height = this.sys.game.canvas.height;
    const self = this;
    frame = this.add
      .image(width / 2, height / 2, "frame")
      .setOrigin(0.5, 0.5)
      .setScale(0.5)
      .setAlpha(1)
      .setDepth(1);
    let text = this.add
      .image(width / 2, height / 2, "scene1")
      .setOrigin(0.5, 0.5)
      .setScale(0.5)
      .setAlpha(1)
      .setDepth(5);
    let sakuraAnim = this.add
      .sprite(width, height, "sakuraAnim")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(3);
    
    this.load.spritesheet(
      "sakuraAnim",
      path.join(SPRITESHEET_GAME_PATH, "sakuraAnim.png"),
      {
        frameWidth: 888,
        frameHeight: 627,
      }
    );
    sakuraAnim.flipX = true;
    sakuraAnim.anims.play("sakuraAnim", true);
  }

  update(delta, time) {}
}

export default Summarize;
