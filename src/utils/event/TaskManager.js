class CND_TaskManager {
  /**
   * @param {CND_Task} task
   */
  static createInventoryItem(task) {
    const scene = task.scene;
    const itemPrototype = task.itemPrototype;
    const inventoryDetails = task.inventoryDetails;

    /**
     * @type {number}
     */
    const depth = itemPrototype.depth;
    const { itemKey, qty, inventoryItemSize } = inventoryDetails;

    inventoryDetails.posX_list = [];

    const fst_posX = inventoryDetails.fst_posX || 0;
    const posY = inventoryDetails.posY || 0;
    const halfSize = inventoryItemSize / 2;

    const scale = this.getInventoryItemScale(itemPrototype, inventoryItemSize); // * scale of the item in the inventory
    task.inventoryDetails.scale = scale;

    for (let i = 0; i < qty; i++) {
      const posX = i > 0 ? halfSize + (i - 1) * halfSize : fst_posX;
      task.inventoryBox[i] = scene.physics.add
        .image(posX, posY, itemKey)
        .setOrigin(0, 0) // * top left
        .setDepth(depth)
        .setAlpha(0.5) // * 0.5 opacity
        .setScrollFactor(0)
        .setScale(scale);
      inventoryDetails.posX_list.push(posX);
    }
  }

  /**
   * @description scale of the item in the inventory
   * @example if the item is 100x100 and the inventory item size is 50x50, then the scale is 0.5
   * @param {Phaser.Types.Physics.Arcade.ImageWithDynamicBody} itemPrototype
   * @param {number} inventoryItemSize
   */
  static getInventoryItemScale(itemPrototype, inventoryItemSize) {
    const width = itemPrototype.width;
    const height = itemPrototype.height;
    /**
     * @type {number}
     */
    const widthRatio = inventoryItemSize / width;
    /**
     * @type {number}
     */
    const heightRatio = inventoryItemSize / height;
    return Math.min(widthRatio, heightRatio);
  }

  /**
   * @param {Phaser.GameObjects.GameObject} player
   * @param {CND_Task[]} tasks
   */
  static handleCollectItem(player, tasks) {
    const currentTask = tasks[0];
    // * set visible to false for all items in another tasks except the current task
    /**
     * @type {CND_Task}
     */
    tasks.forEach((task) => {
      if (task !== currentTask) {
        task.items.forEach((item) => {
          item.item.setVisible(false);
        });
      } else if (task.length > 1) {
        task.items.forEach((item) => {
          item.gameObj.setVisible(true);
        });
      }
    });
    currentTask.items.forEach((item, i) => {
      if (item.isOverlapWithPlayer(player) && !item.collected) {
        const inventoryDetails = currentTask.inventoryDetails;
        const { posX_list, scale } = inventoryDetails;
        const posX = posX_list[i];
        const posY = inventoryDetails.posY || 0;
        item.collected = true;
        item.gameObj.setPosition(posX, posY).setScale(scale).setScrollFactor(0);
      }
    });
  }

  /**
   * @param {Phaser.GameObjects.GameObject} player
   * @param {Target} target
   * @param {CND_Task[]} tasks
   */
  static handleDeliverItem(player, target, tasks) {
    const currentTask = tasks[0];

    // if the number of item.delivered (true) in currentTask.items is equal to currentTask.inventoryDetails.qty return true
    currentTask.completed =
      currentTask.items.filter((item) => item.delivered).length ===
      currentTask.inventoryDetails.qty;

    if (currentTask.completed) {
      console.log('thank you'); // * show thank you message
      currentTask.items.forEach((item) => {
        item.destroy();
      });
      currentTask.inventoryBox.forEach((box) => {
        box.destroy();
      });
      tasks.shift();
      if (tasks.length > 0) {
        const nextTask = tasks[0];
        this.createInventoryItem(nextTask);
      }
    }

    const reqItemData = target.requiredItemDetails,
      curInvData = currentTask.inventoryDetails,
      items = currentTask.items;
    if (
      target.isOverlapWithPlayer(player) &&
      !target.satisfied &&
      curInvData.itemKey === reqItemData.itemKey
    ) {
      // ! don't forget to add press interact-btn condition
      const reqItemQty = reqItemData.qty;
      const collectedItems = items.filter(
        (item) => item.collected && !item.delivered
      );

      if (collectedItems.length < reqItemQty) {
        console.log('not enough items'); // * show not enough items message
      } else {
        // Limit the iteration to the first reqItemQty collected items
        collectedItems.slice(0, reqItemQty).forEach((item) => {
          item.delivered = true;
          item.tint = 0x000000;
          target.receivedItems.push(item);
          target.satisfied = target.receivedItems.length === reqItemQty;
        });
      }
    }
  }
}

class CND_Task {
  /**
   * @param {Phaser.Scene} scene
   * @param {CollectableItem[]} items
   * @param {{itemKey: string, qty: number, inventoryItemSize: number, fst_posX?: number, posY?: number, posX_list?: number[]}} inventoryDetails
   */
  constructor(scene, items, inventoryDetails) {
    /**
     * @type {Phaser.Scene}
     */
    this._scene = scene;

    /**
     * @type {Phaser.Types.Physics.Arcade.ImageWithDynamicBody[]}
     */
    this._inventoryBox = [];

    /**
     * @type {CollectableItem[]}
     * @description items that need to be collected
     */
    this._items = items;

    /**
     * @type {CollectableItem}
     * @description item prototype
     */
    this._itemPrototype = this._items[0];

    /**
     * @description inventory details of the task
     * @type {{itemKey: string, qty: number, inventoryItemSize: number, fst_posX?: number, posY?: number, posX_list?: number[]}}
     * @property {string} itemKey
     * @property {number} qty
     * @property {number} inventoryItemSize
     * @property {number} [fst_posX]
     * @property {number} [posY]
     * @property {number[]} [posX_list]
     */
    this._inventoryDetails = inventoryDetails;

    /**
     * @type {boolean}
     * @description whether the task is completed
     * @default false
     */
    this._completed = false;
  }

  get scene() {
    return this._scene;
  }

  get itemPrototype() {
    return this._itemPrototype;
  }

  get inventoryBox() {
    return this._inventoryBox;
  }

  set inventoryBox(inventoryBox) {
    this._inventoryBox = inventoryBox;
  }

  get items() {
    return this._items;
  }

  set items(items) {
    this._items = items;
  }

  get inventoryDetails() {
    return this._inventoryDetails;
  }

  completed() {
    this._completed = true;
  }
}

class OverlapObject {
  /**
   * @param {Phaser.Physics.Arcade.ArcadePhysics} physics
   * @param {Phaser.GameObjects.GameObject} object
   */
  constructor(physics, object) {
    /**
     * @type {Phaser.Physics.Arcade.ArcadePhysics}
     */
    this.physics = physics;
    /**
     * @type {Phaser.GameObjects.GameObject}
     */
    this.object = object;
  }

  /**
   * @param {Phaser.GameObjects.GameObject} player
   */
  isOverlapWithPlayer(player) {
    return this.physics.overlap(player, this.object);
  }

  get gameObj() {
    return this.object;
  }
}

class Target extends OverlapObject {
  /**
   * @param {{itemKey: string, qty: number}} reqiuredItemDetails
   * @param {Phaser.Physics.Arcade.ArcadePhysics} physics
   * @param {[number, number]} pos
   * @param {string} textureKey
   * @param {number} scale
   * @param {number} depth
   * @param {boolean} toTopLeft
   */
  constructor(
    reqiuredItemDetails,
    physics,
    pos,
    textureKey,
    scale,
    depth,
    toTopLeft = true
  ) {
    const [x, y] = pos;
    const [a, b] = toTopLeft ? [0, 0] : [0.5, 0.5]; // ? Is 0.5 is center of the image
    const object = physics.add
      .sprite(x, y, textureKey)
      .setScale(scale)
      .setDepth(depth)
      .setOrigin(a, b);
    super(physics, object);
    /**
     * @type {{itemKey: string, qty: number}}
     */
    this.requiredItemDetails = reqiuredItemDetails;
    this.receivedItems = [];
    this.satisfied = this.receivedItems.length === this.requiredItemDetails.qty;
  }
}

class Item extends OverlapObject {
  /**
   * @param {Phaser.Physics.Arcade.ArcadePhysics} physics
   * @param {[number, number]} pos
   * @param {string} textureKey
   * @param {number} scale
   * @param {number} depth
   * @param {boolean} toTopLeft
   */
  constructor(physics, pos, textureKey, scale, depth, toTopLeft = true) {
    const [x, y] = pos;
    const [a, b] = toTopLeft ? [0, 0] : [0.5, 0.5]; // ? Is 0.5 is center of the image
    const object = physics.add
      .image(x, y, textureKey)
      .setScale(scale)
      .setDepth(depth)
      .setOrigin(a, b);
    super(physics, object);
  }

  get position() {
    return [this.object.x, this.object.y];
  }

  get textureKey() {
    return this.object.texture.key;
  }

  get depth() {
    return this.object.depth;
  }

  get width() {
    return this.object.width;
  }

  get height() {
    return this.object.height;
  }
}

class CollectableItem extends Item {
  /**
   * @param {Phaser.Physics.Arcade.ArcadePhysics} physics
   * @param {[number, number]} pos
   * @param {string} textureKey
   * @param {number} scale
   * @param {number} depth
   * @param {boolean} toTopLeft
   * @param {number} inventoryItemSize
   */
  constructor(
    physics,
    pos,
    textureKey,
    scale,
    depth,
    inventoryItemSize,
    toTopLeft = true
  ) {
    super(physics, pos, textureKey, scale, depth, toTopLeft);
    /**
     * @type {boolean}
     */
    this.collected = false;
    this.delivered = false;
    /**
     * @type {number}
     */
    this.inventoryItemSize = inventoryItemSize;
  }

  /**
   * @param {[number, number]} pos
   */
  set position([x, y]) {
    this.object.x = x;
    this.object.y = y;
  }

  /**
   * @param {number} scale
   */
  set scale(scale) {
    this.object.setScale(scale);
  }

  /**
   * @param {boolean} fixed
   */
  set fixedToCamera(fixed) {
    this.object.setScrollFactor(fixed ? 0 : 1);
  }

  /**
   * @param {number} alpha
   */
  set alpha(alpha) {
    this.object.setAlpha(alpha);
  }

  /**
   * @param {number} colour
   */
  set tint(colour) {
    this.object.setTint(colour);
  }
}

class MilkItem extends CollectableItem {
  /**
   * @param {Phaser.Physics.Arcade.ArcadePhysics} physics
   * @param {[number, number]} pos
   * @param {number} scale
   * @param {number} depth
   * @param {boolean} toTopLeft
   * @param {number} inventoryItemSize
   */
  constructor(physics, pos, scale, depth, inventoryItemSize, toTopLeft = true) {
    super(physics, pos, 'milk', scale, depth, inventoryItemSize, toTopLeft);
  }
}

class ContainableObject extends OverlapObject {
  /**
   * @param {Phaser.Physics.Arcade.ArcadePhysics} physics
   * @param {[number, number]} pos
   * @param {string} textureKey
   * @param {number} scale
   * @param {number} depth
   * @param {boolean} toTopLeft
   * @param {number} initFrame
   */
  constructor(
    physics,
    pos,
    textureKey,
    scale,
    depth,
    toTopLeft = true,
    initFrame = 0
  ) {
    const [x, y] = pos;
    const [a, b] = toTopLeft ? [0, 0] : [0.5, 0.5]; // ? Is 0.5 is center of the image
    const object = physics.add
      .sprite(x, y, textureKey)
      .setScale(scale)
      .setDepth(depth)
      .setOrigin(a, b)
      .setFrame(initFrame);
    super(physics, object);
    /**
     * @type {CollectableItem}
     */
    this.item = null;
  }

  /**
   * @param {CollectableItem} item
   */
  addItem(item) {
    if (this.item) {
      this.item.destroy();
    }
    this.item = item;
  }
}

export {
  CND_TaskManager,
  CND_Task,
  MilkItem,
  ContainableObject,
  CollectableItem,
  Item,
  Target,
  OverlapObject,
};
