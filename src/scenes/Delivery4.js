import Phaser from 'phaser';
import playerMoveTemple from '../utils/playerMoveTemple';
import { setWorldBoundsAndCamera } from '../utils/setWorldAndCameraBound';
import { FOREGROUND_DEPTH, PLAYER_DEPTH, SKY_DEPTH } from '../utils/mapDepth';
import { OBJECT_SCROLL } from '../utils/mapObjectScroll';
import {
  MIDDLEGROUND_DEPTH,
  BACKGROUND_COMPONENT_DEPTH,
} from '../utils/mapDepth';

import { manageCollectItem } from '../utils/event/collectItem';
import { updateTextOpacity } from '../utils/event/updateTextOpacity'; // ! new func

const isMobile = /mobile/i.test(navigator.userAgent);
const tablet = window.innerWidth < 1280;

let camera;
let backgrounds;
let cloundLayer1;
let cloundLayer2;
let platforms;
let jumppad1;
let jumppad2;
//interaciton
let milk;
//player
let player;

//control flow
let left;
let right;
let up;
let isLeftPressed = false;
let isRightPressed = false;
let isUpPressed = false;

//message easter egg
let playerEsterEgg = true; 

class Delivery4 extends Phaser.Scene {
  constructor() {
    super('Delivery4');
  }

  //! It have some bug, waiting for event fix it.
  // init(data) {
  //   manageCollectItem(this, data.manager.state).initInventory();
  //   console.log(data.manager.inventory);
  //   data.manager.inventory.forEach((item) => {
  //     console.log(item.x, item.y);
  //     this.physics.add
  //       .image(item.x, item.y, item.texture.key)
  //       .setOrigin(0, 0)
  //       .setScale(item.scaleX, item.scaleY)
  //       .setDepth(item.depth)
  //       .setScrollFactor(0);
  //   });
  // }

  setDeviceSpecificControls(height, width, camera) {
    //camera and control for each device
    if (isMobile || tablet) {
      this.input.on('gameobjectdown', (pointer, gameObject) => {
        if (gameObject === left) {
          isLeftPressed = true;
        }
        if (gameObject === right) {
          isRightPressed = true;
        }
        if (gameObject === up) {
          isUpPressed = true;
        }
      });

      this.input.on('gameobjectup', (pointer, gameObject) => {
        if (gameObject === left) {
          isLeftPressed = false;
        }
        if (gameObject === right) {
          isRightPressed = false;
        }
        if (gameObject === up) {
          isUpPressed = false;
        }
      });

      //get screen width and height
      let screenWidth = window.innerWidth;
      let screenHeight = window.innerHeight;

      //device check
      if (isMobile) {
        //mobile
        if (screenHeight > 720) screenHeight = 720;
        console.log('Mobile view');
        console.log(`Screen Width: ${screenWidth}px`);
        console.log(`Screen Height: ${screenHeight}px`);

        left = this.physics.add
          .sprite(screenWidth / 2 - screenWidth / 3, screenHeight / 1.2, 'left')
          .setScale(5)
          .setSize(15, 15)
          .setInteractive()
          .setDepth(999)
          .setAlpha(0.7)
          .setScrollFactor(0);

        right = this.physics.add
          .sprite(
            screenWidth / 2 - screenWidth / 8,
            screenHeight / 1.2,
            'right'
          )
          .setScale(5)
          .setSize(15, 15)
          .setInteractive()
          .setDepth(999)
          .setAlpha(0.7)
          .setScrollFactor(0);

        up = this.physics.add
          .sprite(screenWidth / 2 + screenWidth / 3.5, screenHeight / 1.2, 'up')
          .setScale(5)
          .setSize(15, 15)
          .setInteractive()
          .setDepth(999)
          .setAlpha(0.7)
          .setScrollFactor(0);

        //Implement mobile camera bounds and viewport
        camera.setViewport(
          width / 2 - screenWidth / 2,
          height / 2 - screenHeight / 2,
          screenWidth,
          screenHeight
        );
        camera.setZoom(1);
      } else if (tablet) {
        //tablet
        if (screenHeight > 720) screenHeight = 720;
        console.log('Tablet view');
        console.log(`Screen Width: ${screenWidth}px`);
        console.log(`Screen Height: ${screenHeight}px`);

        left = this.physics.add
          .sprite(
            screenWidth / 2 - screenWidth / 2.5,
            screenHeight / 1.2,
            'left'
          )
          .setScale(7)
          .setSize(15, 15)
          .setInteractive()
          .setDepth(999)
          .setAlpha(0.7)
          .setScrollFactor(0);

        right = this.physics.add
          .sprite(
            screenWidth / 2 - screenWidth / 3.5,
            screenHeight / 1.2,
            'right'
          )
          .setScale(7)
          .setSize(15, 15)
          .setInteractive()
          .setDepth(999)
          .setAlpha(0.7)
          .setScrollFactor(0);

        up = this.physics.add
          .sprite(screenWidth - screenWidth / 8, screenHeight / 1.2, 'up')
          .setScale(7)
          .setSize(15, 15)
          .setInteractive()
          .setDepth(999)
          .setAlpha(0.7)
          .setScrollFactor(0);

        //Implement tablet camera bounds and viewport
        camera.setViewport(
          width / 2 - screenWidth / 2,
          height / 2 - screenHeight / 2,
          screenWidth,
          height
        );
      }
    } else {
      //default (desktop)
      console.log('desktop');
      camera.setViewport(0, 0, width, height);
    }
  }
  addBackgroundElements(mapWidth, mapHeight) {
    backgrounds = this.add.group();
    let bg = this.add
      .tileSprite(0, 0, mapWidth, mapHeight, 'background')
      .setOrigin(0, 0)
      .setScale(1.4)
      .setDepth(SKY_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.CLOUD - 0.1);
    //mid clound
    cloundLayer1 = this.add
      .tileSprite(0, 0, mapWidth, mapHeight, 'clound-layer2')
      .setOrigin(0, 0)
      .setScale(1.4)
      .setDepth(SKY_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.CLOUD);
    // front
    cloundLayer2 = this.add
      .tileSprite(0, 0, mapWidth, mapHeight, 'clound-layer1')
      .setOrigin(0, 0)
      .setScale(1.4)
      .setDepth(SKY_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.CLOUD2);

    backgrounds.add(bg);
    backgrounds.add(cloundLayer2);
    backgrounds.add(cloundLayer1);
  }
  //add platforms
  addPlatforms() {
    platforms = this.physics.add.staticGroup();

    let platfromladderup = this.add
      .image(3264, 1257, 'clound-long1')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(PLAYER_DEPTH + 1);

    let platform1 = this.add
      .image(3007, 837, 'clound')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(PLAYER_DEPTH + 1);

    let platform2 = this.add
      .image(2157, 455, 'clound-long2')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(PLAYER_DEPTH + 1);

    let platoform3 = this.add
      .image(1404, 905, 'clound-long1')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(PLAYER_DEPTH + 1);

    let ladderup = this.add
      .image(3622, 1319, 'ladder')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(PLAYER_DEPTH + 1);

    platforms.add(ladderup);
    platforms.add(platfromladderup);
    platforms.add(platform1);
    platforms.add(platform2);
    platforms.add(platoform3);

    // Set collision boxes for each platform
    platforms.children.iterate((child) => {
      child.body.setSize(child.width, 20).setOffset(0, child.height - 30);
    });
  }
  addMainComponents() {
    milk = this.add
      .image(2604, 405, 'milk')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH + 1);

    // init inventory
  }
  addPlayerAndCollider() {
    //player
    player = this.physics.add
      .sprite(3622, 1319, 'player')
      .setCollideWorldBounds(true)
      .setScale(0.3)
      .setSize(180, 200)
      .setDepth(PLAYER_DEPTH);
    player.setFrame(5);
    this.physics.add.collider(player, platforms);
  }
  addJumpPad() {
    jumppad1 = this.add
      .image(3309, 1370, 'jumppad1')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(FOREGROUND_DEPTH);
    //change depth to Player_depth for hiding it, because platform is player_depth + 1
    jumppad2 = this.add
      .image(3041, 900, 'jumppad1')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(FOREGROUND_DEPTH);
  }

  addMessageEasterEgg() {
    this.rigroll = this.add
      .image(0, 1286, 'rigroll')
      .setOrigin(0, 0)
      .setScale(1)
      .setAlpha(0)
      .setDepth(MIDDLEGROUND_DEPTH)
  }

  create() {
    //config
    const { width, height } = this.scale;
    // main scale
    const mapWidth = width * 3;
    const mapHeight = height * 2;

    //Dev scale 3840 * 1440
    // const mapWidth = width;
    // const mapHeight = height;

    //binding function
    this.playerMoveTemple = playerMoveTemple;
    this.setWorldBoundsAndCamera = setWorldBoundsAndCamera;
    this.updateTextOpacity = updateTextOpacity;

    //setting world and camera
    const returnCamera = this.setWorldBoundsAndCamera(
      mapHeight,
      mapWidth,
      camera
    );
    camera = returnCamera;
    this.setDeviceSpecificControls(height, width, camera);
    //background
    this.addBackgroundElements(mapWidth, mapHeight);
    // platforms
    this.addPlatforms();
    //main components
    this.addMainComponents();
    //player
    this.addPlayerAndCollider();
    //jumppad
    this.addJumpPad();

    //message easter egg
    this.addMessageEasterEgg();
  }

  update(delta, time) {
    // dev skip the scene
    // start temple scene
    // this.scene.start('Temple'); //!dev mode

    //testing movement
    this.playerMoveTemple(player, 1000, false, false, null, null, null);

    //camera follow player
    camera.startFollow(player);

    //? ester egg
    if(playerEsterEgg){
      this.updateTextOpacity(player, {x:1000, y: 1200}, this.rigroll);
    } else {
      this.rigroll.setAlpha(0);
    }
  }
}
export default Delivery4;
