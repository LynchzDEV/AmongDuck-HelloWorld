import Phaser from 'phaser';
import path from 'path';
import { CUTSCENE_PATH } from '../../utils/cutScenePath';

class CutScene1 extends Phaser.Scene {
  constructor() {
    super({
      key: 'CutScene1',
    });
  }

  preload() {
    this.load.image('scene1', path.join(CUTSCENE_PATH, 'cs1.png'));
    this.load.image('scene2', path.join(CUTSCENE_PATH, 'cs2.png'));
    this.load.image('scene3', path.join(CUTSCENE_PATH, 'cs3.png'));
    this.load.image('scene4', path.join(CUTSCENE_PATH, 'cs4.png'));
    this.load.image('scene5', path.join(CUTSCENE_PATH, 'cs5.png'));
    this.load.image('scene6', path.join(CUTSCENE_PATH, 'cs6.png'));
    this.load.image('scene7', path.join(CUTSCENE_PATH, 'cs7.png'));
  }

  create() {}

  update(delta, time) {}
}

export default CutScene1;
