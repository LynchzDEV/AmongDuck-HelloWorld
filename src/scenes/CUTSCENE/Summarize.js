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
  "s-word1", //0
  "s-word2", //1
  "s-word3", //2
  "s-word4", //3
  "s-word5", //4
  "s-word6", //5
  "s-word7", //6
  "word8A-1", //7
  "word8A-2", //8
  "word8B-1", //9
  "word8B-2", //10
  "word9A-1", //11
  "word9B-1", //12
  "GameDev1", //13
  "GameDev2", //14
  "GameDev3", // ! 15
  "DevOps1", //16
  "DevOps2", //17
  "DevOps3", // ! 18
  "FrontEnd1", //19
  "FrontEnd2", //20
  "FrontEnd3", //21
  "FrontEnd4", //! 22
  "WebDesign1", //23
  "WebDesign2", //24
  "WebDesign3", //25
  "WebDesign4", //! 26
];

let lastFrames = [15, 18, 22, 26];

let currentFrameIndex = 0;
let delayText = 1;
let frame;

let buttons;

let bg;
let cloundLayer1;
let cloundLayer2;

let codingPath = false;
let designPath = false;

class Summarize extends Phaser.Scene {
  constructor() {
    super({ key: "Summarize" });
    this.currentTween = null;
    this.buttons = null;
    this.isSkipping = false;
  }

  preload() {
    //assets
    this.load.image("frame", path.join(CUTSCENE_PATH, "frame.png"));
    //text
    this.load.image("s-word1", path.join(CUTSCENE_PATH, "2-1.png"));
    this.load.image("s-word2", path.join(CUTSCENE_PATH, "2-2.png"));
    this.load.image("s-word3", path.join(CUTSCENE_PATH, "2-3.png"));
    this.load.image("s-word4", path.join(CUTSCENE_PATH, "2-4.png"));
    this.load.image("s-word5", path.join(CUTSCENE_PATH, "2-5.png"));
    this.load.image("s-word6", path.join(CUTSCENE_PATH, "2-6.png"));

    //7
    this.load.image("s-word7", path.join(CUTSCENE_PATH, "H_2-7.png"));
    this.load.image("button1", path.join(CUTSCENE_PATH, "T_2-7.png"));
    this.load.image("button2", path.join(CUTSCENE_PATH, "B_2-7.png"));

    //8A
    this.load.image("word8A-1", path.join(CUTSCENE_PATH, "2-8A.1.png"));
    this.load.image("word8A-2", path.join(CUTSCENE_PATH, "2-8A.2.png"));

    //8B
    this.load.image("word8B-1", path.join(CUTSCENE_PATH, "2-8B.1.png"));
    this.load.image("word8B-2", path.join(CUTSCENE_PATH, "2-8B.2.png"));

    //9A
    this.load.image("word9A-1", path.join(CUTSCENE_PATH, "H_2-9A.png"));
    this.load.image("button3", path.join(CUTSCENE_PATH, "T_2-9A.png"));
    this.load.image("button4", path.join(CUTSCENE_PATH, "B_2-9A.png"));

    //9B
    this.load.image("word9B-1", path.join(CUTSCENE_PATH, "H_2-9B.png"));
    this.load.image("button5", path.join(CUTSCENE_PATH, "T_2-9B.png"));
    this.load.image("button6", path.join(CUTSCENE_PATH, "B_2-9B.png"));

    //9A-Game Dev
    this.load.image("GameDev1", path.join(CUTSCENE_PATH, "2-9A_GDev1.png"));
    this.load.image("GameDev2", path.join(CUTSCENE_PATH, "2-9A_GDev2.png"));
    this.load.image("GameDev3", path.join(CUTSCENE_PATH, "2-9A_GDev3.png"));

    //9A-DevOps
    this.load.image("DevOps1", path.join(CUTSCENE_PATH, "2-9A_DevOps1.png"));
    this.load.image("DevOps2", path.join(CUTSCENE_PATH, "2-9A_DevOps2.png"));
    this.load.image("DevOps3", path.join(CUTSCENE_PATH, "2-9A_DevOps3.png"));

    //9B-Front End
    this.load.image("FrontEnd1", path.join(CUTSCENE_PATH, "2-9B_FD1.png"));
    this.load.image("FrontEnd2", path.join(CUTSCENE_PATH, "2-9B_FD2.png"));
    this.load.image("FrontEnd3", path.join(CUTSCENE_PATH, "2-9B_FD3.png"));
    this.load.image("FrontEnd4", path.join(CUTSCENE_PATH, "2-9B_FD4.png"));

    //9B-Web Design
    this.load.image("WebDesign1", path.join(CUTSCENE_PATH, "2-9B_WD1.png"));
    this.load.image("WebDesign2", path.join(CUTSCENE_PATH, "2-9B_WD2.png"));
    this.load.image("WebDesign3", path.join(CUTSCENE_PATH, "2-9B_WD3.png"));
    this.load.image("WebDesign4", path.join(CUTSCENE_PATH, "2-9B_WD4.png"));
  }

  create() {
    this.cameras.main.fadeIn(1000);
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
      console.log(word);
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
    currentFrameIndex = 0;
    this.showNextFrame();
    // this.input.on("pointerdown", this.skipFrame, this);
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
          this.delayedCallEvent = this.time.delayedCall(delayText, () => {
            this.tweens.add({
              targets: currentText,
              alpha: 0,
              duration: 1000,
              onComplete: () => {
                currentFrameIndex++;
                if (currentFrameIndex === 6) {
                  this.displayChoiceButtons();
                } else if (currentFrameIndex === 9) {
                  this.displayCodingPathButtons();
                } else if (currentFrameIndex === 10) {
                  this.displayDesignPathButtons();
                } else if (
                  currentFrameIndex < this.textObjects.length &&
                  !lastFrames.includes(currentFrameIndex)
                ) {
                  this.showNextFrame();
                } else if (lastFrames.includes(currentFrameIndex)) {
                  console.log(currentFrameIndex);
                  this.textObjects[currentFrameIndex].setAlpha(1);
                }
              },
            });
          });
        },
      });
    }
  }

  displayChoiceButtons() {
    //display text "word7"
    this.showText(currentFrameIndex);
    this.createButton(
      "button1",
      () => {
        console.log("coding path");
        currentFrameIndex = 7; // continue with coding path
        this.textObjects[currentFrameIndex].setAlpha(0);
        this.showNextFrame();
      },
      true,
      currentFrameIndex
    );

    this.createButton(
      "button2",
      () => {
        console.log("design path");
        currentFrameIndex = 9; // continue with design path
        this.textObjects[currentFrameIndex].setAlpha(0);
        this.showNextFrame();
      },
      false,
      currentFrameIndex
    );
  }

  // Called when reaching frame index 11
  displayCodingPathButtons() {
    this.showText(currentFrameIndex);
    this.createButton(
      "button3",
      () => {
        console.log("Game Dev path");
        currentFrameIndex = 13; // continue with Game Dev path
        this.textObjects[currentFrameIndex].setAlpha(0);
        this.showNextFrame();
      },
      true,
      currentFrameIndex
    );

    this.createButton(
      "button4",
      () => {
        console.log("DevOps path");
        currentFrameIndex = 16; // continue with DevOps path
        this.textObjects[currentFrameIndex].setAlpha(0);
        this.showNextFrame();
      },
      false,
      currentFrameIndex
    );
  }

  // Called when reaching frame index 12
  displayDesignPathButtons() {
    this.showText(currentFrameIndex);
    this.createButton(
      "button5",
      () => {
        console.log("Front End path");
        currentFrameIndex = 19; // continue with Front End path
        this.textObjects[currentFrameIndex].setAlpha(0);
        this.showNextFrame();
      },
      true,
      currentFrameIndex
    );

    this.createButton(
      "button6",
      () => {
        console.log("Web Design path");
        currentFrameIndex = 23; // continue with Web Design path
        this.textObjects[currentFrameIndex].setAlpha(0);
        this.showNextFrame();
      },
      false,
      currentFrameIndex
    );
  }

  showText(index) {
    if (index >= 0 && index < this.textObjects.length) {
      let text = this.textObjects[index];
      text.setAlpha(1);
      text.y -= 100;
    }
  }

  createButton(key, onClick, isTop, currentTextIndex) {
    const width = this.sys.game.canvas.width;
    const height = this.sys.game.canvas.height;

    let buttonYpos = isTop ? height / 2 + 100 : height / 2 + 200;

    let button = this.add
      .image(width / 2, buttonYpos, key)
      .setScale(0.4)
      .setInteractive()
      .setAlpha(0)
      .setDepth(1000);

    this.tweens.add({
      targets: button,
      alpha: { from: 0, to: 1 },
      duration: 1000,
      ease: "Linear",
    });

    if (!this.buttons) {
      this.buttons = this.add.group();
    }
    this.buttons.add(button);
    const allButtons = this.buttons.getChildren();

    button.on("pointerdown", () => {
      this.buttons.getChildren().forEach((child) => {
        this.tweens.add({
          targets: child,
          alpha: 0,
          duration: 500,
          onComplete: () => {
            child.destroy();
          },
        });
      });

      // Also fade out the current text if it is visible
      if (this.textObjects[currentTextIndex].alpha > 0) {
        this.tweens.add({
          targets: this.textObjects[currentTextIndex],
          alpha: 0,
          duration: 500,
          onComplete: () => {
            // Now perform the onClick action after the fade out completes
            onClick();
          },
        });
      } else {
        // If the text isn't visible, just perform the onClick action
        onClick();
      }
    });
  }

  skipFrame() {
    if (this.currentTween) {
      this.currentTween.remove();
      this.currentTween = null;
    }

    if (this.delayedCallEvent) {
      this.delayedCallEvent.remove();
      this.delayedCallEvent = null;
    }

    if (currentFrameIndex < this.textObjects.length) {
      this.textObjects[currentFrameIndex].setAlpha(0);
    }

    currentFrameIndex++;

    if (
      currentFrameIndex === 7 &&
      currentFrameIndex === 12 &&
      currentFrameIndex === 13
    ) {
      console.log("donothing");
    } else if (currentFrameIndex === 6) {
      this.displayChoiceButtons();
    } else if (currentFrameIndex === 11) {
      this.displayCodingPathButtons();
    } else if (currentFrameIndex === 12) {
      this.displayDesignPathButtons();
    } else if (currentFrameIndex < this.textObjects.length) {
      this.showNextFrame();
    } else {
      // If we've reached the end of the frames, you might want to restart or end
      // this.scene.start("Temple"); // Or handle the end of the sequence appropriately
    }
  }
}

export default Summarize;
