import Phaser from "phaser";
import {
  SKY_DEPTH,
  BACKGROUND_DEPTH,
  BACKGROUND_COMPONENT_DEPTH,
  MIDDLEGROUND_DEPTH,
  PLAYER_DEPTH,
  FOREGROUND_DEPTH,
} from "../utils/mapDepth";
import { setWorldBoundsAndCamera } from "../utils/setWorldAndCameraBound";
import playerMoveTemple from "../utils/playerMoveTemple";
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
  Target,
  OverlapObject,
} from "../utils/event/TaskManager";

const isMobile = /mobile/i.test(navigator.userAgent);
const tablet = window.innerWidth < 1280;

//bg component
let backgrounds;
let bg;
let water;
let cloundLayer1;
let cloundLayer2;
let platforms;
let components;
// player
let player;
let camera;
//interactive
let milkShop;
let house;
let sign;
let gate;
let milk;
let sakuraTree;
let shallow_water;

//npc // ! must modify to new structure
let npc1;
let npc2;
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

// * new class for collect item
/**
 * @type {CND_Task}
 */
let CND_Milk_Task;
/**
 * @type {CND_Task}
 */
let ToGate_Task;

class Delivery extends Phaser.Scene {
  constructor() {
    super({
      key: "Delivery",
    });
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
      let screenHeight;

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
          'mobile',
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
      .tileSprite(0, -300, mapWidth, mapHeight, "background")
      .setOrigin(0, 0)
      .setScale(1.6)
      .setDepth(SKY_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.CLOUD - 0.1);
    //mid clound
    cloundLayer1 = this.add
      .tileSprite(0, -200, mapWidth, mapHeight, "clound-layer2")
      .setOrigin(0, 0)
      .setScale(1.6)
      .setDepth(SKY_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.CLOUD);
    //front clound
    cloundLayer2 = this.add
      .tileSprite(0, -120, mapWidth, mapHeight, "clound-layer1")
      .setOrigin(0, 0)
      .setScale(1.6)
      .setDepth(SKY_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.CLOUD2);

    backgrounds.add(bg);
    backgrounds.add(cloundLayer2);
    backgrounds.add(cloundLayer1);
  }
  // water and shadows
  addForeground(mapWidth, mapHeight) {
    shallow_water = shallowWater(
      this,
      0,
      mapHeight - 20,
      mapWidth * 2,
      200,
      BACKGROUND_COMPONENT_DEPTH
    );

    this.physics.add.existing(shallow_water);

    water = this.add
      .sprite(0, mapHeight - 220, "water-sprite")
      .setOrigin(0, 0)
      .setScale(1.1)
      .setDepth(PLAYER_DEPTH + 1)
      .setScrollFactor(OBJECT_SCROLL.PLAYER);

    water.anims.play("waterAnim", true);

    water = this.add
      .sprite(1840, mapHeight - 220, "water-sprite")
      .setOrigin(0, 0)
      .setScale(1.1)
      .setDepth(PLAYER_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.PLAYER);

    water.anims.play("waterAnim", true);

    //add shadows
    this.add
      .image(1370, mapHeight - 80, "shadow-platform")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
    this.add
      .image(1650, mapHeight - 80, "shadow-platform-long1")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
    this.add
      .image(2110, mapHeight - 80, "shadow-platform")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
    this.add
      .image(2380, mapHeight - 110, "shadow-platform-long2")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
    this.add
      .image(mapWidth - 300, mapHeight - 80, "shadow-platform")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
  }
  // platforms
  addPlatforms(floorHeight) {
    platforms = this.physics.add.staticGroup();
    let ground = this.add
      .tileSprite(0, floorHeight+3, 1383, 218, "ground-main")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(PLAYER_DEPTH + 2);

    let platformSmall = this.add
      .image(1405, 1100, "platform")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);

    let platformVine = this.add
      .image(1355, 860, "platform")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);

    let platformStatue_long = this.add
      .image(1659, 1002, "platform-long1")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);

    let platformGlass = this.add
      .image(2124, 921, "platform")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);

    let platformHouse = this.add
      .image(2375, 847, "platform-long2")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);

    let platformGate = this.add
      .image(3549, 872, "platform")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);

    let platformSakuraTree = this.add
      .image(929, 695, "platform-long1")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);

    platforms.add(ground);
    platforms.add(platformSmall);
    platforms.add(platformVine);
    platforms.add(platformStatue_long);
    platforms.add(platformGlass);
    platforms.add(platformHouse);
    platforms.add(platformGate);
    platforms.add(platformSakuraTree);
    // Set collision boxes for each platform
    platforms.children.iterate((child) => {
      child.body.setSize(child.width, 20).setOffset(0, 0);
    });
  }
  // house, milk shop, milk, gate, sign
  addMainComponents() {
    components = this.add.group();
    milkShop = this.add
      .image(574, 884, "milk-shop")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
    house = this.add
      .image(2620, 400, "house")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
    sign = this.add
      .image(2447, 701, "sign")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);

    milk = new MilkItem(
      this.physics,
      [1102, 595],
      0.8,
      MIDDLEGROUND_DEPTH,
      150
    );

    gate = new OverlapObject(
      this.physics,
      "image",
      [3650, 787],
      "gate",
      1,
      MIDDLEGROUND_DEPTH,
      90
    );

    components.add(milkShop);
    components.add(house);

    // ! new class for collect item
    // * create milk task
    CND_Milk_Task = new CND_Task(this, [milk], {
      itemKey: milk.textureKey,
      qty: 1,
      inventoryItemSize: milk.inventoryItemSize,
    });

    // * create to-gate task
    ToGate_Task = new CND_Task(this, [gate], {
      itemKey: gate.textureKey,
      qty: 1,
      inventoryItemSize: 90,
      fst_posX: 50,
      posY: 30,
    });

    CND_TaskManager.createInventoryItem(CND_Milk_Task);
  }
  // prop
  addComponents() {
    //sakura milk shop
    this.add
      .image(1704, 907, "stone-wall")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH - 1);
    this.add
      .image(1950, 825, "statue-stone")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH - 1);
    this.add
      .image(1075, 589, "bench")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH - 1);
    this.add
      .image(1377, 818, "stone")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH - 1);
    this.add
      .image(1430, 978, "lantern")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH - 1);
    //add vine on platformVine
    this.add
      .image(1432, 855, "vine")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH + 1);
    this.add
      .image(2210, 895, "grass")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(PLAYER_DEPTH + 1);
    //sakura house

    let xPositionsTree = [158, 720, 2430];
    let yPositionsTree = [678, 322, 320];
    let scales = [0.88, 0.6, 0.88];
    let count = 1;

    for (let i = 0; i < xPositionsTree.length; i++) {
      let x = xPositionsTree[i];
      let y = yPositionsTree[i];

      // Create a sakura sprite at position (x, y)
      let sakuraAnim = this.add
        .sprite(x, y, "sakuraAnim")
        .setOrigin(0, 0)
        .setScale(scales[i])
        .setDepth(BACKGROUND_COMPONENT_DEPTH + 1);

      sakuraAnim.anims.play("sakuraAnim", true);
      if (count % 3 === 0) {
        sakuraAnim.flipX = true;
        sakuraAnim.setDepth(BACKGROUND_COMPONENT_DEPTH - 1);
        count++;
      } else if (count % 2 == 0) {
        sakuraAnim.flipX = true;
        count = 0;
      } else {
        sakuraAnim.flipX = false;
        count++;
      }
    }

    let xPositions = [280, 500, 762, 900, 2500];
    let yPositions = [900, 900, 447, 447, 500];
    let scaleSakura = [1, 1, 0.8, 0.8, 1];

    for (let i = 0; i < xPositions.length; i++) {
      let x = xPositions[i];
      let y = yPositions[i];

      let sakura = this.add
        .sprite(x, y, "sakura-sprite")
        .setOrigin(0, 0)
        .setScale(scaleSakura[i])
        .setDepth(FOREGROUND_DEPTH);

      sakura.anims.play("sakura", true);
      sakura.flipX = true;
    }
  }
  // player and colider
  addPlayerAndColider(floorHeight) {
    // player
    player = this.physics.add
      .sprite(100, floorHeight - 150, "player")
      .setCollideWorldBounds(true)
      .setScale(0.33)
      .setSize(180, 200)
      .setDepth(PLAYER_DEPTH);
    player.setFrame(5);

    this.physics.add.collider(player, platforms);
  }
  // npc
  addNpc() {
    npc1 = new Target(
      { itemKey: milk.textureKey, qty: 0 },
      this.physics,
      "sprite",
      [890, 1120],
      "npc2",
      0.2,
      MIDDLEGROUND_DEPTH
    );
    npc2 = new Target(
      { itemKey: milk.textureKey, qty: 1 },
      this.physics,
      "sprite",
      [2770, 758 - 15],
      "npc6",
      0.2,
      MIDDLEGROUND_DEPTH
    );

    npc1.gameObj.anims.play("idle_npc2", true);
    npc2.gameObj.anims.play("idle_npc6", true);

    npc1.gameObj.flipX = true;
    npc2.gameObj.flipX = true;
  }

  // animations
  addAnimations() {
    // sprite sheet for npc1
    this.anims.create({
      key: "idle_npc6",
      frames: this.anims.generateFrameNumbers("npc6", {
        start: 0,
        end: 1,
      }),
      frameRate: 1,
      repeat: -1,
    });

    // sprite sheet for npc2
    this.anims.create({
      key: "idle_npc2",
      frames: this.anims.generateFrameNumbers("npc2", {
        start: 0,
        end: 1,
      }),
      frameRate: 1,
      repeat: -1,
    });
  }

  // message
  addMessage() {
    // * message for npc interaction
    this.messageNpc1 = this.add
      .image(1131, 993, "message-n1")
      .setOrigin(0, 0)
      .setAlpha(0)
      .setScale(1)
      .setDepth(PLAYER_DEPTH);
    this.messageNpc2 = this.add
      .image(2522, 687, "message-n2")
      .setOrigin(0, 0)
      .setAlpha(0)
      .setScale(1)
      .setDepth(PLAYER_DEPTH);

    // * message require milk
    this.requireNpc2 = this.add
      .image(2628, 784, "require1")
      .setOrigin(0, 0)
      .setAlpha(0)
      .setScale(1)
      .setDepth(PLAYER_DEPTH);
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
    npc1.gameObj.fn = () => {
      // * blip the message (alpha 0 to 1 and 1 to 0) for 3 times
      this.messageNpc1.setAlpha(1);
      this.messageNpc1.y = 993;
      this.tweens.add({
        targets: this.messageNpc1,
        y: this.messageNpc1.y - 10,
        duration: 100,
        ease: "Linear",
        repeat: 3,
        yoyo: true,
      });
    };
    npc2.gameObj.fn = () => {
      this.requireNpc2.x = 2628;
      this.tweens.add({
        targets: this.requireNpc2,
        x: this.requireNpc2.x - 10,
        duration: 100,
        ease: "Linear",
        repeat: 3,
        yoyo: true,
      });
      CND_TaskManager.handleDeliverItem(
        npc2,
        [CND_Milk_Task, ToGate_Task],
        this.tweens,
        this.messageNpc2,
        this.requireNpc2
      );
      if (CND_Milk_Task._completed) {
        npc1.gameObj.destroy();
        this.messageNpc1.destroy();
      }
    };
  }

  init() {
    this.playerMoveTemple = playerMoveTemple;
    this.sound.stopByKey("drown");
  }

  create() {
    //config
    const { width, height } = this.scale;
    // main scale
    const mapWidth = width * 3;
    const mapHeight = height * 2;

    //!Dev scale 3840 * 1440
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

    //animations
    this.addAnimations();
    //background
    this.addBackgroundElements(mapWidth, mapHeight);
    //foreground
    this.addForeground(mapWidth, mapHeight);
    //platforms
    this.addPlatforms(floorHeight);
    //main components
    this.addMainComponents();
    //components pragob
    this.addComponents();
    //player and colider
    this.addPlayerAndColider(floorHeight);
    //npc
    this.addNpc();
    //message
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
    // this.scene.start('Delivery2'); // ! comment for working in event_handling branch

    bg.tilePositionX += 0.03;
    cloundLayer1.tilePositionX += 0.07;
    cloundLayer2.tilePositionX += 0.1;

    //player movement
    if (isMobile || tablet) {
      this.playerMoveTemple(
        player,
        350,
        false,
        true,
        isLeftPressed,
        isRightPressed,
        isUpPressed
      );
    } else {
      this.playerMoveTemple(player, 350, false, false, null, null, null);
    }

    // camera follow player
    camera.startFollow(player);

    // player drown
    playerDrown(this, player, shallow_water);

    // handle all collect task
    CND_TaskManager.handleCollectItem(player, [CND_Milk_Task]);

    // handle interact btn for // ! npc1
    this.handleInteractiveBtn(
      !isMobile && !tablet,
      interactKey,
      up,
      interactButton,
      player,
      npc1,
      [npc2]
    );
    // handle interact btn for // ! npc2
    this.handleInteractiveBtn(
      !isMobile && !tablet,
      interactKey,
      up,
      interactButton,
      player,
      npc2,
      [npc1]
    );

    // * all c&d task were done, ready to go to next scene
    if (CND_Milk_Task._completed && !ToGate_Task._completed) {
      let gateBox = ToGate_Task._inventoryBox[0];
      let gate = ToGate_Task._items[0];
      gate.gameObj.setTexture("gate-active");
      if (gate.isOverlapWithPlayer(player)) {
        this.scene.start("Delivery2");
      } else {
        this.updateItemOpacity(gateBox, gate.gameObj);
      }
    }
    // * updateTextOpacity(player, target, message)
    this.updateTextOpacity(player, this.requireNpc2, this.requireNpc2);
  }
}

export default Delivery;
