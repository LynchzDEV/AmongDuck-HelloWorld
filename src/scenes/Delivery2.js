import Phaser from 'phaser';
import playerMoveTemple from '../utils/playerMoveTemple';
import { setWorldBoundsAndCamera } from '../utils/setWorldAndCameraBound';
import {
  SKY_DEPTH,
  BACKGROUND_DEPTH,
  BACKGROUND_COMPONENT_DEPTH,
  MIDDLEGROUND_DEPTH,
  PLAYER_DEPTH,
  FOREGROUND_DEPTH,
} from '../utils/mapDepth';
import { OBJECT_SCROLL } from '../utils/mapObjectScroll';
import {
  shallowWater,
  handleShutdown,
  playerDrown,
} from '../utils/event/drown';
import {
  setInput,
  createInteractInput,
  handleInteractiveBtn,
} from '../utils/interactUtils';
import { updateTextOpacity } from '../utils/event/updateTextOpacity';

// ! test new class for collect item
import {
  CND_TaskManager,
  CND_Task,
  MilkItem,
  KeyItem,
  CollectableItem,
  Item,
  Target,
  OverlapObject,
} from '../utils/event/TaskManager';

const isMobile = /mobile/i.test(navigator.userAgent);
const tablet = window.innerWidth < 1280;

let backgrounds;
let water;
let cloundLayer1;
let cloundLayer2;
let platforms;
let components;
let camera;
//slide platform
let platformSlide1;
let platformSlide2;
//gate
let gatePrevious;
let gateNext;
//interaction
let key;
let chest;
let milk;
let house;
let shallow_water;
//npc
let npc3;
//player
let player;
//control flow
let left;
let right;
let up;
let interactKey; // ! add this for another scene too
const windowHeight = window.innerHeight > 720 ? 720 : window.innerHeight; // ! add this for another scene too
let interactButton; // ! add this for another scene too
let isLeftPressed = false;
let isRightPressed = false;
let isUpPressed = false;

let deliverToChest = true;
let readyToCollectMilk = false;
// * new class for collect item
/**
 * @type {CND_Task}
 */
let CND_Key_Task;
/**
 * @type {CND_Task}
 */
let CND_Milk_Task;
/**
 * @type {CND_Task}
 */
let ToGate_Task;

class Delivery2 extends Phaser.Scene {
  constructor() {
    super({
      key: 'Delivery2',
    });
  }

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
        // ! set new pos for mobile
        screenHeight = windowHeight;
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

        // ! create interact btn for mobile
        interactButton = createInteractInput(
          this.input.keyboard,
          'mobile',
          this.physics,
          [screenWidth / 2 + screenWidth / 3.5, screenHeight / 1.2],
          'inBtn'
        );

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
        // ! set new pos for tablet
        screenHeight = windowHeight;
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

        // ! create interact btn for tablet
        interactButton = createInteractInput(
          this.input.keyboard,
          'tablet',
          this.physics,
          [screenWidth - screenWidth / 8, screenHeight / 1.2],
          'inBtn'
        );

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
      // ! add interaction key
      interactKey = createInteractInput(this.input.keyboard, 'desktop');
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
  //water
  addForegroundElements(mapWidth, mapHeight) {
    water = this.add
      .tileSprite(0, mapHeight - 150, mapWidth, 200, 'water')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);

    shallow_water = shallowWater(
      this,
      0,
      mapHeight + 30,
      mapWidth * 2,
      200,
      BACKGROUND_COMPONENT_DEPTH
    );

    this.physics.add.existing(shallow_water);
  }
  //add platforms
  addPlatforms(floorHeight) {
    platforms = this.physics.add.staticGroup();
    let ground = this.add
      .tileSprite(-810, floorHeight, 1383, 218, 'ground-main')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);
    platformSlide1 = this.physics.add
      .image(573, 1235, 'platform')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);
    let platformHouse = this.add
      .image(1294, 1236, 'platform-long3')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);

    //path to key
    let platformToKey1 = this.add
      .image(2268, 1142, 'platform')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);
    let platformToKey2 = this.add
      .image(2600, 1032, 'platform-long1')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);
    platformSlide2 = this.physics.add
      .image(3066, 893, 'platform')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);
    let platformToKey3 = this.add
      .image(2804, 582, 'platform')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);
    //key on this platform
    let platformToKey4 = this.add
      .image(2270, 458, 'platform-long1')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);

    //path to chest
    let platformToChest1 = this.add
      .image(1069, 1068, 'platform')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);
    let platformToChest2 = this.add
      .image(625, 940, 'platform-long1')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);
    let platformToChest3 = this.add
      .image(353, 810, 'platform')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);
    let platformToChest4 = this.add
      .image(84, 717, 'platform')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);

    //gate on this platform
    let platformGate = this.add
      .image(3418, 360, 'platform-long1')
      .setOrigin(0, 0)
      .setScale(0.8, 1)
      .setDepth(MIDDLEGROUND_DEPTH);

    platforms.add(ground);
    platforms.add(platformHouse);
    platforms.add(platformToKey1);
    platforms.add(platformToKey2);
    platforms.add(platformToKey3);
    platforms.add(platformToKey4);
    platforms.add(platformToChest1);
    platforms.add(platformToChest2);
    platforms.add(platformToChest3);
    platforms.add(platformToChest4);
    platforms.add(platformGate);
    // Set collision boxes for each platform
    platforms.children.iterate((child) => {
      child.body.setSize(child.width, 20).setOffset(0, 0);
    });

    //set move platform
    this.slide = this.tweens.add({
      targets: platformSlide1,
      x: 1075,
      ease: 'Expo.easeInOut',
      duration: 3000,
      repeat: -1,
      yoyo: true,
    });
    this.tweens.add({
      targets: platformSlide2,
      y: 443,
      ease: 'LINEAR',
      duration: 4000,
      repeat: -1,
      yoyo: true,
    });

    platformSlide1.body.setAllowGravity(false);
    platformSlide1.body.setImmovable(true);
    platformSlide2.body.setAllowGravity(false);
    platformSlide2.body.setImmovable(true);
  }

  //house gate chest key milk
  addMainComponents() {
    components = this.add.group();
    house = this.add
      .image(1439, 834, 'house2')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);
    gatePrevious = this.add
      .image(52, 1140, 'gate-active')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);

    milk = new MilkItem(
      this.physics,
      [190, 665],
      0.8,
      MIDDLEGROUND_DEPTH + 1,
      150
    );
    milk.gameObj.setVisible(false);

    key = new KeyItem(this.physics, [2400, 370], 1, MIDDLEGROUND_DEPTH, 100);

    chest = new Target(
      { itemKey: 'key', qty: 1 },
      this.physics,
      'sprite',
      [150, 615],
      'chest',
      1,
      MIDDLEGROUND_DEPTH
    );
    chest.gameObj.setFrame(21);

    gateNext = new OverlapObject(
      this.physics,
      'image',
      [3600, 270],
      'gate',
      1,
      MIDDLEGROUND_DEPTH,
      90
    );
    gateNext.gameObj.flipX = true;

    components.add(house);
    components.add(gatePrevious);

    // ! new class for collect item
    // * create key task
    CND_Key_Task = new CND_Task(this, [key], {
      itemKey: key.textureKey,
      qty: 1,
      inventoryItemSize: 100,
      fst_posX: 30,
      posY: 30,
    });

    // * create milk task
    CND_Milk_Task = new CND_Task(this, [milk], {
      itemKey: milk.textureKey,
      qty: 1,
      inventoryItemSize: milk.inventoryItemSize,
    });

    // * create to-gate task
    ToGate_Task = new CND_Task(this, [gateNext], {
      itemKey: gateNext.textureKey,
      qty: 1,
      inventoryItemSize: 90,
      fst_posX: 50,
      posY: 30,
    });

    CND_TaskManager.createInventoryItem(CND_Key_Task);
  }
  //add props stone sakura tree logs
  addComponents() {
    this.add
      .image(280, 1120, 'logs')
      .setScale(1)
      .setOrigin(0, 0)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
    this.add
      .image(0, 800, 'tree')
      .setScale(1)
      .setOrigin(0, 0)
      .setDepth(BACKGROUND_COMPONENT_DEPTH - 1);
    this.add
      .image(1179, 990, 'log')
      .setScale(1)
      .setOrigin(0, 0)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);

    // chest platform
    this.add
      .image(93, 644, 'brush')
      .setScale(1)
      .setOrigin(0, 0)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
    this.add
      .image(130, 712, 'vine')
      .setScale(1)
      .setOrigin(0, 0)
      .setDepth(MIDDLEGROUND_DEPTH + 1).flipX = true;

    this.add
      .image(504, 774, 'grass2')
      .setScale(1)
      .setOrigin(0, 0)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
    this.add
      .image(676, 834, 'stone-wall')
      .setScale(1)
      .setOrigin(0, 0)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
    this.add
      .image(662, 870, 'box')
      .setScale(1)
      .setOrigin(0, 0)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
    this.add
      .image(680, 750, 'lantern')
      .setScale(1)
      .setOrigin(0, 0)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);

    //house platforms
    this.add
      .image(1420, 621, 'sakura-tree')
      .setScale(1)
      .setOrigin(0, 0)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);

    //path to key
    this.add
      .image(2372, 1090, 'stone')
      .setScale(1)
      .setOrigin(0, 0)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
    this.add
      .image(2637, 930, 'tou')
      .setScale(1)
      .setOrigin(0, 0)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
    this.add
      .image(2872, 576, 'vine')
      .setScale(1)
      .setOrigin(0, 0)
      .setDepth(MIDDLEGROUND_DEPTH + 1);
    this.add
      .image(2804, 558, 'grass')
      .setScale(1)
      .setOrigin(0, 0)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
    this.add
      .image(2322, 352, 'bench')
      .setScale(1)
      .setOrigin(0, 0)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
  }
  //player and colider
  addPlayerAndColider(floorHeight) {
    //player
    player = this.physics.add
      .sprite(100, floorHeight - 150, 'player')
      .setCollideWorldBounds(true)
      .setScale(0.3)
      .setSize(180, 200)
      .setDepth(PLAYER_DEPTH);
    player.setFrame(5);
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player, platformSlide1);
    this.physics.add.collider(player, platformSlide2);
  }

  //npc
  addNpc() {
    npc3 = new Target(
      { itemKey: 'milk', qty: 1 },
      this.physics,
      'sprite',
      [1900, 1148],
      'npc3',
      0.2,
      MIDDLEGROUND_DEPTH
    );
    npc3.gameObj.anims.play('idle_npc3', true);
    npc3.gameObj.flipX = true;
  }

  //message
  addMessage() {
    //message for npc interaction
    this.messageNpc3 = this.add
      .image(1911, 1040, 'message-n3')
      .setOrigin(0, 0)
      .setAlpha(0)
      .setScale(1)
      .setDepth(PLAYER_DEPTH);

    //message require milk
    this.requireNpc3 = this.add
      .image(1983, 1181, 'require1')
      .setOrigin(0, 0)
      .setAlpha(0)
      .setScale(1)
      .setDepth(PLAYER_DEPTH);
  }

  //animation chest npc
  addAnimations() {
    this.anims.create({
      key: 'chest-rotate',
      frames: this.anims.generateFrameNumbers('chest', {
        start: 21,
        end: 27,
      }),
      frameRate: 3,
      repeat: 0,
    });

    // sprite sheet for npc1
    this.anims.create({
      key: 'idle_npc3',
      frames: this.anims.generateFrameNumbers('npc3', {
        start: 0,
        end: 1,
      }),
      frameRate: 1,
      repeat: -1,
    });
  }
  // * update item opacity
  updateItemOpacity(item, destination) {
    const playerX = player.x;
    const playerY = player.y;
    const destinationX = destination.x;
    const destinationY = destination.y;

    const distance = Phaser.Math.Distance.Between(
      playerX,
      playerY,
      destinationX,
      destinationY
    );

    const minOpacity = 0;
    const maxOpacity = 1;

    const maxDistance = 2000;

    const opacity = Phaser.Math.Linear(
      minOpacity,
      maxOpacity,
      Phaser.Math.Clamp(1 - distance / maxDistance, 0, 1)
    );

    item.setAlpha(opacity);
  }

  // * bind function to target
  bindFnToTarget() {
    npc3.gameObj.fn = () => {
      this.requireNpc3.x = 1983;
      this.tweens.add({
        targets: this.requireNpc3,
        x: this.requireNpc3.x - 10,
        duration: 100,
        ease: 'Linear',
        repeat: 3,
        yoyo: true,
      });
      CND_TaskManager.handleDeliverItem(
        npc3,
        [CND_Milk_Task, ToGate_Task],
        this.tweens,
        this.messageNpc3,
        this.requireNpc3
      );
    };
  }

  init() {
    this.playerMoveTemple = playerMoveTemple;
    this.sound.stopByKey('drown');
    deliverToChest = true;
    readyToCollectMilk = false;
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

    const floorHeight = mapHeight - 215;

    //binding function
    this.playerMoveTemple = playerMoveTemple;
    this.setWorldBoundsAndCamera = setWorldBoundsAndCamera;
    this.updateTextOpacity = updateTextOpacity;
    this.handleInteractiveBtn = handleInteractiveBtn; // ! new func

    //setting world and camera
    const returnCamera = this.setWorldBoundsAndCamera(
      mapHeight,
      mapWidth,
      camera
    );
    camera = returnCamera;
    this.setDeviceSpecificControls(height, width, camera);

    this.addAnimations();
    // background
    this.addBackgroundElements(mapWidth, mapHeight);
    // foreground
    this.addForegroundElements(mapWidth, mapHeight);
    // platforms
    this.addPlatforms(floorHeight);
    // main components
    this.addMainComponents();
    // props
    this.addComponents();
    // player
    this.addPlayerAndColider(floorHeight);
    // npc
    this.addNpc();
    // message
    this.addMessage();

    // * init the input
    setInput(this.input);
    // * bind target to interact btn
    this.bindFnToTarget();
    // * handle shutdown
    handleShutdown(this);
  }

  update(delta, time) {
    // dev skip the scene
    // this.scene.start('Delivery3'); // ! comment for working in event_handling branch

    //player movement
    if (isMobile || tablet) {
      this.playerMoveTemple(
        player,
        500,
        false,
        true,
        isLeftPressed,
        isRightPressed,
        isUpPressed
      );
    } else {
      this.playerMoveTemple(player, 1000, false, false, null, null, null);
    }

    //camera follow player
    camera.startFollow(player);

    //player drown
    playerDrown(this, player, shallow_water);

    // handle all collect task
    CND_TaskManager.handleCollectItem(player, [CND_Key_Task]);
    if (readyToCollectMilk) {
      CND_TaskManager.handleCollectItem(player, [CND_Milk_Task]);
    }

    // handle key deliver task
    if (chest.isOverlapWithPlayer(player)) {
      CND_TaskManager.handleDeliverItem(chest, [
        CND_Key_Task,
        CND_Milk_Task,
        ToGate_Task,
      ]);
    }
    if (deliverToChest) {
      deliverToChest = !chest.satisfied;
      if (!deliverToChest) {
        // * play animation 'opening chest'
        this.anims.play('chest-rotate', chest.gameObj);
        // * spawn milk after 2.3s (duration of animation)
        this.time.delayedCall(2300, () => {
          milk.gameObj.setVisible(true);
          // * milk float up until 0.45s
          milk.gameObj.setVelocityY(-100);
          this.time.delayedCall(450, () => {
            milk.gameObj.setVelocityY(0);
            readyToCollectMilk = true;
          });
        });
      }
    }

    // handle interact btn for // ! npc3
    this.handleInteractiveBtn(
      !isMobile && !tablet,
      interactKey,
      up,
      interactButton,
      player,
      npc3,
      [chest]
    );

    // * updateTextOpacity(player, target, message)
    this.updateTextOpacity(player, this.requireNpc3, this.requireNpc3);

    // * all c&d task were done, ready to go to next scene
    if (CND_Milk_Task._completed && !ToGate_Task._completed) {
      let gateBox = ToGate_Task._inventoryBox[0];
      let gate = ToGate_Task._items[0];
      gate.gameObj.setTexture('gate-active');
      if (gate.isOverlapWithPlayer(player)) {
        this.scene.start('Delivery3');
      } else {
        this.updateItemOpacity(gateBox, gate.gameObj);
      }
    }
  }
}

export default Delivery2;
