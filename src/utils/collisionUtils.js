const handleInteractiveBtn = (
  isDesktop,
  desktopKey,
  scene,
  replace,
  interactiveObject,
  player,
  overlapObject,
  callBack
) => {
  if (scene.physics.overlap(player, overlapObject)) {
    if (isDesktop) {
      if (desktopKey.isDown) {
        callBack();
      }
    } else {
      replace.setVisible(false);
      interactiveObject.setVisible(true).setDepth(1000);
      scene.input.on('gameobjectdown', (pointer, gameObject) => {
        if (gameObject === interactiveObject) {
          callBack();
        }
      });
    }
  } else {
    if (isDesktop) {
      if (desktopKey.isDown) {
        callBack();
      }
    } else {
      replace.setVisible(true);
      interactiveObject.setVisible(false).setDepth(998);
      scene.input.on('gameobjectdown', (pointer, gameObject) => {
        if (gameObject === interactiveObject) {
          callBack();
        }
      });
    }
  }
};

export default handleInteractiveBtn;
