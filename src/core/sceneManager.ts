import {
  CanvasCtxInitializationError,
  SceneAlreadyExistsError,
} from "../errors/RenderingErrors.js"
import {
  ISceneManager,
  SceneManagerConstructorParams,
} from "../types/core/sceneManager.js"
import { IScene } from "../types/scene"

/**
 * Manages game scenes using the Singleton pattern.
 * Handles scene switching, updating, and maintaining the game's rendering context.
 */
export class SceneManager implements ISceneManager {
  private static instance: ISceneManager | null = null

  private _ctx: CanvasRenderingContext2D
  private _canvas: HTMLCanvasElement
  private _scenes: Map<string, IScene>
  public currentScene: IScene | null

  /**
   * Private constructor to enforce Singleton pattern
   * @param ctx - The 2D rendering context
   * @param canvas - The canvas element
   */
  private constructor({ ctx, canvas }: SceneManagerConstructorParams) {
    this._ctx = ctx
    this._canvas = canvas
    this._scenes = new Map<string, IScene>()
    this.currentScene = null
  }

  /**
   * Gets the singleton instance of SceneManager
   * @param ctx - The 2D rendering context (required on first call)
   * @param canvas - The canvas element (required on first call)
   * @throws Error if ctx and canvas are not provided on first initialization
   * @returns The SceneManager instance
   */
  public static getInstance(
    ctx?: CanvasRenderingContext2D,
    canvas?: HTMLCanvasElement
  ): ISceneManager {
    if (!SceneManager.instance) {
      if (!ctx || !canvas) {
        throw new CanvasCtxInitializationError()
      }
      SceneManager.instance = new SceneManager({ ctx, canvas })
    }
    return SceneManager.instance
  }

  /**
   * Registers a new scene with the manager
   * @param name - Unique identifier for the scene
   * @param scene - The scene instance to register
   * @throws Error if a scene with the same name already exists
   */
  public addScene(name: string, scene: IScene): void {
    // if (this._scenes.has(name)) {
    //   throw new SceneAlreadyExistsError(name)
    // }

    this._scenes.set(name, scene)
  }

  /**
   * Removes all scenes from the manager
   */
  public clearScenes(): void {
    this._scenes.clear()
  }

  /**
   * Switches to a different scene
   * @param name - Name of the scene to switch to
   * @param data - Optional data to pass to the new scene
   * @throws Error if the scene with the given name does not exist
   * @remarks Clears the canvas, exits the current scene, and enters the new scene
   */
  public switchToScene(name: string, data: any = null): void {
    const prevScene = this.currentScene
    const newScene = this._scenes.get(name)

    if (!newScene) {
      throw new Error(`Scene with name '${name}' not found.`)
    }

    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height)
    if (prevScene) {
      prevScene.exit()
    }

    this.currentScene = newScene

    try {
      this.currentScene.enter(data)
    } catch (error) {
      console.error(error)
      this.currentScene = prevScene
      if (prevScene) {
        prevScene.enter()
      }
    }
  }

  /**
   * Updates the current scene
   * Called every frame to update game logic
   */
  public update() {
    if (this.currentScene) {
      this.currentScene.update()
    }
  }
}
