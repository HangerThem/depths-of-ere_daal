import { IGame } from "../types/core/IGame.js"
import { ISceneManager } from "../types/scenes/ISceneManager.js"
import { SceneManager } from "../scenes/SceneManager.js"
import { MainMenuScene } from "../scenes/MainMenuScene.js"

/**
 * The main game class.
 * Initializes the game canvas and game state.
 */
class Game implements IGame {
  private animationFrameId: number | null = null
  private sceneManager: ISceneManager

  /**
   * Creates a new Game instance.
   * @throws Error if the canvas element with ID 'gameCanvas' is not found
   * @throws Error if the canvas element is not an HTMLCanvasElement
   */
  constructor(canvasId: string = "gameCanvas") {
    this.sceneManager = new SceneManager(canvasId)
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

  /**
   * Starts the game.
   */
  public start() {
    this.lastFrameTime = performance.now()
    this.sceneManager.loadScene(new MainMenuScene())
    this.update(this.lastFrameTime)
  }

  /**
   * Stops the game.
   */
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
