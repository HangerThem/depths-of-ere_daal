import { Scene } from "./scene"
import { ISceneManager } from "./types/scene"

/**
 * Manages game scenes using the Singleton pattern.
 * Handles scene switching, updating, and maintaining the game's rendering context.
 */
class SceneManager implements ISceneManager {
  private static instance: SceneManager

  private ctx: CanvasRenderingContext2D
  private canvas: HTMLCanvasElement
  private currentScene: Scene | null
  private scenes: Map<string, Scene>

  /**
   * Private constructor to enforce Singleton pattern
   * @param ctx - The 2D rendering context
   * @param canvas - The canvas element
   */
  private constructor(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) {
    this.ctx = ctx
    this.canvas = canvas
    this.currentScene = null
    this.scenes = new Map<string, Scene>()
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
  ): SceneManager {
    if (!SceneManager.instance) {
      if (!ctx || !canvas) {
        throw new Error(
          "Canvas rendering context and canvas must be provided for the first initialization."
        )
      }
      SceneManager.instance = new SceneManager(ctx, canvas)
    }
    return SceneManager.instance
  }

  /**
   * Registers a new scene with the manager
   * @param name - Unique identifier for the scene
   * @param scene - The scene instance to register
   */
  public addScene(name: string, scene: Scene): void {
    this.scenes.set(name, scene)
  }

  /**
   * Switches to a different scene
   * @param name - Name of the scene to switch to
   * @param data - Optional data to pass to the new scene
   * @remarks Clears the canvas, exits the current scene, and enters the new scene
   */
  public switchToScene(name: string, data: any = null): void {
    const prevScene = this.currentScene
    const newScene = this.scenes.get(name)

    if (!newScene) {
      console.error(`Scene ${name} does not exist`)
      return
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    if (prevScene) {
      prevScene.exit()
    }

    this.currentScene = newScene

    try {
      this.currentScene.enter(data)
    } catch (error) {
      console.error("Error switching to scene:", error)
    }
  }

  /**
   * Updates the current scene
   * Called every frame to update game logic
   */
  update() {
    if (this.currentScene) {
      this.currentScene.update()
    }
  }
}

export { SceneManager }
