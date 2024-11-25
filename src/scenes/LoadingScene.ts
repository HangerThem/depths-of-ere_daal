import { RenderSystem } from "../systems/RenderSystem.js"
import { IScene } from "../types/scenes/IScene.js"
import { Scene } from "./Scene.js"

export class LoadingScene extends Scene {
  constructor() {
    super("load-scene")
  }

  initialize(canvasId: string, loadScene: (scene: IScene) => void): void {
    super.initialize(canvasId, loadScene)
    this.systemManager.addSystem(new RenderSystem(this.ctx!!))
  }
}
