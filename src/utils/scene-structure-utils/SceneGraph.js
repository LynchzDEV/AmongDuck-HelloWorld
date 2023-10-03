import SceneNode from "./SceneNode";

class SceneGraph {
  constructor() {
    this.nodes = new Map();
  }

  addScene(key, conditionCallback) {
    const node = new SceneNode(key, conditionCallback);
    this.nodes.set(key, node);
    return node;
  }

  addTransition(fromSceneKey, toSceneKey, conditionCallback) {
    const fromNode = this.nodes.get(fromSceneKey);
    const toNode = this.nodes.get(toSceneKey);
    if (fromNode && toNode) {
      fromNode.addTransition(toNode, conditionCallback);
    }
  }

  getNextSceneKey(currentSceneKey, gameContext) {
    const currentNode = this.nodes.get(currentSceneKey);
    return currentNode ? currentNode.getNextSceneKey(gameContext) : null;
  }
}

export default SceneGraph;
