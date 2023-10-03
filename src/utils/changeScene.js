const changeSceneIf = (
  condition,
  thisScene,
  nextSceneKey,
  gameContext = {}
) => {
  if (condition) {
    thisScene.start(nextSceneKey, { gameContext: gameContext });
  }
};

const changeSceneBetween = (
  conditionCallback,
  thisScene,
  sceneKeys,
  gameContext = {}
) => {
  const indexOfNextScene = conditionCallback();
  thisScene.start(sceneKeys[indexOfNextScene], { gameContext: gameContext });
};

export { changeSceneIf, changeSceneBetween };