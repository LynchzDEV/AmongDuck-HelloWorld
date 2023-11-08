import Phaser from "phaser";
import playerMoveTemple from "../utils/playerMoveTemple";
import { setWorldBoundsAndCamera } from "../utils/setWorldAndCameraBound";
import {
  BACKGROUND_COMPONENT_DEPTH,
  FOREGROUND_DEPTH,
  MIDDLEGROUND_DEPTH,
  SKY_DEPTH,
  PLAYER_DEPTH,
} from "../utils/mapDepth";
import { OBJECT_SCROLL } from "../utils/mapObjectScroll";
import {
  shallowWater,
  handleShutdown,
  playerDrown,
} from "../utils/event/drown";
import {
  setInput,
  createInteractInput,
  handleInteractiveBtn,
} from "../utils/interactUtils";
import { updateTextOpacity } from "../utils/event/updateTextOpacity"; // ! new func

// ! test new class for collect item
import {
  CND_TaskManager,
  CND_Task,
  MilkItem,
  KeyItem,
  CollectableItem,
  Target,
  OverlapObject,
} from "../utils/event/TaskManager";

const isMobile = /mobile/i.test(navigator.userAgent);
const tablet = window.innerWidth < 1280;

let camera;
let water;
let backgrounds;
let bg;
let cloundLayer1;
let cloundLayer2;
let platforms;
let components;
let jumppad1;
let jumppad2;
let noGravityPad;
//gate
let gatePrevious;
let gateNext;
//interaction
let milkInChest;
let milkOnBench;
let milkOnCloud;
let house;
let house2;
let chest;
let key;
let sign;
let ladder = {};
ladder.fnCalled = 0;
let shallow_water;
let isPlayerFallDown = false;
let haveBeenToDelivery4 = false;
//npc // ! new component
let npc4, npc5;
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

let ableToPlayChestAnimation = true;
let deliverToChest = true;
let readyToCollectMilk = false;

class Delivery3 extends Phaser.Scene {
  constructor() {
    super("Delivery3");
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
  }

  setDeviceSpecificControls(height, width, camera) {
    //camera and control for each device
    if (isMobile || tablet) {
      this.input.on("gameobjectdown", (pointer, gameObject) => {
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

      this.input.on("gameobjectup", (pointer, gameObject) => {
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
        console.log("Mobile view");
        console.log(`Screen Width: ${screenWidth}px`);
        console.log(`Screen Height: ${screenHeight}px`);

        left = this.physics.add
          .sprite(screenWidth / 2 - screenWidth / 3, screenHeight / 1.2, "left")
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
            "right"
          )
          .setScale(5)
          .setSize(15, 15)
          .setInteractive()
          .setDepth(999)
          .setAlpha(0.7)
          .setScrollFactor(0);

        up = this.physics.add
          .sprite(screenWidth / 2 + screenWidth / 3.5, screenHeight / 1.2, "up")
          .setScale(5)
          .setSize(15, 15)
          .setInteractive()
          .setDepth(999)
          .setAlpha(0.7)
          .setScrollFactor(0);

        // ! create interact btn for mobile
        interactButton = createInteractInput(
          this.input.keyboard,
          "mobile",
          this.physics,
          [screenWidth / 2 + screenWidth / 3.5, screenHeight / 1.2],
          "inBtn"
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
        console.log("Tablet view");
        console.log(`Screen Width: ${screenWidth}px`);
        console.log(`Screen Height: ${screenHeight}px`);

        left = this.physics.add
          .sprite(
            screenWidth / 2 - screenWidth / 2.5,
            screenHeight / 1.2,
            "left"
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
            "right"
          )
          .setScale(7)
          .setSize(15, 15)
          .setInteractive()
          .setDepth(999)
          .setAlpha(0.7)
          .setScrollFactor(0);

        up = this.physics.add
          .sprite(screenWidth - screenWidth / 8, screenHeight / 1.2, "up")
          .setScale(7)
          .setSize(15, 15)
          .setInteractive()
          .setDepth(999)
          .setAlpha(0.7)
          .setScrollFactor(0);

        // ! create interact btn for tablet
        interactButton = createInteractInput(
          this.input.keyboard,
          "tablet",
          this.physics,
          [screenWidth - screenWidth / 8, screenHeight / 1.2],
          "inBtn"
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
      console.log("desktop");
      camera.setViewport(0, 0, width, height);
      // ! add interaction key
      interactKey = createInteractInput(this.input.keyboard, "desktop");
    }
  }
  addBackgroundElements(mapWidth, mapHeight) {
    backgrounds = this.add.group();
    bg = this.add
      .tileSprite(0, 0, mapWidth, mapHeight, "background")
      .setOrigin(0, 0)
      .setScale(1.6)
      .setDepth(SKY_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.CLOUD - 0.1);
    //mid clound
    cloundLayer1 = this.add
      .tileSprite(0, 50, mapWidth, mapHeight, "clound-layer2")
      .setOrigin(0, 0)
      .setScale(1.6)
      .setDepth(SKY_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.CLOUD);
    // front
    cloundLayer2 = this.add
      .tileSprite(0, 60, mapWidth, mapHeight, "clound-layer1")
      .setOrigin(0, 0)
      .setScale(1.6)
      .setDepth(SKY_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.CLOUD2);

    backgrounds.add(bg);
    backgrounds.add(cloundLayer2);
    backgrounds.add(cloundLayer1);
  }
  //water
  addForegroundElements(mapWidth, mapHeight) {
    water = this.add
      .sprite(0, mapHeight - 160, "water-sprite")
      .setOrigin(0, 0)
      .setScale(1.1)
      .setDepth(PLAYER_DEPTH + 1)
      .setScrollFactor(OBJECT_SCROLL.PLAYER);

    water.anims.play("waterAnim", true);

    water = this.add
      .sprite(1840, mapHeight - 160, "water-sprite")
      .setOrigin(0, 0)
      .setScale(1.1)
      .setDepth(PLAYER_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.PLAYER);

    water.anims.play("waterAnim", true);

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
  addPlatforms(floorHeight) {
    platforms = this.physics.add.staticGroup();
    let ground = this.add
      .image(-150, floorHeight + 5, "ground-main3") // ! set new x,y, maybe temporary
      .setOrigin(0, 0)
      .setDepth(PLAYER_DEPTH + 2);
    let platformHouse = this.add
      .image(647, 1230, "platform-long4")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);
    //path to jump
    let platformToJump1 = this.add
      .image(2260, 1084, "platform2")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);
    let platformToJump2 = this.add
      .image(2628, 986, "platform")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);
    //this platform has jump boost
    let platformToJump3 = this.add
      .image(2890, 870, "platform2")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);

    //path to gateNext
    let platformToGateNext1 = this.add
      .image(3275, 944, "platform")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);
    //this platform has gate.
    let platformToGateNext2 = this.add
      .image(3445, 1230, "platform2")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);

    //path to chest
    let platformToChest1 = this.add
      .image(1982, 391, "platform")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);

    //path to milk
    let platformToMilk1 = this.add
      .image(477, 218, "platform2")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);

    let ladderPlatform = this.add
      .image(3435, 231, "platform2")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);

    platforms.add(ground);
    platforms.add(platformHouse);
    platforms.add(platformToJump1);
    platforms.add(platformToJump2);
    platforms.add(platformToJump3);
    platforms.add(platformToGateNext1);
    platforms.add(platformToGateNext2);
    platforms.add(platformToChest1);
    platforms.add(platformToMilk1);
    platforms.add(ladderPlatform);

    // Set collision boxes for each platform
    platforms.children.iterate((child) => {
      child.body.setSize(child.width, 20).setOffset(0, 0);
    });
  }
  initMainComponents() {
    gateNext = new OverlapObject(
      this.physics,
      "image",
      [3640, 1145],
      "gate",
      1,
      MIDDLEGROUND_DEPTH,
      90
    );
    gateNext.gameObj.flipX = true;

    chest = new Target(
      { itemKey: "key", qty: 1 },
      this.physics,
      "sprite",
      [2010, 285],
      "chest",
      1,
      MIDDLEGROUND_DEPTH
    );
    chest.gameObj.setFrame(21);

    key = new KeyItem(this.physics, [2400, 1023], 1, MIDDLEGROUND_DEPTH, 100);

    milkInChest = new MilkItem(
      this.physics,
      [2050, 335],
      0.8,
      MIDDLEGROUND_DEPTH + 1,
      150
    );
    milkInChest.gameObj.setVisible(false);

    milkOnBench = new MilkItem(
      this.physics,
      [550, 120],
      0.8,
      MIDDLEGROUND_DEPTH,
      150
    );
    milkOnBench.gameObj.setVisible(false);

    milkOnCloud = new MilkItem(
      this.physics,
      [0, 1500], // * out of screen
      0.8,
      MIDDLEGROUND_DEPTH,
      150
    );
    milkOnCloud.gameObj.setVisible(false);

    ladder = new OverlapObject(
      this.physics,
      "image",
      [3609, 0],
      "ladder",
      1,
      MIDDLEGROUND_DEPTH
    );
  }
  addMainComponents() {
    //add gate
    gatePrevious = this.physics.add
      .image(52, 1145, "gate-active")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);
    house = this.add
      .image(1311, 720, "house4")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
    house2 = this.add
      .image(845, 939, "house3")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
    sign = this.add
      .image(3456, 1088, "sign")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);

    if (!isPlayerFallDown) {
      this.initMainComponents();

      // ! new class for collect item
      // * create key task
      this.CND_Key_Task = new CND_Task(this, [key], {
        itemKey: key.textureKey,
        qty: 1,
        inventoryItemSize: 100,
        fst_posX: 30,
        posY: 30,
      });

      // * create milk task
      this.CND_Milks_Task = new CND_Task(
        this,
        [milkInChest, milkOnBench, milkOnCloud],
        {
          itemKey: milkInChest.textureKey,
          qty: 3,
          inventoryItemSize: milkInChest.inventoryItemSize,
        }
      );

      // * create to-gate task
      this.ToGate_Task = new CND_Task(this, [gateNext], {
        itemKey: gateNext.textureKey,
        qty: 1,
        inventoryItemSize: 90,
        fst_posX: 50,
        posY: 30,
      });

      CND_TaskManager.createInventoryItem(this.CND_Key_Task);
    }
  }
  //props
  addComponents() {
    //straw
    this.add
      .image(676, 1148, "straw1")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
    this.add
      .image(751, 1169, "straw2")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
    this.add
      .image(800, 1050, "lantern")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);

    //sakura
    let sakuraAnim = this.add
      .sprite(760, 612, "sakuraAnim")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH + 1);

    sakuraAnim.flipX = true;
    sakuraAnim.anims.play("sakuraAnim", true);

    let xPositions = [800, 1200];
    let yPositions = [800, 850];

    for (let i = 0; i < xPositions.length; i++) {
      let x = xPositions[i];
      let y = yPositions[i];

      let sakura = this.add
        .sprite(x, y, "sakura-sprite")
        .setOrigin(0, 0)
        .setScale(1.1)
        .setDepth(FOREGROUND_DEPTH - 1);

      sakura.anims.play("sakura", true);
      sakura.flipX = true;
    }

    //key brush
    this.add
      .image(2350, 1003, "brush")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH - 1).flipX = true;

    //chest prop
    this.add
      .image(1996, 319, "box")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH - 1);
    this.add
      .image(2020, 200, "lantern")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
    this.add
      .image(2000, 386, "vine")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH + 1).flipX = true;

    //milk props
    this.add
      .image(493, 112, "bench")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);

    this.add
      .image(570, 137, "brush")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH - 1).flipX = true;

    //ladder props
    this.add
      .image(3609, 225, "vine")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH + 1);
  }

  //npc
  initNpc() {
    npc4 = new Target(
      { itemKey: "milk", qty: 1 },
      this.physics,
      "sprite",
      [859, 1130],
      "npc4",
      0.2,
      MIDDLEGROUND_DEPTH
    );
    npc4.gameObj.anims.play("idle_npc4", true);
    npc5 = new Target(
      { itemKey: "milk", qty: 2 },
      this.physics,
      "sprite",
      [1900, 1130],
      "npc5",
      0.2,
      MIDDLEGROUND_DEPTH
    );
    npc5.gameObj.anims.play("idle_npc5", true);
    npc5.gameObj.flipX = true;
  }
  addNpc() {
    if (!isPlayerFallDown) {
      this.initNpc();
    }
  }
  //message
  initRequireMessage() {
    //message require milk
    this.requireNpc4 = this.add
      .image(703, 1167, "require1")
      .setOrigin(0, 0)
      .setAlpha(0)
      .setScale(1)
      .setDepth(PLAYER_DEPTH);
    this.requireNpc5 = this.add
      .image(1971, 1169, "require2")
      .setOrigin(0, 0)
      .setAlpha(0)
      .setScale(1)
      .setDepth(PLAYER_DEPTH);
  }
  addMessage() {
    //message for npc interaction
    this.messageNpc4 = this.add
      .image(639, 1025, "message-n4")
      .setOrigin(0, 0)
      .setAlpha(0)
      .setScale(1)
      .setDepth(PLAYER_DEPTH);
    this.messageNpc5 = this.add
      .image(1918, 1042, "message-n5")
      .setOrigin(0, 0)
      .setAlpha(0)
      .setScale(1)
      .setDepth(PLAYER_DEPTH);

    if (!isPlayerFallDown) {
      this.initRequireMessage();
    }
  }

  addAnimations() {
    //npc4
    this.anims.create({
      key: "idle_npc4",
      frames: this.anims.generateFrameNumbers("npc4", {
        start: 0,
        end: 1,
      }),
      frameRate: 1,
      repeat: -1,
    });
    //npc5
    this.anims.create({
      key: "idle_npc5",
      frames: this.anims.generateFrameNumbers("npc5", {
        start: 0,
        end: 1,
      }),
      frameRate: 1,
      repeat: -1,
    });
  }
  //adding jumppad
  addJumppad() {
    jumppad1 = this.physics.add
      .image(2914, 861, "jumppad2")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(FOREGROUND_DEPTH);

    jumppad2 = this.add
      .sprite(2914, 610, "jumppad")
      .setOrigin(0, 0)
      .setScale(0.38)
      .setAlpha(0.7)
      .setDepth(MIDDLEGROUND_DEPTH);

    this.anims.create({
      key: "jumppad",
      frames: this.anims.generateFrameNumbers("jumppad", {
        start: 0,
        end: 7,
      }),
      frameRate: 12,
      repeat: -1,
      repeatDelay: 500,
    });

    this.tweens.add({
      targets: jumppad2,
      alpha: 0.3,
      duration: 700,
      yoyo: true,
      repeat: -1,
      repeatDelay: 500,
    });

    jumppad1.body.setAllowGravity(false);
    jumppad1.body.setImmovable(true);
    jumppad2.anims.play("jumppad", true);
  }
  addPlayerAndCollider(floorHeight) {
    if (!isPlayerFallDown) {
      // player;
      player = this.physics.add
        .sprite(100, floorHeight - 40, "player")
        .setCollideWorldBounds(true)
        .setScale(0.3)
        .setSize(180, 200)
        .setDepth(PLAYER_DEPTH);
      // player = this.physics.add // ! comment for working in event_handling branch
      //   .sprite(3609, 0, 'player') // ! spawn at ladder
      //   .setCollideWorldBounds(true)
      //   .setScale(0.3)
      //   .setSize(180, 200)
      //   .setDepth(PLAYER_DEPTH);
    }
    player.setFrame(5);
    this.physics.add.collider(player, platforms);
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
    ladder.gameObj.fn = () => {
      haveBeenToDelivery4 = true;
      const gameContext = {
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
        npc: [npc4, npc5],
      };
      this.scene.start("Delivery4", gameContext);
    };

    npc4.gameObj.fn = () => {
      this.requireNpc4.x = 703;
      this.tweens.add({
        targets: this.requireNpc4,
        x: this.requireNpc4.x - 10,
        duration: 100,
        ease: "Linear",
        repeat: 3,
        yoyo: true,
      });
      CND_TaskManager.handleDeliverItem(
        npc4,
        [this.CND_Milks_Task, this.ToGate_Task],
        this.tweens,
        this.messageNpc4,
        this.requireNpc4
      );
    };

    npc5.gameObj.fn = () => {
      this.requireNpc5.x = 1971;
      this.tweens.add({
        targets: this.requireNpc5,
        x: this.requireNpc5.x - 10,
        duration: 100,
        ease: "Linear",
        repeat: 3,
        yoyo: true,
      });
      CND_TaskManager.handleDeliverItem(
        npc5,
        [this.CND_Milks_Task, this.ToGate_Task],
        this.tweens,
        this.messageNpc5,
        this.requireNpc5
      );
    };
  }

  init(prevContext) {
    this.playerMoveTemple = playerMoveTemple;
    this.sound.stopByKey("drown");
    ableToPlayChestAnimation = true;
    deliverToChest = true;
    readyToCollectMilk = false;

    if (haveBeenToDelivery4) {
      isPlayerFallDown = true;
      const { playerX, tasks, items, inventoryDetails, npc } = prevContext;
      // * fall dowm from Delivery4
      player = this.physics.add
        .sprite(playerX, 0, "player")
        .setCollideWorldBounds(true)
        .setScale(0.3)
        .setSize(180, 200)
        .setDepth(PLAYER_DEPTH);

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

      this.initMainComponents();
      this.initRequireMessage();
      this.initNpc();

      this.CND_Key_Task = new CND_Task(this, [key], keyInventoryDetails);
      this.CND_Milks_Task = new CND_Task(
        this,
        [milkInChest, milkOnBench, milkOnCloud],
        milkInventoryDetails
      );
      this.ToGate_Task = new CND_Task(this, [gateNext], gateInventoryDetails);

      if (!keyTaskCompleted && !keyItems[0].collected) {
        CND_TaskManager.createInventoryItem(this.CND_Key_Task);
      } else if (
        !keyTaskCompleted &&
        keyItems[0].collected &&
        !keyItems[0].delivered
      ) {
        CND_TaskManager.createInventoryItem(this.CND_Key_Task);
        const { posX_list, scale } = keyInventoryDetails;
        const posX = posX_list[0];
        const posY = keyInventoryDetails.posY || 0;
        key.collected = true;
        key.gameObj.setPosition(posX, posY).setScale(scale).setScrollFactor(0);
      } else if (!milkTaskCompleted && !gateTaskCompleted) {
        ableToPlayChestAnimation = false;
        key.gameObj.setVisible(false);
        key.collected = true;
        key.delivered = true;
        chest.satisfied = true;
        chest.gameObj.setFrame(27);
        this.CND_Key_Task._completed = true;
        (npc4.satisfied = npc[0].satisfied),
          (npc5.satisfied = npc[1].satisfied);
        if (npc4.satisfied) {
          this.requireNpc4.setTexture("thx");
        }
        if (npc5.satisfied) {
          this.requireNpc5.setTexture("thx");
        }
        CND_TaskManager.createInventoryItem(this.CND_Milks_Task);
        this.CND_Milks_Task._items.forEach((milk, i) => {
          const { posX_list, scale } = milkInventoryDetails;
          const posX = posX_list[i];
          const posY = milkInventoryDetails.posY || 0;
          if (milkItems[i].collected) {
            const tint = milkItems[i].delivered ? 0x000000 : 0xffffff;
            milk.collected = true;
            milk.delivered = milkItems[i].delivered;
            milk.gameObj
              .setPosition(posX, posY)
              .setScale(scale)
              .setTint(tint)
              .setScrollFactor(0);
          } else {
            milk.gameObj.y = i === 0 ? 288 : milk.gameObj.y;
          }
          milk.gameObj.setVisible(true);
          readyToCollectMilk = true;
        });
      } else if (milkTaskCompleted && !gateTaskCompleted) {
        ableToPlayChestAnimation = false;
        key.gameObj.setVisible(false);
        key.collected = true;
        key.delivered = true;
        chest.satisfied = true;
        chest.gameObj.setFrame(27);
        this.CND_Key_Task._completed = true;
        this.CND_Milks_Task._completed = true;
        (npc4.satisfied = npc[0].satisfied),
          (npc5.satisfied = npc[1].satisfied);
        if (npc4.satisfied) {
          this.requireNpc4.setTexture("thx");
        }
        if (npc5.satisfied) {
          this.requireNpc5.setTexture("thx");
        }
        CND_TaskManager.createInventoryItem(this.ToGate_Task);
      }
    }
  }

  create() {
    this.cameras.main.fadeIn(500);
    //config
    const { width, height } = this.scale;
    // main scale
    const mapWidth = width * 3;
    const mapHeight = height * 2;

    //! Dev scale 3840 * 1440
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
    //add animations
    this.addAnimations();
    //add background
    this.addBackgroundElements(mapWidth, mapHeight);
    //add foreground
    this.addForegroundElements(mapWidth, mapHeight);
    //add platforms
    this.addPlatforms(floorHeight);
    //add main components
    this.addMainComponents();
    //add props
    this.addComponents();
    //add player
    this.addPlayerAndCollider(floorHeight);
    //add npc
    this.addNpc();
    //add jumppad
    this.addJumppad();
    //add message
    this.addMessage();

    // * init the input
    setInput(this.input);
    // * bind target to interact btn
    this.bindFnToTarget();
    // * handle shutdown
    handleShutdown(this);
  }

  update(delta, time) {
    //dev skip the scene
    // this.scene.start("Summarize"); // ! comment for working in event_handling branch

    bg.tilePositionX += 0.03;
    cloundLayer1.tilePositionX += 0.07;
    cloundLayer2.tilePositionX += 0.1;

    this.physics.add.collider(player, jumppad1, function (player, jumppad) {
      player.setVelocityY(-1100);
      null, this;
    });

    //player movement
    if (isMobile || tablet) {
      this.playerMoveTemple(
        player,
        350,
        false,
        true,
        isLeftPressed,
        isRightPressed,
        isUpPressed,
        750
      );
    } else {
      this.playerMoveTemple(player, 350, false, false, null, null, null, 750);
    }

    //camera follow player
    camera.startFollow(player);

    //player drown
    playerDrown(this, player, shallow_water);
    if (this.physics.overlap(player, shallow_water)) {
      haveBeenToDelivery4 = false;
      isPlayerFallDown = false;
    }

    // handle all collect task
    CND_TaskManager.handleCollectItem(player, [this.CND_Key_Task]);
    if (readyToCollectMilk) {
      CND_TaskManager.handleCollectItem(player, [
        this.CND_Milks_Task,
        this.ToGate_Task,
      ]);
    }

    // handle key deliver task
    if (
      chest.isOverlapWithPlayer(player) &&
      !(npc4.satisfied && npc5.satisfied)
    ) {
      CND_TaskManager.handleDeliverItem(chest, [
        this.CND_Key_Task,
        this.CND_Milks_Task,
      ]);
    }
    if (deliverToChest && !isPlayerFallDown) {
      deliverToChest = !chest.satisfied;
      if (!deliverToChest) {
        // * play animation 'opening chest'
        this.anims.play("chest-rotate", chest.gameObj);
        // * spawn milk after 2.3s (duration of animation)
        this.time.delayedCall(2300, () => {
          milkInChest.gameObj.setVisible(true);
          milkOnBench.gameObj.setVisible(true);
          milkOnCloud.gameObj.setVisible(true);
          // * milk float up until 0.45s
          milkInChest.gameObj.setVelocityY(-100);
          this.time.delayedCall(450, () => {
            milkInChest.gameObj.setVelocityY(0);
            readyToCollectMilk = true;
          });
        });
      }
    } else if (
      isPlayerFallDown &&
      ableToPlayChestAnimation &&
      chest.satisfied
    ) {
      // * play animation 'opening chest'
      this.anims.play("chest-rotate", chest.gameObj);
      // * spawn milk after 2.3s (duration of animation)
      this.time.delayedCall(2300, () => {
        milkInChest.gameObj.setVisible(true);
        milkOnBench.gameObj.setVisible(true);
        milkOnCloud.gameObj.setVisible(true);
        // * milk float up until 0.45s
        milkInChest.gameObj.setVelocityY(-100);
        this.time.delayedCall(450, () => {
          milkInChest.gameObj.setVelocityY(0);
          readyToCollectMilk = true;
        });
      });
      ableToPlayChestAnimation = false;
    }

    // handle interact btn for // ! npc4
    this.handleInteractiveBtn(
      !isMobile && !tablet,
      interactKey,
      up,
      interactButton,
      player,
      npc4,
      [ladder, npc5]
    );

    // handle interact btn for // ! npc5
    this.handleInteractiveBtn(
      !isMobile && !tablet,
      interactKey,
      up,
      interactButton,
      player,
      npc5,
      [ladder, npc4]
    );

    // handle interact btn for // ! ladder
    this.handleInteractiveBtn(
      !isMobile && !tablet,
      interactKey,
      up,
      interactButton,
      player,
      ladder,
      [npc4, npc5]
    );

    // * updateTextOpacity(player, target, message)
    this.updateTextOpacity(player, this.requireNpc4, this.requireNpc4);
    this.updateTextOpacity(player, this.requireNpc5, this.requireNpc5);

    // * all c&d task were done, ready to go to next scene
    if (this.CND_Milks_Task._completed && !this.ToGate_Task._completed) {
      let gateBox = this.ToGate_Task._inventoryBox[0];
      let gate = this.ToGate_Task._items[0];
      gate.gameObj.setTexture("gate-active");
      if (gate.isOverlapWithPlayer(player)) {
        this.scene.start("Summarize");
      } else {
        this.updateItemOpacity(gateBox, gate.gameObj);
      }
    }
  }
}

export default Delivery3;
