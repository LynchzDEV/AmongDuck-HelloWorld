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
let delayText = 10000;
let delayTransition = 2000;
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
    const self = this;
    currentFrame = this.add.image(0, 0, scenes[currentFrameIndex]).setOrigin(0,0).setScale(0.5);
    const currentWord = this.add.image(400, 100, words[currentFrameIndex]).setOrigin(0,0).setScale(0.5);

    function showNextFrame() {
      currentFrameIndex++;
      if (currentFrameIndex < 3) {
        currentFrame.setTexture(scenes[currentFrameIndex]);
        currentWord.setTexture(words[currentFrameIndex]);
        // Set a time delay before showing the next frame
        self.time.addEvent({
          delay: delayText,
          callback: showNextFrame,
        });
      } else if(currentFrameIndex < 7) {
        currentFrame.setTexture(scenes[currentFrameIndex]);
        currentWord.setTexture(words[currentFrameIndex]);
        // Set a time delay before showing the next frame
        self.time.addEvent({
          delay: delayTransition,
          callback: showNextFrame,
        });
        // End of cutscene, you can add your logic for what happens after the cutscene
      }
    }
    showNextFrame();
  }

  update(delta, time) {}
}

export default CutScene1;
