import Phaser from 'phaser';

class DevOps extends Phaser.Scene {
  constructor() {
    super({
      key: 'DevOps',
    });
  }

  //delivery
  preload() {}

  create() {
    console.log('DevOps');
  }

  update(delta, time) {}
}

export default DevOps;
