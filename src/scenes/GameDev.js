import Phaser from "phaser";
import playerMove from "../utils/playerMove";

let player;
let background;
let platforms;
let grounds;

class GameDev extends Phaser.Scene {
  constructor() {
    super({
      key: "GameDev",
    });
  }

  preload() {
    this.load.image("background", "src/image/_dev/backGround.png");
    this.load.image("platforms", "src/image/_dev/Rapid.png");
    this.load.image("ground", "src/image/_dev/tileSprite.png");
    this.load.spritesheet("player", "src/image/_dev/Player.png", {
      frameWidth: 90,
      frameHeight: 90,
    });
  }

  create() {
    console.log("GameDev");
    this.playerMove = playerMove; //Binding function to scene
    const { width, height } = this.scale;

    //world bound
    this.physics.world.setBounds(0, 0, width * 2, height);

    //player
    player = this.physics.add
      .sprite(100, 450, "player")
      .setCollideWorldBounds(true);

    //background
    background = this.add
      .tileSprite(0, 0, width, height, "background")
      .setOrigin(0, 0)
      .setScale(1)
      .setScrollFactor(0)
      .setDepth(-1);

    // platforms and ground
    platforms = this.physics.add.staticGroup();
    let ground = this.add
      .tileSprite(0, height - 100, width, 200, "ground")
      .setOrigin(0, 0);
    platforms.add(ground);
    let platform1 = platforms.create(0, height - 300, "platforms");
    let platform2 = platforms.create(300, height - 350, "platforms");
    let platform3 = platforms.create(600, height - 400, "platforms");
    let platform4 = platforms.create(500, height - 700, "platforms");
    let platform5 = platforms.create(1100, height - 400, "platforms");

    //collider
    this.physics.add.collider(player, platforms);

    //animations
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("player", {
        start: 0,
        end: 2,
      }),
      frameRate: 10,
      repeat: -1,
    });
  }

  update(delta, time) {
    //testing platforms
    this.playerMove(player, 200);
    console.log(player.x);
  }
}

export default GameDev;
