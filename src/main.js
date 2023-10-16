import 'phaser';
import Phaser from 'phaser';
import _dev from './tools/_dev';
import _mobilesite from './tools/_mobilesite';
import _movementTemplate from './tools/_movementTemplate';
import _forest1 from './tools/_Forest1';

import MainMenu from './scenes/cutscene/MainMenu';
import CutScene1 from './scenes/CUTSCENE/CutScene1';
import CutScene2 from './scenes/CUTSCENE/CutScene2';
import CutScene3 from './scenes/CUTSCENE/CutScene3';
import Delivery from './scenes/Delivery';
import Delivery2 from './scenes/Delivery2';
import Temple from './scenes/Temple';
import PathSelection from './scenes/PathSelection';
import CodingPath from './scenes/CodingPath';
import DesignPath from './scenes/DesignPath';
import Ending from './scenes/CUTSCENE/Ending';
import Summarize from './scenes/CUTSCENE/Summarize';

const config = {
  type: Phaser.AUTO,
  pixelArt: true,
  roundPixels: true,
  parent: 'content',
  width: 1280,
  height: 720,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
  scene: [
    // _dev, //! dev mode
    // _mobilesite, //! dev mode
    // _movementTemplate, //! movement template
    // _forest1, //!  forest1 template [dev mode]
    // MainMenu, //* 0 main menu/landing page that have logo and story mode button and endless mode button
    // CutScene1, //* 1 cutscene 1 of the story mode
    // CutScene2, //* 2 cutscene 2 of the story mode
    // CutScene3, //* 3 cutscene 3 of the story mode
    // Delivery, //* 4 delivery game
    // Delivery2, //* 5 delivery game
    Temple, //* 3 temple map that lead to first decision
    PathSelection, //* 4 path selection scene
    CodingPath, //* 5 cutscene that lead to selection of game dev or dev ops
    DesignPath, //* 6 cutscene that lead to selection of front end or web design
    Ending, //* 11 show text1
    Summarize, //* 12 show text2
  ],
  scale: {
    mode: Phaser.Scale.NONE, // Disable Phaser's scaling
  },
};

const game = new Phaser.Game(config);
