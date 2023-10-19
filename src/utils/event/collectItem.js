const manageCollectItem = () => {
  let items = [];
  const targetWidth = 150,
    targetHeight = 150;

  const collect = (sceneObj, player, item) => {
    const { height, width, _depth } = item,
      { key } = item.texture;
    const widthRatio = targetWidth / width,
      heightRatio = targetHeight / height;
    const ratio = Math.min(widthRatio, heightRatio);
    const halfTargetWidth = targetWidth / 2;

    const overlapping = sceneObj.physics.overlap(player, item);
    if (overlapping) {
      const startPos =
        items.length > 0
          ? halfTargetWidth + (items.length - 1) * halfTargetWidth
          : 0;
      item.setVisible(false);
      item = sceneObj.physics.add
        .image(startPos, 0, key)
        .setScale(ratio)
        .setOrigin(0, 0)
        .setDepth(_depth)
        .setScrollFactor(0);

      items.push(item);
      return true;
    }
  };

  const deliver = (sceneObj, player, target) => {
    const overlapping = sceneObj.physics.overlap(player, target);
    if (overlapping) {
      const item = items.pop();
      if (item) {
        item.destroy();
        return true;
      }
    }
  };

  const initInventory = (sceneObj, item, sizeOfInventory) => {
    const { height, width, _depth } = item,
      { key } = item.texture;
    const widthRatio = targetWidth / width,
      heightRatio = targetHeight / height;
    const ratio = Math.min(widthRatio, heightRatio);
    const halfTargetWidth = targetWidth / 2;
    let i;
    for (i = 0; i < sizeOfInventory; i++) {
      const startPos = i > 0 ? halfTargetWidth + (i - 1) * halfTargetWidth : 0;
      item = sceneObj.physics.add
        .image(startPos, 0, key)
        .setAlpha(0.5)
        .setScale(ratio)
        .setOrigin(0, 0)
        .setDepth(_depth)
        .setScrollFactor(0);
    }
  };

  return { collect, deliver, initInventory };
};

export { manageCollectItem };
