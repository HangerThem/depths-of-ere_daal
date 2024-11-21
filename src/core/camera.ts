import {
  CameraConstructorParams,
  ICamera,
  Target,
} from "../types/core/camera.js"
import { SceneBounds } from "../types/scene"

/**
 * Manages the camera position, zoom level, and screen shake effects.
 * Uses the Singleton pattern to ensure only one instance is created.
 */
export class Camera implements ICamera {
  private static instance: ICamera | null = null

  private _x: number = 0
  private _y: number = 0
  private _width: number = 0
  private _height: number = 0
  private _target: Target = {
    x: 0,
    y: 0,
  }
  private _bounds: SceneBounds = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  }
  private _canvas: HTMLCanvasElement
  private _zoomLevel: number = 1

  private _isShaking: boolean = false
  private _shakeDuration: number = 0
  private _shakeMagnitude: number = 0
  private _shakeElapsed: number = 0

  /**
   * Private constructor to enforce Singleton pattern
   * @param canvas - The canvas element
   */
  private constructor({ canvas }: CameraConstructorParams) {
    this._canvas = canvas
    this._bounds = { x: 0, y: 0, width: canvas.width, height: canvas.height }
  }

  /**
   * Gets the singleton instance of the Camera.
   * @param canvas - The canvas element (required on first call)
   * @throws Error if canvas is not provided on first initialization
   * @returns The Camera instance
   */
  public static getInstance(canvas?: HTMLCanvasElement): ICamera {
    if (!Camera.instance) {
      if (!canvas) {
        throw new Error("Canvas must be provided for the first initialization.")
      }
      Camera.instance = new Camera({ canvas })
    }
    return Camera.instance
  }

  /**
   * Gets the bounds of the camera.
   * @returns The bounds of the camera.
   */
  get bounds(): SceneBounds {
    return this._bounds
  }

  /**
   * Gets the X position of the camera.
   * @returns The X coordinate of the camera.
   */
  get x(): number {
    return this._x
  }

  /**
   * Gets the Y position of the camera.
   * @returns The Y coordinate of the camera.
   */
  get y(): number {
    return this._y
  }

  /**
   * Gets the width of the camera.
   * @returns The width of the camera.
   */
  get width(): number {
    return this._width
  }

  /**
   * Gets the height of the camera.
   * @returns The height of the camera.
   */
  get height(): number {
    return this._height
  }

  /**
   * Gets the target of the camera
   * @returns The target of the camera.
   */
  get target(): Target {
    return this._target
  }

  /**
   * Gets whether the camera is currently shaking.
   * @returns True if the camera is shaking, false otherwise.
   */
  get isShaking(): boolean {
    return this._isShaking
  }

  /**
   * Sets the bounds of the camera.
   * @param bounds - The bounds of the camera.
   */
  public setBounds(bounds: {
    x: number
    y: number
    width: number
    height: number
  }) {
    this._bounds = bounds

    this._target.x = Math.max(
      this.bounds.x,
      Math.min(this._target.x, this._bounds.width - this._canvas.width)
    )
    this._target.y = Math.max(
      this.bounds.y,
      Math.min(this._target.y, this._bounds.height - this._canvas.height)
    )
  }

  /**
   * Centers the camera on the specified world coordinates.
   * @param worldX - The X coordinate in the world space.
   * @param worldY - The Y coordinate in the world space.
   */
  public centerOn(worldX: number, worldY: number): void {
    this._target.x = worldX - this._canvas.width / 2
    this._target.y = worldY - this._canvas.height / 2

    this._target.x = Math.max(
      this.bounds.x,
      Math.min(this._target.x, this.bounds.width - this._canvas.width)
    )

    this._target.y = Math.max(
      this.bounds.y,
      Math.min(this._target.y, this.bounds.height - this._canvas.height)
    )

    this._x = Math.round(this._target.x)
    this._y = Math.round(this._target.y)
  }

  /**
   * Gets the screen position based on world coordinates.
   * @param worldX - The X coordinate in the world space.
   * @param worldY - The Y coordinate in the world space.
   * @returns The position on the screen.
   */
  public getScreenPosition(worldX: number, worldY: number) {
    return {
      x: worldX - this._x,
      y: worldY - this._y,
    }
  }

  /**
   * Makes the camera follow a target entity.
   * @param target - The target to follow, or null to stop following.
   */
  public follow(target: { x: number; y: number } | null): void {
    if (!target) return

    this._target.x = target.x - this._canvas.width / 2
    this._target.y = target.y - this._canvas.height / 2

    this._target.x = Math.max(
      this.bounds.x,
      Math.min(this._target.x, this.bounds.width - this._canvas.width)
    )
    this._target.y = Math.max(
      this.bounds.y,
      Math.min(this._target.y, this.bounds.height - this._canvas.height)
    )

    this._target.x = Math.round(this._target.x)
    this._target.y = Math.round(this._target.y)
  }

  /**
   * Sets the zoom level of the camera.
   * @param level - The new zoom level.
   */
  set zoom(level: number) {
    this._zoomLevel = level
  }

  /**
   * Gets the current zoom level of the camera.
   * @returns The zoom level.
   */
  get zoom(): number {
    return this._zoomLevel
  }

  /**
   * Applies the camera transformations to the rendering context.
   * @param ctx - The canvas rendering context.
   */
  public apply(ctx: CanvasRenderingContext2D): void {
    ctx.save()
    ctx.translate(-this._x, -this._y)
    ctx.scale(this._zoomLevel, this._zoomLevel)
    if (this.isShaking) {
      const shakeX = (Math.random() * 2 - 1) * this._shakeMagnitude
      const shakeY = (Math.random() * 2 - 1) * this._shakeMagnitude
      ctx.translate(shakeX, shakeY)
    }
  }

  /**
   * Updates the camera's position and shaking state.
   */
  public update(deltaTime: number): void {
    const smoothingFactor = 0.1
    this._x += (this._target.x - this._x) * smoothingFactor
    this._y += (this._target.y - this._y) * smoothingFactor

    if (this._isShaking) {
      this._shakeElapsed += deltaTime
      if (this._shakeElapsed >= this._shakeDuration) {
        this._isShaking = false
        this._shakeElapsed = 0
      }
    }
  }

  /**
   * Initiates a screen shake effect.
   * @param duration - Duration of the shake in milliseconds.
   * @param magnitude - Magnitude of the shake.
   */
  public shake(duration: number, magnitude: number): void {
    this._isShaking = true
    this._shakeDuration = duration
    this._shakeMagnitude = magnitude
    this._shakeElapsed = 0
  }

  /**
   * Removes the camera transformations from the rendering context.
   * @param ctx - The canvas rendering context.
   */
  public reset(ctx: CanvasRenderingContext2D): void {
    ctx.restore()
  }
}
