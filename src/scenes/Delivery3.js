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
import { shallowWater, playerDrown } from "../utils/event/drown";
import { manageCollectItem } from "../utils/event/collectItem";
import handleInteractiveBtn from "../utils/collisionUtils";
import { updateTextOpacity } from "../utils/event/updateTextOpacity"; // ! new func

const isMobile = /mobile/i.test(navigator.userAgent);
const tablet = window.innerWidth < 1280;

let camera;
let water;
let backgrounds;
let cloundLayer1;
let cloundLayer2;
let platforms;
let components;
let jumppad1;
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
let ladder;
let shallow_water;
//npc // ! new component
let npc4, npc5;
//player
let player;

//control flow
let left;
let right;
let up;
const windowHeight = window.innerHeight > 720 ? 720 : window.innerHeight;
let interactButton;
let isLeftPressed = false;
let isRightPressed = false;
let isUpPressed = false;
//manage collect item
let collectItemManager;
const milkTargetSize = 150,
    keyTargetSize = 100,
    gateTargetSize = 90;
let overlapKey = true;
let overlapChest = true;
let overlapMilkInChest = false;
let overlapMilkOnBench = true;
let deliverToChest = true;

//Overlap
let deliverToNpc4 = true;
let deliverToNpc5 = true;

class Delivery3 extends Phaser.Scene {
    constructor() {
        super("Delivery3");
        this.interactKey = null;
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
                screenHeight = windowHeight;
                console.log("Mobile view");
                console.log(`Screen Width: ${screenWidth}px`);
                console.log(`Screen Height: ${screenHeight}px`);

                left = this.physics.add
                    .sprite(
                        screenWidth / 2 - screenWidth / 3,
                        screenHeight / 1.2,
                        "left"
                    )
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
                    .sprite(
                        screenWidth / 2 + screenWidth / 3.5,
                        screenHeight / 1.2,
                        "up"
                    )
                    .setScale(5)
                    .setSize(15, 15)
                    .setInteractive()
                    .setDepth(999)
                    .setAlpha(0.7)
                    .setScrollFactor(0);

                interactButton = this.physics.add
                    .sprite(
                        screenWidth / 2 + screenWidth / 3.5,
                        screenHeight / 1.2,
                        "right"
                    )
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
                screenHeight = windowHeight;
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
                    .sprite(
                        screenWidth - screenWidth / 8,
                        screenHeight / 1.2,
                        "up"
                    )
                    .setScale(7)
                    .setSize(15, 15)
                    .setInteractive()
                    .setDepth(999)
                    .setAlpha(0.7)
                    .setScrollFactor(0);

                interactButton = this.physics.add
                    .sprite(
                        screenWidth - screenWidth / 8,
                        screenHeight / 1.2,
                        "right"
                    )
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
            console.log("desktop");
            camera.setViewport(0, 0, width, height);
        }
    }
    addBackgroundElements(mapWidth, mapHeight) {
        backgrounds = this.add.group();
        let bg = this.add
            .tileSprite(0, 0, mapWidth, mapHeight, "background")
            .setOrigin(0, 0)
            .setScale(1.4)
            .setDepth(SKY_DEPTH)
            .setScrollFactor(OBJECT_SCROLL.CLOUD - 0.1);
        //mid clound
        cloundLayer1 = this.add
            .tileSprite(0, 0, mapWidth, mapHeight, "clound-layer2")
            .setOrigin(0, 0)
            .setScale(1.4)
            .setDepth(SKY_DEPTH)
            .setScrollFactor(OBJECT_SCROLL.CLOUD);
        // front
        cloundLayer2 = this.add
            .tileSprite(0, 0, mapWidth, mapHeight, "clound-layer1")
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
            .tileSprite(0, mapHeight - 150, mapWidth, 200, "water")
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
    addPlatforms(floorHeight) {
        platforms = this.physics.add.staticGroup();
        let ground = this.add
            .image(-150, floorHeight + 5, "ground-main3") // ! set new x,y, maybe temporary
            .setOrigin(0, 0)
            .setDepth(MIDDLEGROUND_DEPTH);
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
    addMainComponents() {
        //add gate
        gatePrevious = this.physics.add
            .image(52, 1145, "gate-active")
            .setOrigin(0, 0)
            .setScale(1)
            .setDepth(MIDDLEGROUND_DEPTH);
        gateNext = this.physics.add
            .image(3640, 1145, "gate")
            .setOrigin(0, 0)
            .setScale(1)
            .setDepth(MIDDLEGROUND_DEPTH);
        gateNext.flipX = true;
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
        chest = this.physics.add
            .sprite(2010, 285, "chest")
            .setOrigin(0, 0)
            .setScale(1)
            .setDepth(MIDDLEGROUND_DEPTH);
        //default chest frame
        chest.setFrame(21);

        key = this.physics.add
            .image(2400, 1023, "key")
            .setOrigin(0, 0)
            .setScale(1)
            .setDepth(MIDDLEGROUND_DEPTH);
        sign = this.add
            .image(3456, 1088, "sign")
            .setOrigin(0, 0)
            .setScale(1)
            .setDepth(MIDDLEGROUND_DEPTH);
        milkInChest = this.physics.add
            .image(2010 + 40, 285 + 50, "milk")
            .setOrigin(0, 0)
            .setScale(0.8)
            .setDepth(MIDDLEGROUND_DEPTH);
        milkInChest.setVisible(false);
        milkOnBench = this.physics.add
            .image(555, 120, "milk")
            .setOrigin(0, 0)
            .setScale(0.8)
            .setDepth(MIDDLEGROUND_DEPTH);
        milkOnCloud = this.physics.add
            .image(0, 1500, "milk") // out of screen
            .setOrigin(0, 0)
            .setScale(0.8)
            .setDepth(MIDDLEGROUND_DEPTH);
        ladder = this.physics.add
            .image(3609, 0, "ladder")
            .setOrigin(0, 0)
            .setScale(1)
            .setDepth(MIDDLEGROUND_DEPTH);

        // init inverntory
        collectItemManager = manageCollectItem(this, [
            {
                success: false,
                item: [key],
                sizeOfInventory: 1,
                targetSize: keyTargetSize,
                initStartPosX: 30,
                initStartPosY: 30,
                alpha: 0.5,
            },
            {
                success: false,
                item: [milkInChest, milkOnBench, milkOnCloud],
                sizeOfInventory: 3,
                targetSize: milkTargetSize,
                alpha: 0.5,
            },
        ]);
        collectItemManager.initInventory();
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
        this.add
            .image(800, 612, "sakura-tree")
            .setOrigin(0, 0)
            .setScale(1)
            .setDepth(FOREGROUND_DEPTH);

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
    addNpc() {
        npc4 = this.physics.add
            .sprite(859, 1130, "npc4")
            .setOrigin(0, 0)
            .setScale(0.2)
            .setDepth(MIDDLEGROUND_DEPTH);
        npc5 = this.physics.add
            .sprite(1900, 1130, "npc5")
            .setOrigin(0, 0)
            .setScale(0.2)
            .setDepth(MIDDLEGROUND_DEPTH);

        npc4.anims.play("idle_npc4", true);
        npc5.anims.play("idle_npc5", true);
        npc5.flipX = true;
    }
    //message
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
        jumppad1 = this.add
            .image(2914, 861, "jumppad2")
            .setOrigin(0, 0)
            .setScale(1)
            .setDepth(FOREGROUND_DEPTH);

        //no gravity pad on nextGate platform
        noGravityPad = this.add
            .image(3445, 1225, "jumppad2")
            .setOrigin(0, 0)
            .setScale(1)
            .setDepth(FOREGROUND_DEPTH);
    }
    addPlayerAndCollider(floorHeight) {
        //player
        // player = this.physics.add
        //   .sprite(100, floorHeight - 40, 'player')
        //   .setCollideWorldBounds(true)
        //   .setScale(0.3)
        //   .setSize(180, 200)
        //   .setDepth(PLAYER_DEPTH);
        player = this.physics.add // ! comment for working in event_handling branch
            .sprite(3609, 0, "player")
            .setCollideWorldBounds(true)
            .setScale(0.3)
            .setSize(180, 200)
            .setDepth(PLAYER_DEPTH);
        player.setFrame(5);
        this.physics.add.collider(player, platforms);
    }

    create() {
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

        //setting world and camera
        const returnCamera = this.setWorldBoundsAndCamera(
            mapHeight,
            mapWidth,
            camera
        );
        camera = returnCamera;
        this.setDeviceSpecificControls(height, width, camera);
        // ! add interaction key
        this.interactKey = this.input.keyboard.addKey("e");
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
    }

    update(delta, time) {
        //dev skip the scene
        this.scene.start("Delivery4"); // ! comment for working in event_handling branch

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

        handleInteractiveBtn(
            !isMobile && !tablet,
            this.interactKey,
            this,
            up,
            interactButton,
            player,
            ladder,
            () => {
                this.scene.start("Delivery4", {
                    scene: this,
                    manager: collectItemManager,
                });
            }
        );

        //camera follow player
        camera.startFollow(player);

        //player drown
        playerDrown(this, player, shallow_water);

        //player collect key
        if (overlapKey) {
            overlapKey = !collectItemManager.collect(
                player,
                0,
                keyTargetSize,
                key
            );
        }
        //player unlock chest
        if (deliverToChest) {
            deliverToChest = !collectItemManager.deliver(player, "key", chest);
            if (!deliverToChest) {
                this.anims.play("chest-rotate", chest);
                this.time.delayedCall(2300, () => {
                    milkInChest.setVisible(true);
                    milkInChest.setVelocityY(-100);
                    this.time.delayedCall(450, () => {
                        milkInChest.setVelocityY(0);
                        // player can collect milk
                        this.time.delayedCall(300, () => {
                            overlapMilkInChest = true;
                        });
                    });
                });
            }
        }
        //player collect milk
        if (overlapMilkInChest) {
            overlapMilkInChest = !collectItemManager.collect(
                player,
                0,
                milkTargetSize,
                milkInChest
            );
        }
        if (overlapMilkOnBench) {
            overlapMilkOnBench = !collectItemManager.collect(
                player,
                1,
                milkTargetSize,
                milkOnBench
            );
            // ! new logic from Scope, I have to read this carefully
            //? npc1 message check When object collected this text will be disappear
            if (deliverToNpc4) {
                //updateTextOpacity(player, target, message)
                this.updateTextOpacity(player, npc4, this.requireNpc4);
            } else {
                this.requireNpc4.setAlpha(0);
            }
            //? npc1 message check When object collected this text will be disappear
            if (deliverToNpc5) {
                //updateTextOpacity(player, target, message)
                this.updateTextOpacity(player, npc5, this.requireNpc5);
            } else {
                this.requireNpc5.setAlpha(0);
            }
        }
    }
}

export default Delivery3;
