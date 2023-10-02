import Phaser from 'phaser';
import calculateCanvasRatio from '../utils/ratio';

class Forest1 extends Phaser.Scene {
  constructor() {
    super({
      key: 'Forest1',
    });
  }

  preload() {}

  create() {
    const ratio = calculateCanvasRatio(this.sys);
    const width = ratio.canvasWidth;
    const height = ratio.canvasHeight;
    background = this.add
      .tileSprite(0, 0, width, height, "background")
      .setOrigin(0, 0)
      .setScale(1.5)
      .setDepth(-1);
    foreground = this.add
      .image(0, height - 250, "foreground")
      .setOrigin(0, 0)
      .setScale(0.5)
      .setDepth(1);
    camera = this.cameras.main
    .setViewport(0, 0, width, height)
    .setBounds(0, 0, width* 2, height)
    .setZoom(1.5);
  }

  update(delta, time) {
    camera.startFollow(player);
    this.playerMove(player, 100);
  }
}

export default Forest1;