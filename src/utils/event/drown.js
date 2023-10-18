const shallowWater = (sceneObj, rectX, rectY, width, height, depth) => {
  return sceneObj.add.rectangle(rectX, rectY, width, height).setDepth(depth);
};

const playerDrown = (sceneObj, player, water) => {
  const overlapping = sceneObj.physics.overlap(player, water);
  if (overlapping) {
    sceneObj.scene.restart();
  }
};

export { shallowWater, playerDrown };