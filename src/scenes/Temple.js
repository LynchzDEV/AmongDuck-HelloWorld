import Phaser from "phaser";
import path from "path";
import {
  BACKGROUND_TEMPLE_PATH,
  FOREGROUND_TEMPLE_PATH,
  COMPONENT_TEMPLE_PATH,
  UI_PATH,
  PLAYER_SPRITESHEET_PATH,
} from "../utils/mapPath";
import {
  SKY_DEPTH,
  BACKGROUND_DEPTH,
  BACKGROUND_COMPONENT_DEPTH,
  MIDDLEGROUND_DEPTH,
  PLAYER_DEPTH,
  FOREGROUND_DEPTH,
} from "../utils/mapDepth";
import { setWorldBoundsAndCamera } from "../utils/setWorldAndCameraBound";
import { OBJECT_SCROLL } from "../utils/mapObjectScroll";
import playerMoveTemple from "../utils/playerMoveTemple";
import {
  setInput,
  createInteractInput,
  handleInteractiveBtn,
} from "../utils/interactUtils";
import { updateTextOpacity } from "../utils/event/updateTextOpacity";

// ! test new class for collect item
import { Target } from "../utils/event/TaskManager";

const isMobile = /mobile/i.test(navigator.userAgent);
const tablet = window.innerWidth < 1280;

let background;
let foreground;
let components;
let camera;
let player;
let water;
let grounds;
let sky;
let sky2;
let sky3;

//npc
let npcTemple;
let npcDummyForHandleInteract;
//message box is interacted yet?
let messageBoxInteract = true;

let left;
let right;
let up;
let interactKey; // ! add this for another scene too
const windowHeight = window.innerHeight > 720 ? 720 : window.innerHeight; // ! add this for another scene too
let interactButton; // ! add this for another scene too
let isLeftPressed = false;
let isRightPressed = false;
let isUpPressed = false;

let readyToChangeScene = false;

class Temple extends Phaser.Scene {
  constructor() {
    super("Temple");
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
  addBackgroundElements(width, height, mapWidth, floorHeight) {
    //clouds
    sky = this.add
      .tileSprite(0, 0, mapWidth, height, "sky")
      .setOrigin(0, 0)
      .setScale(2.6)
      .setDepth(SKY_DEPTH)
      .setScrollFactor(0);

    sky2 = this.add
      .tileSprite(0, 10, mapWidth, height, "sky2")
      .setOrigin(0, 0)
      .setScale(2.6)
      .setAlpha(0.6)
      .setDepth(SKY_DEPTH)
      .setScrollFactor(0);

    sky3 = this.add
      .tileSprite(0, 20, mapWidth, height, "sky3")
      .setOrigin(0, 0)
      .setScale(2.6)
      .setAlpha(0.4)
      .setDepth(SKY_DEPTH)
      .setScrollFactor(0);

    //background
    background = this.add.group();

    let city = this.add
      .tileSprite(0, floorHeight - 200, 550, 200, "City")
      .setOrigin(0, 0)
      .setScale(1.5)
      .setDepth(BACKGROUND_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.BG);

    let fuji = this.add
      .image(mapWidth - 2200, floorHeight - 250, "fuji")
      .setOrigin(0, 0)
      .setScale(1.5)
      .setDepth(BACKGROUND_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.BG);

    let bgTree = this.add
      .tileSprite(0, floorHeight + 20, mapWidth * 2, 180, "bgTree")
      .setOrigin(0, 0)
      .setScale(0.7)
      .setDepth(BACKGROUND_COMPONENT_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.BG);

    let brush1 = this.add
      .image(500, floorHeight - 50, "bushes")
      .setOrigin(0, 0)
      .setScale(2)
      .setDepth(BACKGROUND_COMPONENT_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.BG);

    let brush2 = this.add
      .image(mapWidth / 2 - 800, floorHeight - 50, "bushes")
      .setOrigin(0, 0)
      .setScale(2)
      .setDepth(BACKGROUND_COMPONENT_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.BG);
    brush2.flipX = true;

    let brush3 = this.add
      .image(mapWidth / 2, floorHeight - 50, "bushes")
      .setOrigin(0, 0)
      .setScale(2)
      .setDepth(BACKGROUND_COMPONENT_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.BG);

    let peddlerCar = this.add
      .image(700, floorHeight - 40, "peddlerCar")
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.PLAYER);

    background.add(sky);
    background.add(city);
    background.add(fuji);
    background.add(bgTree);
    background.add(peddlerCar);
    background.add(brush1);
    background.add(brush2);
    background.add(brush3);
  }
  addComponents(width, height, mapWidth, floorHeight) {
    //components background
    components = this.add.group();
    let house = this.add
      .image(mapWidth / 2 - 620, floorHeight - 225, "HouseTemple")
      .setOrigin(0, 0)
      .setScale(0.8)
      .setDepth(MIDDLEGROUND_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.PLAYER);

    let torii = this.add
      .image(mapWidth / 2 + 900, floorHeight - 100, "torii")
      .setOrigin(0, 0)
      .setScale(0.7)
      .setDepth(MIDDLEGROUND_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.PLAYER);

    components.add(house);
    components.add(torii);
  }
  addMiddlegroundAndPlayer(width, height, mapWidth, floorHeight) {
    //player
    player = this.physics.add
      .sprite(300, height - 300, "player")
      .setCollideWorldBounds(true)
      .setScale(0.26)
      .setSize(180, 200)
      .setDepth(PLAYER_DEPTH);

    //ground physics
    grounds = this.physics.add.staticGroup();
    let ground = this.add
      .tileSprite(0, floorHeight + 98, mapWidth * 5, 250, "ground-temple")
      .setOrigin(0, 0)
      .setScale(0.2)
      .setDepth(PLAYER_DEPTH + 2)
      .setScrollFactor(OBJECT_SCROLL.PLAYER);

    let groundShadow = this.add
      .tileSprite(0, floorHeight + 120, mapWidth * 25, 250, "groundShadow")
      .setOrigin(0, 0)
      .setScale(0.15)
      .setDepth(PLAYER_DEPTH + 1)
      .setScrollFactor(OBJECT_SCROLL.PLAYER);

    grounds.add(ground);
    grounds.add(groundShadow);
    this.physics.add.collider(player, grounds);
  }
  addForegroundElements(width, height, mapWidth, floorHeight) {
    //adding water
    water = this.add
      .sprite(0, 450, "water-sprite")
      .setOrigin(0, 0)
      .setScale(1.1)
      .setDepth(PLAYER_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.PLAYER);

    water.anims.play("waterAnim", true);

    water = this.add
      .sprite(1840, 450, "water-sprite")
      .setOrigin(0, 0)
      .setScale(1.1)
      .setDepth(PLAYER_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.PLAYER);

    water.anims.play("waterAnim", true);

    water = this.add
      .sprite(3680, 450, "water-sprite")
      .setOrigin(0, 0)
      .setScale(1.1)
      .setDepth(PLAYER_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.PLAYER);

    water.anims.play("waterAnim", true);

    //foreground
    foreground = this.add.group();

    // let tree = this.add
    //     .tileSprite(0, 300, mapWidth * 4, height * 2, "tree")
    //     .setOrigin(0, 0)
    //     .setScale(0.5)
    //     .setAlpha(0.5)
    //     .setDepth(FOREGROUND_DEPTH - 2)
    //     .setScrollFactor(OBJECT_SCROLL.FG);

    let xPositions = [
      0, 450, 1200, 1500, 2300, 2550, 2950, 3700, 3850, 4900, 5100, 5555, 6300,
      6500,
    ];
    let yPositions = [
      450, 550, 600, 650, 450, 500, 550, 600, 600, 450, 475, 525, 600, 650,
    ];

    for (let i = 0; i < xPositions.length; i++) {
      let x = xPositions[i];
      let y = yPositions[i];

      let sakura = this.add
        .sprite(x, y, "sakura-sprite")
        .setOrigin(0, 0)
        .setScale(0.8)
        .setDepth(FOREGROUND_DEPTH)
        .setScrollFactor(OBJECT_SCROLL.FG);

      sakura.anims.play("sakura", true);
      sakura.flipX = true;
    }

    let xPositionsTree = [
      -300, 305, 1100, 1600, 2300, 2865, 3650, 4100, 4850, 5425, 6200, 6650,
    ];
    let yPositionsTree = [
      360, 440, 470, 550, 365, 440, 470, 550, 365, 430, 485, 550,
    ];
    let scales = [
      0.65, 0.55, 0.65, 0.55, 0.65, 0.55, 0.65, 0.6, 0.6, 0.55, 0.65, 0.57,
    ];
    let count = 1;

    for (let i = 0; i < xPositionsTree.length; i++) {
      let x = xPositionsTree[i];
      let y = yPositionsTree[i];

      // Create a sakura sprite at position (x, y)
      let sakuraAnim = this.add
        .sprite(x, y, "sakuraAnim")
        .setOrigin(0, 0)
        .setScale(scales[i])
        .setDepth(FOREGROUND_DEPTH - 1)
        .setScrollFactor(OBJECT_SCROLL.FG);

      sakuraAnim.anims.play("sakuraAnim", true);
      if (count % 2 == 0) {
        sakuraAnim.flipX = false;
        count = 0;
      } else {
        sakuraAnim.flipX = true;
        count++;
      }
    }

    // foreground.add(tree);
    foreground.add(water);
  }
  addNpc(mapWidth, floorHeight) {
    // npcTemple = this.physics.add
    //   .sprite(2460, floorHeight + 20, 'npc1')
    //   .setOrigin(0, 0)
    //   .setScale(0.15)
    //   .setDepth(MIDDLEGROUND_DEPTH);

    npcTemple = new Target(
      { itemKey: player.texture.key, qty: 0 },
      this.physics,
      "sprite",
      [2460, floorHeight + 20],
      "npc1",
      0.15,
      MIDDLEGROUND_DEPTH
    );

    npcTemple.gameObj.flipX = true;

    npcTemple.gameObj.anims.play("atok-anim", true);

    npcDummyForHandleInteract = new Target(
      { itemKey: player.texture.key, qty: 0 },
      this.physics,
      "sprite",
      [0, 1500], // * out of screen
      "npc1",
      0.15,
      MIDDLEGROUND_DEPTH
    );
  }
  addAnimations() {
    //sakura animation
    this.anims.create({
      key: "sakura",
      frames: this.anims.generateFrameNumbers("sakura-sprite", {
        start: 0,
        end: 19,
      }),
      frameRate: 8,
      repeat: -1,
    });

    //sakuraTree animation
    this.anims.create({
      key: "sakuraAnim",
      frames: this.anims.generateFrameNames("sakuraAnim", {
        start: 0,
        end: 5,
      }),
      frameRate: 3,
      repeat: -1,
    });

    this.anims.create({
      key: "atok-anim",
      frames: this.anims.generateFrameNames("npc1", {
        start: 0,
        end: 1,
      }),
      frameRate: 1,
      repeat: -1,
    });
  }
  addMessage() {
    this.npcTempleMessage = this.add
      .image(2414, 375, "msg-box")
      .setOrigin(0, 0)
      .setAlpha(0.8)
      .setScale(1)
      .setDepth(FOREGROUND_DEPTH);
  }

  // * bind function to target
  // ! modify func when interact with npcTemple here
  // TODO replace this.npcTempleMessage with another message obj
  bindFnToTarget() {
    npcTemple.gameObj.fn = () => {
      this.npcTempleMessage.setAlpha(1);
      this.tweens.add({
        targets: this.npcTempleMessage,
        alpha: 0,
        duration: 6000,
        ease: "Linear",
        yoyo: false,
      });
      // ! you can modify the delay func before change scene here
      // ? may be add some sfx for let player know the scene is changing
      this.time.delayedCall(6500, () => {
        readyToChangeScene = true;
      });
    };
  }

  create() {
    //config
    const { width, height } = this.scale;
    const mapWidth = width * 4;
    const floorHeight = height - 330;
    //binding functions
    this.playerMoveTemple = playerMoveTemple;
    this.updateTextOpacity = updateTextOpacity;
    this.setWorldBoundsAndCamera = setWorldBoundsAndCamera;
    this.handleInteractiveBtn = handleInteractiveBtn; // ! new func
    //setting world and camera
    const returnCamera = this.setWorldBoundsAndCamera(height, mapWidth, camera);
    camera = returnCamera;
    //setting device specific controls
    this.setDeviceSpecificControls(height, width, camera);

    //adding animations
    this.addAnimations();
    //adding background
    this.addBackgroundElements(width, height, mapWidth, floorHeight);
    //adding house and torii
    this.addComponents(width, height, mapWidth, floorHeight);
    //adding ground and player
    this.addMiddlegroundAndPlayer(width, height, mapWidth, floorHeight);
    //adding foreground
    this.addForegroundElements(width, height, mapWidth, floorHeight);
    //add npc
    this.addNpc(mapWidth, floorHeight);
    //add npc message
    this.addMessage();

    // * init the input
    setInput(this.input);
    // * bind target to interact btn
    this.bindFnToTarget();
  }

  update() {
    // this.scene.start("Delivery"); //! dev mode

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

    //camera follow player
    camera.startFollow(player);

    //scrolling background
    sky.tilePositionX += 0.015;
    sky2.tilePositionX += 0.035;
    sky3.tilePositionX += 0.055;

    // handle interact btn for // ! npcTemple
    this.handleInteractiveBtn(
      !isMobile && !tablet,
      interactKey,
      up,
      interactButton,
      player,
      npcTemple,
      [npcDummyForHandleInteract]
    );
    // * This works with the function binded to target at bindFnToTarget()
    if (readyToChangeScene) {
      this.scene.start("Delivery");
    }

    if (messageBoxInteract) {
      this.updateTextOpacity(player, npcTemple.gameObj, this.npcTempleMessage);
    } else {
      this.npcTempleMessage.setAlpha(0);
    }
  }
}
export default Temple;
