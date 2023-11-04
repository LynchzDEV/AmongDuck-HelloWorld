import Phaser from 'phaser';
import playerMoveTemple from '../utils/playerMoveTemple';
import { setWorldBoundsAndCamera } from '../utils/setWorldAndCameraBound';
import { FOREGROUND_DEPTH, PLAYER_DEPTH, SKY_DEPTH } from '../utils/mapDepth';
import { OBJECT_SCROLL } from '../utils/mapObjectScroll';
import {
  MIDDLEGROUND_DEPTH,
  BACKGROUND_COMPONENT_DEPTH,
} from '../utils/mapDepth';
import { updateTextOpacity } from '../utils/event/updateTextOpacity'; // ! new func

// ! test new class for collect item
import {
  CND_TaskManager,
  CND_Task,
  MilkItem,
  CollectableItem,
  Target,
  OverlapObject,
} from '../utils/event/TaskManager';

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
/**
 * @type {MilkItem}
 */
let milkOnCloud;
let readyToCollectMilk = false;
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
    // * new class for collect item
    /**
     * @type {CND_Task}
     */
    this.CND_Key_Task;
    /**
     * @type {CND_Task}
     */
    this.CND_Milks_Task;
    /**
     * @type {CND_Task}
     */
    this.ToGate_Task;
    /**
     * @type {Target}
     */
    this.npc4;
    /**
     * @type {Target}
     */
    this.npc5;
  }

  init(prevContext) {
    const { tasks, items, inventoryDetails, npc } = prevContext;
    /**
     * @type {CND_Task}
     */
    const keyTask = tasks[0],
      /**
       * @type {CND_Task}
       */
      milkTask = tasks[1],
      /**
       * @type {CND_Task}
       */
      gateTask = tasks[2];
    const keyTaskCompleted = keyTask._completed,
      milkTaskCompleted = milkTask._completed,
      gateTaskCompleted = gateTask._completed;
    /**
     * @type {CollectableItem[]}
     */
    const keyItems = items[0],
      /**
       * @type {CollectableItem[]}
       */
      milkItems = items[1],
      /**
       * @type {CollectableItem[]}
       */
      gateItems = items[2];
    /**
     * @type {{itemKey: string, qty: number, inventoryItemSize: number, fst_posX?: number, posY?: number, posX_list?: number[]}}
     */
    const keyInventoryDetails = inventoryDetails[0],
      /**
       * @type {{itemKey: string, qty: number, inventoryItemSize: number, fst_posX?: number, posY?: number, posX_list?: number[]}}
       */
      milkInventoryDetails = inventoryDetails[1],
      /**
       * @type {{itemKey: string, qty: number, inventoryItemSize: number, fst_posX?: number, posY?: number, posX_list?: number[]}}
       */
      gateInventoryDetails = inventoryDetails[2];

    this.CND_Key_Task = new CND_Task(this, keyItems, keyInventoryDetails);
    this.CND_Milks_Task = new CND_Task(this, milkItems, milkInventoryDetails);
    this.ToGate_Task = new CND_Task(this, gateItems, gateInventoryDetails);
    (this.npc4 = npc[0]), (this.npc5 = npc[1]);

    if (!keyTaskCompleted && !keyItems[0].collected) {
      CND_TaskManager.createInventoryItem(this.CND_Key_Task);
    } else if (
      !keyTaskCompleted &&
      keyItems[0].collected &&
      !keyItems[0].delivered
    ) {
      this.CND_Key_Task.items[0].collected = true;
      CND_TaskManager.createInventoryItem(this.CND_Key_Task);
      const { posX_list, scale } = keyInventoryDetails;
      const posX = posX_list[0];
      const posY = keyInventoryDetails.posY || 0;
      this.physics.add
        .image(posX, posY, 'key')
        .setOrigin(0, 0)
        .setDepth(MIDDLEGROUND_DEPTH)
        .setAlpha(1)
        .setScrollFactor(0)
        .setScale(scale);
    } else if (!milkTaskCompleted) {
      this.CND_Key_Task._completed = true;
      CND_TaskManager.createInventoryItem(this.CND_Milks_Task);
      this.CND_Milks_Task._items.forEach((milk, i) => {
        if (milkItems[i].collected) {
          const { posX_list, scale } = milkInventoryDetails;
          const posX = posX_list[i];
          const posY = milkInventoryDetails.posY || 0;
          const tint = milkItems[i].delivered ? 0x000000 : 0xffffff;
          milk.collected = true;
          milk.delivered = milkItems[i].delivered;
          milk.gameObj = this.physics.add
            .image(posX, posY, 'milk')
            .setOrigin(0, 0)
            .setDepth(MIDDLEGROUND_DEPTH)
            .setAlpha(1)
            .setScrollFactor(0)
            .setScale(scale)
            .setTint(tint);
          readyToCollectMilk = i === 2 ? false : true;
        }
      });
    } else if (milkTaskCompleted && !gateTaskCompleted) {
      this.CND_Key_Task._completed = true;
      this.CND_Milks_Task._completed = true;
      readyToCollectMilk = false;
      CND_TaskManager.createInventoryItem(this.ToGate_Task);
    }
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
    milkOnCloud = new MilkItem(
      this.physics,
      [2604, 405],
      0.8,
      MIDDLEGROUND_DEPTH + 1,
      150
    );
    if (!readyToCollectMilk) {
      milkOnCloud.gameObj.setVisible(false);
    }
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
      .setDepth(MIDDLEGROUND_DEPTH);
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

    // handle all collect task
    if (readyToCollectMilk && milkOnCloud.isOverlapWithPlayer(player)) {
      const milkItem = this.CND_Milks_Task.items[2];
      milkItem.collected = true;
      const inventoryDetails = this.CND_Milks_Task.inventoryDetails;
      const { posX_list, scale } = inventoryDetails;
      const posX = posX_list[2];
      const posY = inventoryDetails.posY || 0;
      milkOnCloud.gameObj
        .setPosition(posX, posY)
        .setScale(scale)
        .setScrollFactor(0);
    }

    // ? ester egg
    if (playerEsterEgg) {
      this.updateTextOpacity(player, { x: 1000, y: 1200 }, this.rigroll);
    } else {
      this.rigroll.setAlpha(0);
    }

    // fall down to Delivery3
    if (
      player.body.y + player.body.height >=
      this.physics.world.bounds.height
    ) {
      const gameContext = {
        playerX: player.body.x,
        tasks: [this.CND_Key_Task, this.CND_Milks_Task, this.ToGate_Task],
        items: [
          this.CND_Key_Task._items,
          this.CND_Milks_Task._items,
          this.ToGate_Task._items,
        ],
        inventoryDetails: [
          this.CND_Key_Task._inventoryDetails,
          this.CND_Milks_Task._inventoryDetails,
          this.ToGate_Task._inventoryDetails,
        ],
        npc: [this.npc4, this.npc5],
      };
      this.scene.start('Delivery3', gameContext);
    }
  }
}
export default Delivery4;
