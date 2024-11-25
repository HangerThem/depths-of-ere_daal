import { AssetManager } from "../core/AssetManager.js"
import { IScene } from "../types/scenes/IScene.js"
import { ISceneManager } from "../types/scenes/ISceneManager.js"
import { LoadingScene } from "./LoadingScene.js"

/**
 * SceneManager class that can be used to manage scenes.
 * @implements {ISceneManager}
 */
export class SceneManager implements ISceneManager {
  private currentScene: IScene | null = null
  private assetManager: AssetManager

  /**
   * Creates an instance of SceneManager.
   *
   * @param canvasId - The ID of the canvas element.
   */
  constructor(private canvasId: string) {
    this.assetManager = AssetManager.getInstance()
  }

  /**
   * Loads a new scene into the game.
   *
   * @param scene - The scene to load.
   */
  loadScene(scene: IScene): void {
    if (this.currentScene) {
      this.currentScene.cleanup()
    }

    this.assetManager.unloadAssets()
    this.loadLoadingScene(scene)
  }

  /**
   * Loads the loading scene.
   *
   * @param scene - The scene to load.
   */
  private loadLoadingScene(scene: IScene): void {
    const loadingScene = new LoadingScene()
    loadingScene.initialize(this.canvasId, this.loadScene.bind(this))
    this.currentScene = loadingScene

    this.assetManager.onComplete(() => {
      this.currentScene = scene
      this.currentScene.initialize(this.canvasId, this.loadScene.bind(this))
    })

    this.assetManager.loadAssets(scene.assets)
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
