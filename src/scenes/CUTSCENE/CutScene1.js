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
let words = [
  "word1",
  "word2",
  "word3",
  "word4",
  "word5",
  "word6",
  "word7",
];
let currentFrame = 0;
let delayBetweenScenes = 1000 ;

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

  animateCutScene() {}

  create() {
    this.currentScene = this.add.image(0,0,scenes[currentFrame]).setOrigin(0,0).setScale(0.5);
    this.currentWord = this.add.image(0,0,words[currentFrame]).setOrigin(0,0).setScale(0.5);
  }

  update(delta, time) {
        // Update the cutscene frame by frame
        this.input.on('pointerdown', function(pointer) {
          // Handle the pointerdown event
          if (currentFrame < scenes.length - 1) {
              if (this.time.now > delayBetweenScenes) {
                  currentFrame++;
                  this.currentScene.setTexture(scenes[currentFrame]);
                  this.currentWord.setTexture(words[currentFrame]);
                  console.log(currentFrame);
                  console.log(thistime.now)
                  this.time.delayedCall(delayBetweenScenes, function() {
                      // Do something after the delay
                  }, [], this);
              }
          } else {
              // The cutscene is over, proceed to the next scene or level
          }
      }, this);
          // The cutscene is over, proceed to the next scene or level
  
  }
}

export default CutScene1;
