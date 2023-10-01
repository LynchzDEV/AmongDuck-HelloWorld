import Phaser from 'phaser';

let background;
let player;
class CutScene1 extends Phaser.Scene {
  constructor() {
    super({
      key: 'CutScene1',
    });
  }

  preload() {
    this.load.image("background", "src/image/_dev/backGround.png");
    this.load.spritesheet("player", "src/image/_dev/bird.png", 
    {frameWidth: 410, frameHeight: 380})
  }

  create() {
    background = this.add
      .image(0, 0, "background")
      .setOrigin(0, 0)
      .setScale(1.5);
    player = this.physics.add.sprite({
      x: 100,
      y: 100,
      key: "player",
      frame: 1,
    });
  }

  update(delta, time) {}
}

export default CutScene1;
