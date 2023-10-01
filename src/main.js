import 'phaser';
import Phaser from 'phaser';
import _dev from './scenes/_dev';

import MainMenu from './scenes/MainMenu';
import CutScene1 from './scenes/CutScene1';
import CutScene2 from './scenes/CutScene2';
import Forest1 from './scenes/Forest1';
import PathSelection from './scenes/PathSelection';
import CodingPath from './scenes/CodingPath';
import DesignPath from './scenes/DesignPath';
import GameDev from './scenes/GameDev';
import DevOps from './scenes/DevOps';
import FrontEnd from './scenes/Frontend';
import WebDesign from './scenes/WebDesign';
import Ending from './scenes/Ending';
import Summarize from './scenes/Summarize';

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

  scene: [
    // MainMenu,
    CutScene1,
    CutScene2,
    Forest1,
    PathSelection,
    CodingPath,
    DesignPath,
    GameDev,
    DevOps,
    FrontEnd,
    WebDesign,
    Ending,
    Summarize,
  ],
  // scene: [_dev],
};

const game = new Phaser.Game(config);

export { game, config };