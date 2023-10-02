import Phaser from 'phaser';
import { config } from '../main';

let background;
let foreground;

class Forest1 extends Phaser.Scene {
  constructor() {
    super({
      key: 'Forest1',
    });
  }

  preload() {}

  create() {
    background = this.add
      .tileSprite(0, 0, config.width, config.height, "background")
      .setOrigin(0, 0)
      .setScale(1.5)
      .setDepth(-1);
    foreground = this.add
      .image(0, config.height - 250, "foreground")
      .setOrigin(0, 0)
      .setScale(0.5)
      .setDepth(1);
  }

  update(delta, time) {
    
  }
}

export default Forest1;