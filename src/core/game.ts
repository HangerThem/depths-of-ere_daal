import { IGame } from "../types/core/game"
import { StartScreen } from "../scenes/startScreen.js"
import { IGameState } from "../types/core/gameState.js"
import { GameState } from "./gameState.js"
import { CanvasInitializationError } from "../errors/RenderingErrors.js"

/**
 * The main game class.
 * Initializes the game canvas and game state.
 */
class Game implements IGame {
  private _canvas: HTMLCanvasElement
  private _ctx: CanvasRenderingContext2D
  private _gameState: IGameState
  private _animationFrameId: number | null = null

  /**
   * Creates a new Game instance.
   * @throws Error if the canvas element with ID 'gameCanvas' is not found
   * @throws Error if the canvas element is not an HTMLCanvasElement
   */
  constructor(canvas: HTMLCanvasElement) {
    if (!canvas) {
      throw new CanvasInitializationError("Canvas element not found")
    }
    this._canvas = canvas
    this._ctx = this._canvas.getContext("2d") as CanvasRenderingContext2D

    this._canvas.width = window.innerWidth
    this._canvas.height = window.innerHeight

    this._gameState = GameState.getInstance(this._ctx, this._canvas)
    this.load()
  }

  /**
   * Loads the game scenes.
   */
  private load(): void {
    this._gameState.sceneManager.addScene("start", new StartScreen())
    this._gameState.addPlayer()
  }

  /**
   * Unloads the game scenes.
   */
  private unload(): void {
    this._gameState.sceneManager.clearScenes()
  }

  /**
   * Updates the game state and current scene.
   */
  private update() {
    const now = performance.now()
    this._gameState.deltaTime = now - this._gameState.time
    this._gameState.time = now
    this._gameState.sceneManager.update()
    this._animationFrameId = window.requestAnimationFrame(() => this.update())
  }

  /**
   * Stops the game loop.
   */
  public stop() {
    if (this._animationFrameId !== null) {
      window.cancelAnimationFrame(this._animationFrameId)
      this._animationFrameId = null
    }
  }

  /**
   * Starts the game loop.
   */
  public start() {
    this.load()
    this._gameState.sceneManager.switchToScene("start")
    this.update()
  }
}

const canvasElement = document.getElementById("gameCanvas") as HTMLCanvasElement
const game = new Game(canvasElement)
game.start()
