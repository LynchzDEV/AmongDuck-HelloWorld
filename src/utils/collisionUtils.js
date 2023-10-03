const enableInteractivityOnOverlap = (scene, interactiveObject, player, overlapObject) => {
  scene.physics.add.overlap(player, overlapObject, () => {
    interactiveObject.setInteractive();
    console.log("set interactive");
    console.log("overlap");
  });
};

export default enableInteractivityOnOverlap;