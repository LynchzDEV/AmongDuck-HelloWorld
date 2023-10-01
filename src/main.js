import 'phaser';
import Phaser from 'phaser';
import _dev from './scenes/_dev';

const config = {
  // For more settings see <https://github.com/photonstorm/phaser/blob/master/src/boot/Config.js>
  type: Phaser.WEBGL,
  pixelArt: true,
  roundPixels: true,
  parent: 'content',
  width: 720,
  height: 1080,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    },
  },
  scene: [_dev],
};

const game = new Phaser.Game(config);

module.exports = {
  game,
  config,
};