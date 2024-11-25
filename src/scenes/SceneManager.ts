import { IScene } from "../types/scenes/IScene.js"
import { ISceneManager } from "../types/scenes/ISceneManager.js"

/**
 * SceneManager class that can be used to manage scenes.
 * @implements {ISceneManager}
 */
export class SceneManager implements ISceneManager {
  private currentScene: IScene | null = null

  /**
   * Creates an instance of SceneManager.
   *
   * @param canvasId - The ID of the canvas element.
   */
  constructor(private canvasId: string) {}

  /**
   * Loads a new scene into the game.
   *
   * @param scene - The scene to load.
   */
  loadScene(scene: IScene): void {
    if (this.currentScene) {
      this.currentScene.cleanup()
    }
    this.currentScene = scene
    this.currentScene.initialize(this.canvasId, this.loadScene.bind(this))
  }

  /**
   * Updates the current scene based on the delta time.
   *
   * @param deltaTime - The time since the last frame.
   */
  update(deltaTime: number): void {
    if (this.currentScene) {
      this.currentScene.update(deltaTime)
    }
  }
}
