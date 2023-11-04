import { OverlapObject } from './event/TaskManager';

/**
 * @type {Phaser.Input.InputPlugin} input
 */
let input;

const setInput = (newInput) => {
  input = newInput;
};

/**
 * Handle interactions with different objects based on texture keys.
 * @param {boolean} isDesktop
 * @param {Phaser.Input.Keyboard.Key} desktopKey
 * @param {Phaser.Types.Physics.Arcade.SpriteWithDynamicBody} altBtn
 * @param {Phaser.Types.Physics.Arcade.SpriteWithDynamicBody} interactBtn
 * @param {Phaser.Types.Physics.Arcade.SpriteWithDynamicBody} player
 * @param {OverlapObject} target
 * @param {OverlapObject[]} varianceTargets
 */
const handleInteractiveBtn = (
  isDesktop,
  desktopKey,
  altBtn,
  interactBtn,
  player,
  target,
  varianceTargets
) => {
  const isTargetOverlapWithPlayer = target.isOverlapWithPlayer(player);
  const isVariancesOverlapWithPlayer = varianceTargets.some((varianceTarget) =>
    varianceTarget.isOverlapWithPlayer(player)
  );
  const noOverlapWithAnyTarget =
    !isVariancesOverlapWithPlayer && !isTargetOverlapWithPlayer;
  if (isTargetOverlapWithPlayer) {
    if (isDesktop) {
      if (desktopKey.isDown && !target.gameObj.fnCalled) {
        handleInteraction(target, player);
      }
    } else {
      altBtn.setVisible(false);
      interactBtn.setVisible(true).setDepth(1000);
      input.on('gameobjectdown', (pointer, gameObject) => {
        if (gameObject === interactBtn && !target.gameObj.fnCalled) {
          handleInteraction(target, player);
        }
      });
    }
  } else if (noOverlapWithAnyTarget) {
    if (!isDesktop) {
      altBtn.setVisible(true);
      interactBtn.setVisible(false).setDepth(998);
      input.on('gameobjectdown', (pointer, gameObject) => {
        if (gameObject === interactBtn && !target.gameObj.fnCalled) {
          handleInteraction(target, player);
        }
      });
    }
  }
};

const handleInteraction = (target, player) => {
  const interactions = {
    ladder: () => {
      target.gameObj.fn();
      target.gameObj.fnCalled = true;
    },
    npc1: () => target.gameObj.fn(),
    npc2: () => target.gameObj.fn(),
    npc3: () => target.gameObj.fn(),
    npc4: () => target.gameObj.fn(),
    npc5: () => target.gameObj.fn(),
    npc6: () => target.gameObj.fn(),
  };

  if (target.isOverlapWithPlayer(player)) {
    const interactionFn = interactions[target.textureKey];
    if (interactionFn) {
      interactionFn();
    }
  }
};

/**
 * @param {Phaser.Input.Keyboard.KeyboardPlugin} keyboard
 * @description don't need to pass this.keyboard if deviceKey is not 'desktop'
 * @param {Phaser.Physics.Arcade.ArcadePhysics} physics
 * @param {[number, number]} pos
 * @param {string} objectKey
 * @param {string} deviceKey
 */
const createInteractInput = (keyboard, deviceKey, physics, pos, objectKey) => {
  if (deviceKey !== 'desktop') {
    const scale = deviceKey === 'mobile' ? 5 : 7;
    const [x, y] = pos;
    return physics.add
      .sprite(x, y, objectKey)
      .setScale(scale)
      .setSize(15, 15)
      .setInteractive()
      .setDepth(999)
      .setAlpha(0.7)
      .setScrollFactor(0);
  } else {
    return keyboard.addKey('E');
  }
};

export { setInput, handleInteractiveBtn, createInteractInput };
