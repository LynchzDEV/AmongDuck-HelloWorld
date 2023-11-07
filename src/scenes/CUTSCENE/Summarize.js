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
let words = [
  "word1",
  "word2",
  "word3",
  "word4",
  "word5",
  "word6",
  "word7",
  "word8A",
];
let currentFrameIndex = 0;
let delayText = 1;
let frame;

let bg;
let cloundLayer1;
let cloundLayer2;

class Summarize extends Phaser.Scene {
  constructor() {
    super({ key: "Summarize" });
    this.currentTween = null;
    this.isSkipping = false;
  }

  preload() {
    //assets
    this.load.image("frame", path.join(CUTSCENE_PATH, "frame.png"));
    //text
    this.load.image("word1", path.join(CUTSCENE_PATH, "2-1.png"));
    this.load.image("word2", path.join(CUTSCENE_PATH, "2-2.png"));
    this.load.image("word3", path.join(CUTSCENE_PATH, "2-3.png"));
    this.load.image("word4", path.join(CUTSCENE_PATH, "2-4.png"));
    this.load.image("word5", path.join(CUTSCENE_PATH, "2-5.png"));
    this.load.image("word6", path.join(CUTSCENE_PATH, "2-6.png"));
    this.load.image("word7", path.join(CUTSCENE_PATH, "2-1.png"));
    this.load.image("button1", path.join(CUTSCENE_PATH, "T_2-7.png"));
    this.load.image("button2", path.join(CUTSCENE_PATH, "B_2-7.png"));
  }

  create() {
    this.setupBackground();
    this.setupText();
    this.startTextSequence();
  }

  update(delta, time) {
    //scrolling background
    bg.tilePositionX += 0.03;
    cloundLayer1.tilePositionX += 0.07;
    cloundLayer2.tilePositionX += 0.1;
  }

  setupBackground() {
    this.cameras.main.fadeIn(500);
    const width = this.sys.game.canvas.width;
    const height = this.sys.game.canvas.height;
    const self = this;
    frame = this.add
      .image(width / 2, height / 2, "frame")
      .setOrigin(0.5, 0.5)
      .setScale(0.5)
      .setAlpha(1)
      .setDepth(3.3);
    let sakuraAnim = this.add
      .sprite(width / 1, 500, "sakuraAnim")
      .setOrigin(0.7, 0.5)
      .setScale(0.78)
      .setDepth(998);
    let sakuraAnim2 = this.add
      .sprite(width / 4.56, 600, "sakuraAnim")
      .setOrigin(0.5, 0.5)
      .setScale(0.67)
      .setDepth(999);

    sakuraAnim.flipX = true;
    sakuraAnim.anims.play("sakuraAnim", true);
    sakuraAnim2.anims.play("sakuraAnim", true);

    bg = this.add
      .tileSprite(width / 2, height / 2, width, height, "background")
      .setOrigin(0.5, 0.5)
      .setScale(1)
      .setDepth(2);
    //mid clound
    cloundLayer1 = this.add
      .tileSprite(width / 2, height / 2, width, height + 300, "clound-layer2")
      .setOrigin(0.5, 0.5)
      .setScale(1)
      .setDepth(3);
    //front clound
    cloundLayer2 = this.add
      .tileSprite(width / 2, height / 2, width, height + 198, "clound-layer1")
      .setOrigin(0.5, 0.5)
      .setScale(1)
      .setDepth(5);
  }

  setupText() {
    // Create an array to hold your text objects
    this.textObjects = words.map((word, index) => {
      return this.add
        .image(
          this.sys.game.canvas.width / 2,
          this.sys.game.canvas.height / 2,
          word
        )
        .setOrigin(0.5, 0.5)
        .setScale(0.5)
        .setAlpha(0)
        .setDepth(999);
    });
  }

  startTextSequence() {
    currentFrameIndex = 6;
    this.showNextFrame();
    this.input.on("pointerdown", this.skipFrame, this);
  }

  showNextFrame() {
    console.log(currentFrameIndex);
    if (currentFrameIndex < this.textObjects.length) {
      // Hide the previous text if it exists
      if (currentFrameIndex > 0) {
        let previousText = this.textObjects[currentFrameIndex - 1];
        previousText.setAlpha(0);
      }
      let currentText = this.textObjects[currentFrameIndex];
      this.currentTween = this.tweens.add({
        targets: currentText,
        alpha: 1,
        duration: 1000,
        onComplete: () => {
          this.time.delayedCall(delayText, () => {
            this.tweens.add({
              targets: currentText,
              alpha: 0,
              duration: 1000,
              onComplete: () => {
                currentFrameIndex++;
                if (currentFrameIndex === 7) {
                  this.displayButtons();
                } else if (currentFrameIndex < this.textObjects.length) {
                  this.showNextFrame();
                } else {
                  // this.scene.start("Temple"); // Replace "Temple" with the key of your next scene
                }
              },
            });
          });
        },
      });
    }
  }

  skipFrame() {
    if (currentFrameIndex !== 7) {
      console.log("skip");
      console.log(currentFrameIndex);
      if (this.currentTween) {
        this.currentTween.stop();
      }
      this.tweens.add({
        targets: this.textObjects,
        alpha: 0,
        duration: 1000,
        onComplete: () => {
          currentFrameIndex++;
          if (currentFrameIndex === 7) {
            this.displayButtons();
          } else if (currentFrameIndex < this.textObjects.length) {
            this.showNextFrame();
          } else {
            // this.scene.start("Temple");
          }
        },
      });
    }
  }

  displayButtons() {
    const width = this.sys.game.canvas.width;
    const height = this.sys.game.canvas.height;
    let button1 = this.add
      .image(width / 2, height / 2, "button1")
      .setScale(0.5)
      .setInteractive()
      .setDepth(1000);
    let button2 = this.add
      .image(width / 2, height / 2 + 150, "button2")
      .setScale(0.5)
      .setInteractive()
      .setDepth(1000);

    button1.on("pointerdown", () => {
      console.log("Button 1 clicked");
    });

    button2.on("pointerdown", () => {
      console.log("Button 2 clicked");
    });
  }
}

export default Summarize;
