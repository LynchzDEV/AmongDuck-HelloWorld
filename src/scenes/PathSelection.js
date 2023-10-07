import Phaser from "phaser";

class PathSelection extends Phaser.Scene {
  constructor() {
    super({
      key: "PathSelection",
    });
  }

  preload() {
    // missing text block for the story

    // load button from assets/image/components/temp
    this.load.image(
      "button-to-go-left",
      "assets/image/components/temp/button-start.png"
    ); // this doesn't refer to the real path
    this.load.image(
      "button-to-go-right",
      "assets/image/components/temp/button-start.png"
    ); // this doesn't refer to the real path

    this.load.image(
      "popup-image",
      "assets/image/Sunny-land-files/environment/Background/back.png"
    ); // this doesn't refer to the real path
    this.load.image(
      "confirm-button-image",
      "assets/image/components/temp/button-start.png"
    ); // this doesn't refer to the real path
    this.load.image(
      "cancel-button-image",
      "assets/image/components/temp/button-start.png"
    ); // this doesn't refer to the real path
  }

  create() {
    // the ratio has not fixed yet
    
    // create button to go left
    this.buttonToGoLeft = this.add
      .image(
        this.sys.game.canvas.width / 2,
        this.sys.game.canvas.height * 0.4,
        "button-to-go-left"
      )
      .setScale(0.5)
      .setInteractive();
    // create button to go right
    this.buttonToGoRight = this.add
      .image(
        this.sys.game.canvas.width / 2,
        this.sys.game.canvas.height * 0.6,
        "button-to-go-right"
      )
      .setScale(0.5)
      .setInteractive();

    this.buttonToGoLeft.on("pointerdown", () => {
      this.showConfirmationPopup("CodingPath");
    });
    this.buttonToGoRight.on("pointerdown", () => {
      this.showConfirmationPopup("DesignPath");
    });
  }

  update(delta, time) {}

  showConfirmationPopup(sceneKey) {
    // Create the popup dialog (you can design your own popup UI)
    const popupDialog = this.add
      .sprite(
        this.sys.game.canvas.width / 2,
        this.sys.game.canvas.height / 2,
        "popup-image"
      )
      .setScale(4);
    popupDialog.setOrigin(0.5);
    popupDialog.setInteractive();

    // Create a confirm button inside the popup
    const confirmButton = this.add
      .sprite(
        this.sys.game.canvas.width / 2,
        this.sys.game.canvas.height * 0.4,
        "confirm-button-image"
      )
      .setScale(0.35)
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.start(sceneKey);
        // Close the popup after confirming the selection
        // popupBackground.destroy();
        popupDialog.destroy();
        confirmButton.destroy();
        cancelButton.destroy();
      });

      // Create a cancel button inside the popup
    const cancelButton = this.add
    .sprite(
      this.sys.game.canvas.width / 2,
      this.sys.game.canvas.height * 0.6,
      "cancel-button-image"
    )
    .setScale(0.35)
    .setInteractive()
    .on("pointerdown", () => {
      // Close the popup after canceling the selection
      // popupBackground.destroy();
      popupDialog.destroy();
      confirmButton.destroy();
      cancelButton.destroy();
    });
  }
}

export default PathSelection;
