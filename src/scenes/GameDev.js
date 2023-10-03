import Phaser from "phaser";
import playerMove from "../utils/playerMove";

let background;
let platforms;
// let player;
class GameDev extends Phaser.Scene {
  constructor() {
    super({
      key: "GameDev",
    });
  }

  preload() {
    this.load.image("background", "src/image/_dev/backGround.png");
    this.load.image("platforms", "src/image/_dev/Rapid.png");
    this.load.image("player", "src/image/_dev/Player.png", {
      frameWidth: 90,
      frameHeight: 90,
    });
  }

  create() {
    this.playerMove = playerMove; //Binding function to scene
    const { width, height } = this.scale;
    background = this.add
      .tileSprite(0, 0, width, height, "background")
      .setOrigin(0, 0)
      .setScale(1)
      .setScrollFactor(0)
      .setDepth(-1);
    // player = this.physics.add
    //   .sprite(0, 0, "player")
    //   .setScale(1)
    //   .setCollideWorldBounds(true);

    platforms = this.physics.add.staticGroup();
    platforms
      .create(0, 0, "platforms")
      .setOrigin(0, 0)
      .setScale(1)
      .refreshBody();
    platforms
      .create(width-200, height - 100, "platforms")
      .setOrigin(0, 0)
      .setScale(1)
      .refreshBody();
    platforms
      .create(width-500, height-500, "platforms")
      .setOrigin(0, 0)
      .setScale(1)
      .refreshBody();
    platforms
      .create(200, 200, "platforms")
      .setOrigin(0, 0)
      .setScale(1)
      .refreshBody();
    // this.physics.add.collider(player, platforms);  
  }

  update(delta, time) {

  }
}

export default GameDev;
