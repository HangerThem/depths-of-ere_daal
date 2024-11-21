import { IGame } from "../types/core/IGame.js"
import { CanvasInitializationError } from "../errors/RenderingErrors.js"
import { ISceneManager } from "../types/scenes/ISceneManager.js"
import { SceneManager } from "../scenes/SceneManager.js"
import { MainMenuScene } from "../scenes/MainMenuScene.js"

/**
 * The main game class.
 * Initializes the game canvas and game state.
 */
class Game implements IGame {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private animationFrameId: number | null = null
  private sceneManager: ISceneManager

  /**
   * Creates a new Game instance.
   * @throws Error if the canvas element with ID 'gameCanvas' is not found
   * @throws Error if the canvas element is not an HTMLCanvasElement
   */
  constructor(canvasId: string = "gameCanvas") {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement
    if (!canvas) {
      throw new CanvasInitializationError(
        "Canvas element with ID 'gameCanvas' not found."
      )
    }
    this.canvas = canvas
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D

    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight

    this.sceneManager = new SceneManager(this.ctx)
  }

  private lastFrameTime: number = 0
  private update(currentTime: number) {
    const deltaTime = (currentTime - this.lastFrameTime) / 1000
    this.lastFrameTime = currentTime

    this.sceneManager.update(deltaTime)

    this.animationFrameId = window.requestAnimationFrame((time) =>
      this.update(time)
    )
  }

  public start() {
    this.lastFrameTime = performance.now()
    this.sceneManager.loadScene(new MainMenuScene("main-menu"))
    this.update(this.lastFrameTime)
  }

  public stop() {
    if (this.animationFrameId !== null) {
      window.cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
  }
}

console.log("Starting game...")
const game = new Game()
game.start()
