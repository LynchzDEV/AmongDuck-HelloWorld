import Phaser from 'phaser';
import {
  SKY_DEPTH,
  BACKGROUND_DEPTH,
  BACKGROUND_COMPONENT_DEPTH,
  MIDDLEGROUND_DEPTH,
  PLAYER_DEPTH,
  FOREGROUND_DEPTH,
} from '../utils/mapDepth';
import { setWorldBoundsAndCamera } from '../utils/setWorldAndCameraBound';
import playerMoveTemple from '../utils/playerMoveTemple';
import { OBJECT_SCROLL } from '../utils/mapObjectScroll';
import { shallowWater, playerDrown } from '../utils/event/drown';
import { manageCollectItem } from '../utils/event/collectItem';

const isMobile = /mobile/i.test(navigator.userAgent);
const tablet = window.innerWidth < 1280;

//bg component
let backgrounds;
let water;
let shallow_water;
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
let gate;
let milk1;
let milk2; // have to modify position for testing
let milk3; // have to modify position for testing
let sign;
let sakuraTree; // temp for testing
//control flow
let left;
let right;
let up;
let isLeftPressed = false;
let isRightPressed = false;
let isUpPressed = false;
//manage collect item
let collectItemManager;
const milkTargetSize = 150,
  gateTargetSize = 90;
let overlapMilk1 = true;
let overlapMilk2 = true;
let overlapMilk3 = true;
let deliverToSign = true; // temp for testing
let deliverToSakuraTree = true; // temp for testing
let deliverToHouse = true; // temp for testing

class Delivery extends Phaser.Scene {
  constructor() {
    super({
      key: 'Delivery',
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
      .setScale(1.6)
      .setDepth(SKY_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.CLOUD - 0.1);
    //front clound
    cloundLayer1 = this.add
      .tileSprite(0, 0, mapWidth, mapHeight, 'clound-layer2')
      .setOrigin(0, 0)
      .setScale(1.6)
      .setDepth(SKY_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.CLOUD);
    // mid clound
    cloundLayer2 = this.add
      .tileSprite(0, 0, mapWidth, mapHeight, 'clound-layer1')
      .setOrigin(0, 0)
      .setScale(1.6)
      .setDepth(SKY_DEPTH)
      .setScrollFactor(OBJECT_SCROLL.CLOUD2);

    backgrounds.add(bg);
    backgrounds.add(cloundLayer2);
    backgrounds.add(cloundLayer1);
  }
  //water and shadows
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
      .tileSprite(0, mapHeight - 200, mapWidth, 200, 'water')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);

    //add shadows
    this.add
      .image(1370, mapHeight - 80, 'shadow-platform')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
    this.add
      .image(1650, mapHeight - 80, 'shadow-platform-long1')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
    this.add
      .image(2110, mapHeight - 80, 'shadow-platform')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
    this.add
      .image(2380, mapHeight - 110, 'shadow-platform-long2')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
    this.add
      .image(mapWidth - 300, mapHeight - 80, 'shadow-platform')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
  }
  //platforms
  addPlatforms(floorHeight) {
    platforms = this.physics.add.staticGroup();
    let ground = this.add
      .tileSprite(0, floorHeight, 1383, 218, 'ground-main')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);

    let platformSmall = this.add
      .image(1405, 1100, 'platform')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);

    let platformVine = this.add
      .image(1355, 860, 'platform')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);

    let platformStatue_long = this.add
      .image(1659, 1002, 'platform-long1')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);

    let platformGlass = this.add
      .image(2124, 921, 'platform')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);

    let platformHouse = this.add
      .image(2375, 847, 'platform-long2')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);

    let platformGate = this.add
      .image(3549, 872, 'platform')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);

    let platformSakuraTree = this.add
      .image(929 - 65, 695 + 55, 'platform-long1') // modified platform position for testing
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
  //house, milk shop, milk, gate, sign
  addMainComponents() {
    components = this.add.group();
    milkShop = this.add
      .image(574, 884, 'milk-shop')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
    house = this.physics.add
      .image(2620, 400, 'house')
      .setOrigin(0, 0)
      .setScale(1)
      .setSize(150, 400) // temp for testing
      .setDepth(BACKGROUND_COMPONENT_DEPTH);
    milk1 = this.physics.add
      .image(1102 - 65, 595 + 55, 'milk') // modified platform position for testing
      .setOrigin(0, 0)
      .setScale(0.8)
      .setDepth(MIDDLEGROUND_DEPTH);
    milk2 = this.physics.add
      .image(100, this.scale.height * 2 - 215 - 150, 'milk')
      .setOrigin(0, 0)
      .setScale(0.8)
      .setDepth(MIDDLEGROUND_DEPTH);
    milk3 = this.physics.add
      .image(1950, 925, 'milk')
      .setOrigin(0, 0)
      .setScale(0.8)
      .setDepth(MIDDLEGROUND_DEPTH);
    gate = this.physics.add
      .image(3650, 787, 'gate')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);
    gate.flipX = true;
    // sign is not physics object by default, this is for testing
    sign = this.physics.add
      .image(2447, 701, 'sign')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH);

    components.add(milkShop);
    components.add(house);
    components.add(milk1);
    components.add(gate);
    components.add(sign);

    // init inventory
    collectItemManager = manageCollectItem(this, [
      {
        success: false,
        item: [milk1, milk2, milk3],
        sizeOfInventory: 3,
        targetSize: milkTargetSize,
        alpha: 0.5,
      },
      {
        success: false,
        item: [gate],
        sizeOfInventory: 1,
        targetSize: gateTargetSize,
        initStartPosX: 50,
        initStartPosY: 30,
        alpha: 0,
        callBack: (item) => {
          item.setTexture('gate-active');
          item.flipX = true;
        },
      },
    ]);
    milk1.collected = false;
    milk1.delivered = false;
    milk2.collected = false;
    milk2.delivered = false;
    milk3.collected = false;
    milk3.delivered = false;
    collectItemManager.initInventory();
  }
  //prop
  addComponents() {
    //sakura milk shop
    // sakura tree is not physics object by default, this is for testing
    sakuraTree = this.physics.add
      .image(141, 612, 'sakura-tree')
      .setOrigin(0, 0)
      .setScale(1)
      .setSize(50, 600) // temp for testing
      .setDepth(BACKGROUND_COMPONENT_DEPTH - 1);
    sakuraTree.flipX = true;
    this.add
      .image(700 - 65, 266 + 55, 'sakura-tree') // modified platform position for testing
      .setOrigin(0, 0)
      .setScale(0.7)
      .setDepth(BACKGROUND_COMPONENT_DEPTH - 1);
    this.add
      .image(1704, 907, 'stone-wall')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH - 1);
    this.add
      .image(1950, 825, 'statue-stone')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH - 1);
    this.add
      .image(1075 - 65, 589 + 55, 'bench') // modified platform position for testing
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH - 1);
    this.add
      .image(1377, 818, 'stone')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH - 1);
    this.add
      .image(1430, 978, 'lantern')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH - 1);
    //add vine on platformVine
    this.add
      .image(1432, 855, 'vine')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(MIDDLEGROUND_DEPTH + 1);
    this.add
      .image(2210, 895, 'grass')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(PLAYER_DEPTH + 1);
    //sakura house
    this.add
      .image(2400, 238, 'sakura-tree')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH - 1);
  }
  //player and colider
  addPlayerAndColider(floorHeight) {
    // player
    player = this.physics.add
      .sprite(100, floorHeight - 150, 'player')
      .setCollideWorldBounds(true)
      .setScale(0.3)
      .setSize(180, 200)
      .setDepth(PLAYER_DEPTH);
    player.setFrame(5);
    
    this.physics.add.collider(player, platforms);
  }
  //animations
  addAnimations() {
    //animations for testing
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('player', {
        start: 0,
        end: 7,
      }),
      frameRate: 10,
      repeat: -1,
    });

    // //water animation
    // this.anims.create({
    //   key: 'waterAnim',
    //   frames: this.anims.generateFrameNumbers('water', {
    //     start: 0,
    //     end: 5,
    //   }),
    //   frameRate: 5.5,
    //   repeat: -1,
    // });

    // //sakura animation
    // this.anims.create({
    //   key: 'sakura',
    //   frames: this.anims.generateFrameNumbers('sakura', {
    //     start: 0,
    //     end: 20,
    //   }),
    //   frameRate: 8,
    //   repeat: -1,
    // });
  }
  // update item opacity
  updateItemOpacity(destination) {
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

    const minOpacity = collectItemManager.state[0].alpha;
    const maxOpacity = 1;

    const maxDistance = 2000;

    const opacity = Phaser.Math.Linear(
      minOpacity,
      maxOpacity,
      Phaser.Math.Clamp(1 - distance / maxDistance, 0, 1)
    );

    collectItemManager.state[0].item[0].setAlpha(opacity);
  }

  init() {
    overlapMilk1 = true;
    overlapMilk2 = true;
    overlapMilk3 = true;
    collectItemManager = manageCollectItem(this);
    deliverToSign = true; // temp for testing
    deliverToSakuraTree = true; // temp for testing
    deliverToHouse = true; // temp for testing
    this.playerMoveTemple = playerMoveTemple;
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
  }

  update(delta, time) {
    //dev skip the scene
    this.scene.start('Delivery2');

    //testing movement
    this.playerMoveTemple(player, 1000, false, false, null, null, null);
    //camera follow player
    camera.startFollow(player);
    //player drown
    playerDrown(this, player, shallow_water);
    //player collect milk
    if (overlapMilk1) {
      overlapMilk1 = !collectItemManager.collect(
        player,
        0,
        milkTargetSize,
        milk1
      );
    }
    if (overlapMilk2) {
      overlapMilk2 = !collectItemManager.collect(
        player,
        1,
        milkTargetSize,
        milk2
      );
    }
    if (overlapMilk3) {
      overlapMilk3 = !collectItemManager.collect(
        player,
        2,
        milkTargetSize,
        milk3
      );
    }
    // //player deliver milk
    if (deliverToSign) {
      deliverToSign = !collectItemManager.deliver(player, 'milk', sign);
    }
    if (deliverToSakuraTree) {
      deliverToSakuraTree = !collectItemManager.deliver(
        player,
        'milk',
        sakuraTree
      );
    }
    if (deliverToHouse) {
      deliverToHouse = !collectItemManager.deliver(player, 'milk', house);
    }
    // checking for deliver success
    if (
      !deliverToSign &&
      !deliverToSakuraTree &&
      !deliverToHouse
    ) {
      gate.setTexture('gate-active');
      const overlapping = this.physics.overlap(player, gate);
      if (overlapping) {
        this.scene.start('Delivery2');
      } else {
        this.updateItemOpacity(gate);
      }
    }
  }
}

export default Delivery;
