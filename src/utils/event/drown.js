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
let hasPlayedSound = false; // Variable to track if the sound has been played

const handleShutdown = (sceneObj) => {
  sceneObj.events.on('shutdown', () => {
    isFadingOut = false;
    hasPlayedSound = false;
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
    isFadingOut = true;
    if (!hasPlayedSound) {
      sceneObj.sound.play('drown');
      hasPlayedSound = true;
    }
    sceneObj.cameras.main.fadeOut(1000, 0, 0, 0, (camera, progress) => {
      if (progress === 1) {
        isFadingOut = false;
        hasPlayedSound = false;
        sceneObj.scene.restart();
      }
    });
  }
};


export { shallowWater, handleShutdown, playerDrown };