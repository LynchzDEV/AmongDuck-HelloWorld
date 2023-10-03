import Phaser from 'phaser';

class CutScene1 extends Phaser.Scene {
  constructor() {
    super({
      key: 'CutScene1',
    });
  }

  preload() {}
  // test passing data between scenes
  create(data) {
    const gameContext = data.gameContext;
    console.log(gameContext.playerX);
    console.log(gameContext.playerY);
  }

  update(delta, time) {}
}

export default CutScene1;
