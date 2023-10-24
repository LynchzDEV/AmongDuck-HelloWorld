const manageCollectItem = (sceneObj, taskState) => {
  let state = taskState;
  let inventory = [];

  const calculateShallowLength = () => {
    return inventory.filter((item) => item.collected && !item.delivered).length;
  };

  const calculateItemProperties = (item, targetSize) => {
    const { height, width, _depth } = item;
    const itemkey = item.texture.key;
    const widthRatio = targetSize / width;
    const heightRatio = targetSize / height;
    const ratio = Math.min(widthRatio, heightRatio);

    return {
      _depth,
      itemkey,
      ratio,
    };
  };

  const createInventory = (slotDetail) => {
    slotDetail.startPosX = [];
    for (let i = 0; i < slotDetail.item.length; i++) {
      let targetSize = slotDetail.targetSize,
        initStartPosX = slotDetail.initStartPosX ? slotDetail.initStartPosX : 0,
        startPosY = slotDetail.initStartPosY ? slotDetail.initStartPosY : 0;

      const { height, width, _depth } = slotDetail.item[i];
      const itemKey = slotDetail.item[i].texture.key;
      const widthRatio = targetSize / width;
      const heightRatio = targetSize / height;
      const ratio = Math.min(widthRatio, heightRatio);
      const halfTargetSize = targetSize / 2;

      const startPosX =
        i > 0 ? halfTargetSize + (i - 1) * halfTargetSize : initStartPosX;
      slotDetail.item[i] = sceneObj.physics.add
        .image(startPosX, startPosY, itemKey)
        .setAlpha(slotDetail.alpha)
        .setScale(ratio)
        .setOrigin(0, 0)
        .setDepth(_depth)
        .setScrollFactor(0);
      slotDetail.startPosX.push(startPosX);
      if (slotDetail.callBack) {
        slotDetail.callBack(slotDetail.item[i]);
      }
    }
  };

  const initInventory = () => {
    createInventory(state[0]);
  };

  const collect = (player, itemIndex, targetSize, item) => {
    const slotDetail = state[0];
    const itemToCollect = item;
    const { ratio } = calculateItemProperties(itemToCollect, targetSize);
    const startPosX = slotDetail.startPosX[itemIndex];
    const startPosY = slotDetail.initStartPosY || 0;

    const overlapping = sceneObj.physics.overlap(player, itemToCollect);

    if (!overlapping) {
      return false;
    }
    itemToCollect.x = startPosX;
    itemToCollect.y = startPosY;
    itemToCollect.setScale(ratio);
    itemToCollect.setScrollFactor(0);
    inventory.push(itemToCollect);
    itemToCollect.collected = true;
    return true;
  };

  const deliver = (player, itemKey, target) => {
    inventory.shallowLength = calculateShallowLength();
    const isItemFound =
      inventory.findIndex((item) => item.texture.key === itemKey) >= 0 &&
      inventory.shallowLength > 0;
    const overlapping = sceneObj.physics.overlap(player, target);
    if (overlapping && isItemFound) {
      const index = inventory.findIndex(
        (item) => item.collected && !item.delivered
      );
      inventory[index].setTint(0x000000); // indicate that item is delivered
      inventory[index].delivered = true;
      inventory.shallowLength = calculateShallowLength();
      state[0].sizeOfInventory -= 1;
      if (state[0].sizeOfInventory === 0) {
        state[0].success = true;
      }
      if (state[0].success) {
        inventory.forEach((item) => {
          item.destroy();
        });
        inventory = [];
        state[0].item.forEach((item) => {
          item.destroy();
        });
        state.shift();
        if (state.length > 0) {
          console.log(state[0]);
          createInventory(state[0]);
        }
      }
      return true;
    }
    return false;
  };

  return { state, collect, deliver, initInventory };
};

export { manageCollectItem };
