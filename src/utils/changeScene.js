const changeSceneIf = (
  conditionCallback,
  nextSceneKey,
  sceneManager,
  gameContext
) => {
  if (conditionCallback()) {
    sceneManager.start(nextSceneKey, { gameContext: gameContext });
  }
};

const changeSceneBetween = (
  conditionCallback,
  sceneKeys,
  sceneManager,
  gameContext
) => {
  const indexOfNextScene = conditionCallback();
  sceneManager.start(sceneKeys[indexOfNextScene], { gameContext: gameContext });
};

export { changeSceneIf, changeSceneBetween };