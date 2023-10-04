import Phaser from 'phaser';
import calculateCanvasRatio from '../utils/ratio';

let canvasWidth;
let canvasHeight;
let ratio;
class MainMenu extends Phaser.Scene {
  constructor() {
    super({
      key: 'MainMenu',
    });
  }

  preload() {
    this.load.image('logo', 'src/assets/image/_dev/placeholder.png');
    this.load.image('button1', 'src/assets/image/_dev/playButton.png');
    this.load.image('button2', 'src/assets/image/_dev/play.png');
  }

  create() {
    const canvasData = calculateCanvasRatio(this.sys);
    canvasWidth = canvasData.canvasWidth;
    canvasHeight = canvasData.canvasHeight;
    ratio = canvasData.ratio;

    this.add.image(canvasWidth / 2, canvasHeight / 3.3, 'logo').setScale(0.25);

    const button1 = this.add
      .image(canvasWidth / 2, canvasHeight / 1.6, 'button1')
      .setScale(0.5 * ratio)
      .setInteractive();

    const button2 = this.add
      .image(canvasWidth / 2, canvasHeight / 1.2, 'button2')
      .setScale(0.33 * ratio);
  }

  update(delta, time) {}
}

export default MainMenu;
