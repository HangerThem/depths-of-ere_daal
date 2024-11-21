import { DialogSystem } from "../dialog.js"
import {
  GameStateConstructorParams,
  IGameState,
} from "../types/core/gameState.js"
import { IPlayer } from "../types/gameObjects/player"
import { ISceneManager } from "../types/core/sceneManager.js"
import { SceneManager } from "./sceneManager.js"
import { ICamera } from "../types/core/camera.js"
import { Camera } from "./camera.js"
import { PlayerNotInitializedError } from "../errors/PlayerErrors.js"
import { CanvasCtxInitializationError } from "../errors/RenderingErrors.js"
import { Player } from "../gameObjects/player.js"
import { gameObjectFactory } from "../factories/GameObjectFactory.js"

/**
 * Manages the game state using the Singleton pattern.
 * Handles the player, time, delta time, camera, dialog system, and scene manager.
 */
export class GameState implements IGameState {
  private static instance: IGameState | null = null

  private _player: IPlayer | null
  private _time: number
  private _deltaTime: number
  private _camera: ICamera
  private _dialogSystem: DialogSystem
  private _sceneManager: ISceneManager
  private _canvas: HTMLCanvasElement
  private _ctx: CanvasRenderingContext2D

  /**
   * Private constructor to enforce Singleton pattern
   * @param ctx - The 2D rendering context
   * @param canvas - The canvas element
   */
  private constructor({ ctx, canvas }: GameStateConstructorParams) {
    this._player = null
    this._time = 0
    this._deltaTime = 0
    this._camera = Camera.getInstance(canvas)
    this._dialogSystem = new DialogSystem({ ctx, canvas })
    this._sceneManager = SceneManager.getInstance(ctx, canvas)
    this._canvas = canvas
    this._ctx = ctx
  }

  /**
   * Gets the singleton instance of GameState
   * @param ctx - The 2D rendering context (required on first call)
   * @param canvas - The canvas element (required on first call)
   * @throws Error if ctx and canvas are not provided on first initialization
   * @returns The GameState instance
   */
  public static getInstance(
    ctx?: CanvasRenderingContext2D,
    canvas?: HTMLCanvasElement
  ): IGameState {
    if (!GameState.instance) {
      if (!ctx || !canvas) {
        throw new CanvasCtxInitializationError()
      }
      GameState.instance = new GameState({ ctx, canvas })
    }
    return GameState.instance
  }

  /**
   * Adds a player object to the game state
   */
  public addPlayer(): void {
    this._player = gameObjectFactory.createPlayer({
      x: 0,
      y: 0,
      height: 32,
      width: 32,
      color: "blue",
      gameState: this,
    })
  }

  /**
   * Checks if the player is initialized
   * @returns True if player exists, false otherwise
   */
  public isPlayerInitialized(): boolean {
    return this._player !== null
  }

  /**
   * Gets the player object safely
   * @throws PlayerNotInitializedError if player is not initialized
   * @returns The player object
   */
  public getPlayer(): IPlayer {
    if (!this._player) {
      throw new PlayerNotInitializedError()
    }
    return this._player
  }

  /**
   * Safely executes a function with the player object
   * @param action Function to execute with the player object
   * @returns True if action was executed, false if player wasn't initialized
   */
  public withPlayer(action: (player: IPlayer) => void): boolean {
    if (this._player) {
      action(this._player)
      return true
    }
    return false
  }

  /**
   * Gets the player object.
   * @returns The player object
   */
  get player(): IPlayer | null {
    return this._player
  }

  /**
   * Sets the player object.
   * @param player - The player object
   */
  set player(newPlayer: IPlayer | null) {
    if (newPlayer === null) {
      console.warn(
        "Setting player to null - this might cause issues in the game"
      )
    }
    this._player = newPlayer
  }

  /**
   * Gets the current time.
   * @returns The current time
   */
  get time(): number {
    return this._time
  }

  /**
   * Gets the time since the last frame.
   * @returns The time since the last frame
   */
  get deltaTime(): number {
    return this._deltaTime
  }

  /**
   * Gets the camera object.
   * @returns The camera object
   */
  get dialogSystem(): DialogSystem {
    return this._dialogSystem
  }

  /**
   * Gets the scene manager object.
   * @returns The scene manager object
   */
  get sceneManager(): ISceneManager {
    return this._sceneManager
  }

  /**
   * Gets the camera object.
   * @returns The camera object
   */
  get camera(): ICamera {
    return this._camera
  }

  /**
   * Sets the current time.
   * @param time - The current time
   */
  set time(time: number) {
    this._time = time
  }

  /**
   * Sets the time since the last frame.
   * @param deltaTime - The time since the last frame
   */
  set deltaTime(deltaTime: number) {
    this._deltaTime = deltaTime
  }

  /**
   * Gets the dimensions of the canvas
   * @returns An object containing width and height
   */
  public getCanvasDimensions(): { width: number; height: number } {
    return {
      width: this._canvas.width,
      height: this._canvas.height,
    }
  }

  /**
   * Clears the entire canvas
   */
  public clearCanvas(): void {
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height)
  }

  /**
   * Draw content on the canvas using the provided drawing function
   * @param drawFn - Function that contains drawing operations
   */
  public draw(drawFn: (ctx: CanvasRenderingContext2D) => void): void {
    drawFn(this._ctx)
  }

  /**
   * Set canvas scale
   * @param scaleX - Horizontal scale factor
   * @param scaleY - Vertical scale factor
   */
  public setCanvasScale(scaleX: number, scaleY: number): void {
    this._ctx.scale(scaleX, scaleY)
  }
}
