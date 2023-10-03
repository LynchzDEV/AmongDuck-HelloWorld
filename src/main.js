import 'phaser';
import Phaser from 'phaser';
import _dev from './utils/_dev';
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
  type: Phaser.AUTO,
  pixelArt: true,
  roundPixels: true,
  parent: 'content',
  width: '90vw',
  height: '90vh',
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    },
  },
  scene: [
    // MainMenu, //* 0 main menu/landing page that have logo and story mode button and endless mode button
    // CutScene1, //* 1 cutscene 1 of the story mode
    // CutScene2, //* 2 cutscene 2 of the story mode
    Forest1, //* 3 forest map that lead to first decision
    PathSelection, //* 4 path selection scene
    CodingPath, //* 5 cutscene that lead to selection of game dev or dev ops
    DesignPath, //* 6 cutscene that lead to selection of front end or web design
    GameDev, //* 7 game dev scene: parkour
    DevOps, //* 8 dev ops scene: delivery man
    FrontEnd, //* 9 web dev scene: puzzle
    WebDesign, //* 10 web design scene: adventure
    Ending, //* 11 show text1
    Summarize, //* 12 show text2
  ],
  // scene: [_dev] //! dev mode, comment this line to turn off dev mode
};

const game = new Phaser.Game(config);