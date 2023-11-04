/**
 * @param {Phaser.Scene} sceneObj
 * @param {number} rectX
 * @param {number} rectY
 * @param {number} width
 * @param {number} height
 * @param {number} depth
 */
const shallowWater = (sceneObj, rectX, rectY, width, height, depth) => {
  return sceneObj.add.rectangle(rectX, rectY, width, height).setDepth(depth);
};

let isFadingOut = false; // Variable to track the fade-out status

const handleShutdown = (sceneObj) => {
  sceneObj.events.on('shutdown', () => {
    isFadingOut = false; // Reset the flag when the scene is shut down
  });
};

/**
 * @param {Phaser.Scene} sceneObj
 * @param {Phaser.Types.Physics.Arcade.SpriteWithDynamicBody} player
 * @param {Phaser.GameObjects.Rectangle} water
 * @param {boolean?} haveBeenTo
 */
const playerDrown = (sceneObj, player, water) => {
  const overlapping = sceneObj.physics.overlap(player, water);
  if (overlapping && !isFadingOut) {
    sceneObj.cameras.main.fadeOut(1000, 0, 0, 0, (camera, progress) => {
      isFadingOut = true;
      if (progress === 1) {
        sceneObj.scene.restart();
      }
    });
  }
};

export { shallowWater, handleShutdown, playerDrown };