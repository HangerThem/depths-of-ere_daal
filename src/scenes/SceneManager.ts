import { IScene } from "../types/scenes/IScene.js"
import { ISceneManager } from "../types/scenes/ISceneManager.js"

export class SceneManager implements ISceneManager {
  private currentScene: IScene | null = null

  constructor(private canvasId: string) {}

  loadScene(scene: IScene): void {
    if (this.currentScene) {
      this.currentScene.cleanup()
    }
    this.currentScene = scene
    this.currentScene.initialize(this.canvasId, this.loadScene.bind(this))
  }

  update(deltaTime: number): void {
    if (this.currentScene) {
      this.currentScene.update(deltaTime)
    }
  }
}
