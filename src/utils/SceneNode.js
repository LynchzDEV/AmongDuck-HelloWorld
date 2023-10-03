class SceneNode {
  constructor(key, conditionCallback) {
    this.key = key;
    this.conditionCallback = conditionCallback;
    this.transitions = new Map();
  }

  addTransition(sceneNode, conditionCallback) {
    this.transitions.set(sceneNode, conditionCallback);
  }

  canTransition(gameContext) {
    return Array.from(this.transitions.entries()).find(
      ([node, condition]) => condition(gameContext) && node.conditionCallback()
    );
  }

  getNextSceneKey(gameContext) {
    const [nextNode] = this.canTransition(gameContext) || [];
    return nextNode ? nextNode.key : null;
  }
}

export default SceneNode;
