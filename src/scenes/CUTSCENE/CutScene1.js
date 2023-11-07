import Phaser from "phaser";
import path from "path";
import { CUTSCENE_PATH } from "../../utils/cutScenePath";

let scenes = [
  "scene1",
  "scene2",
  "scene3",
  "scene4",
  "scene5",
  "scene6",
  "scene7",
];
let words = ["word1", "word2", "word3", "word4", "word5", "word6", "word7"];
let currentFrameIndex = 0;
let delayText = 5000;
let delayTransition = 2000;
// let delayText = 1;
// let delayTransition = 1;
let currentFrame;

class CutScene1 extends Phaser.Scene {
  constructor() {
    super({
      key: "CutScene1",
    });
  }

  preload() {
    this.load.image("scene1", path.join(CUTSCENE_PATH, "cs1.png"));
    this.load.image("word1", path.join(CUTSCENE_PATH, "wordcs1.png"));
    this.load.image("scene2", path.join(CUTSCENE_PATH, "cs2.png"));
    this.load.image("word2", path.join(CUTSCENE_PATH, "wordcs2.png"));
    this.load.image("scene3", path.join(CUTSCENE_PATH, "cs3.png"));
    this.load.image("word3", path.join(CUTSCENE_PATH, "wordcs3.png"));
    this.load.image("scene4", path.join(CUTSCENE_PATH, "cs4.png"));
    this.load.image("word4", path.join(CUTSCENE_PATH, "wordcs4.png"));
    this.load.image("scene5", path.join(CUTSCENE_PATH, "cs5.png"));
    this.load.image("word5", path.join(CUTSCENE_PATH, "wordcs5.png"));
    this.load.image("scene6", path.join(CUTSCENE_PATH, "cs6.png"));
    this.load.image("word6", path.join(CUTSCENE_PATH, "wordcs6.png"));
    this.load.image("scene7", path.join(CUTSCENE_PATH, "cs7.png"));
    this.load.image("word7", path.join(CUTSCENE_PATH, "wordcs7.png"));
  }

  create() {
    this.cameras.main.fadeIn(500);
    const width = this.sys.game.canvas.width;
    const self = this;
    currentFrame = this.add
      .image(width / 3.5, 0, scenes[currentFrameIndex])
      .setOrigin(0, 0)
      .setScale(0.5)
      .setAlpha(0);
    const currentWord = this.add
      .image(400, 100, words[currentFrameIndex])
      .setOrigin(0, 0)
      .setScale(0.5)
      .setAlpha(0);

    this.tweens.add({
      targets: [currentFrame, currentWord],
      alpha: 1,
      duration: 1000,
      onComplete: function () {
        self.time.addEvent({
          delay: delayText,
          callback: showNextFrame,
        });
      },
    });

    function showNextFrame() {
      currentFrameIndex++;
      if (currentFrameIndex < scenes.length) {
        self.tweens.add({
          targets: [currentFrame, currentWord],
          alpha: 0,
          duration: 1000,
          onComplete: function () {
            currentFrame.setTexture(scenes[currentFrameIndex]);
            currentWord.setTexture(words[currentFrameIndex]);

            self.tweens.add({
              targets: [currentFrame, currentWord],
              alpha: 1,
              duration: 1000,
              onComplete: function () {
                self.time.addEvent({
                  delay: currentFrameIndex < 3 ? delayText : delayTransition,
                  callback: showNextFrame,
                });
              },
            });
          },
        });
      } else {
        self.tweens.add({
          targets: [currentFrame, currentWord],
          alpha: 0,
          duration: 4000,
          onComplete: function () {
            self.scene.start("Temple");
          },
        });
      }
    }

    //  showNextFrame();

    this.input.on("pointerdown", function () {
      if (currentFrameIndex < scenes.length - 1) {
        showNextFrame();
      } else {
        self.scene.start("Temple");
      }
    });
  }

  update(delta, time) {}
}

export default CutScene1;
