import { ICamera } from "../types/core/camera"
import { SceneBounds } from "../types/scene"

/**
 * Manages the camera position, zoom level, and screen shake effects.
 * Uses the Singleton pattern to ensure only one instance is created.
 */
class Camera implements ICamera {
  private static instance: Camera | null = null

  private _x: number = 0
  private _y: number = 0
  private targetX: number = 0
  private targetY: number = 0
  private bounds: SceneBounds = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  }
  private canvas: HTMLCanvasElement
  private zoomLevel: number = 1

  private isShaking: boolean = false
  private shakeDuration: number = 0
  private shakeMagnitude: number = 0
  private shakeElapsed: number = 0

  /**
   * Private constructor to enforce Singleton pattern
   * @param canvas - The canvas element
   */
  private constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.bounds = { x: 0, y: 0, width: canvas.width, height: canvas.height }
  }

  /**
   * Gets the singleton instance of the Camera.
   * @param canvas - The canvas element (required on first call)
   * @throws Error if canvas is not provided on first initialization
   * @returns The Camera instance
   */
  public static getInstance(canvas?: HTMLCanvasElement): Camera {
    if (!Camera.instance) {
      if (!canvas) {
        throw new Error("Canvas must be provided for the first initialization.")
      }
      Camera.instance = new Camera(canvas)
    }
    return Camera.instance
  }

  /**
   * Sets the camera bounds and clamps the current position within the new bounds.
   * @param bounds - The new boundaries for the camera.
   */
  public setBounds(bounds: {
    x: number
    y: number
    width: number
    height: number
  }): void {
    this.bounds = bounds
    this.targetX = Math.max(
      this.bounds.x,
      Math.min(this.targetX, this.bounds.width - this.canvas.width)
    )
    this.targetY = Math.max(
      this.bounds.y,
      Math.min(this.targetY, this.bounds.height - this.canvas.height)
    )
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
   * Centers the camera on the specified world coordinates.
   * @param worldX - The X coordinate in the world space.
   * @param worldY - The Y coordinate in the world space.
   */
  public centerOn(worldX: number, worldY: number): void {
    this.targetX = worldX - this.canvas.width / 2
    this.targetY = worldY - this.canvas.height / 2

    this.targetX = Math.max(
      this.bounds.x,
      Math.min(this.targetX, this.bounds.width - this.canvas.width)
    )

    this.targetY = Math.max(
      this.bounds.y,
      Math.min(this.targetY, this.bounds.height - this.canvas.height)
    )

    this._x = Math.round(this.targetX)
    this._y = Math.round(this.targetY)
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

    this.targetX = target.x - this.canvas.width / 2
    this.targetY = target.y - this.canvas.height / 2

    this.targetX = Math.max(
      this.bounds.x,
      Math.min(this.targetX, this.bounds.width - this.canvas.width)
    )
    this.targetY = Math.max(
      this.bounds.y,
      Math.min(this.targetY, this.bounds.height - this.canvas.height)
    )

    this.targetX = Math.round(this.targetX)
    this.targetY = Math.round(this.targetY)
  }

  /**
   * Sets the zoom level of the camera.
   * @param level - The new zoom level.
   */
  public setZoom(level: number): void {
    this.zoomLevel = level
  }

  /**
   * Gets the current zoom level of the camera.
   * @returns The zoom level.
   */
  public getZoom(): number {
    return this.zoomLevel
  }

  /**
   * Applies the camera transformations to the rendering context.
   * @param ctx - The canvas rendering context.
   */
  public apply(ctx: CanvasRenderingContext2D): void {
    ctx.save()
    ctx.translate(-this._x, -this._y)
    ctx.scale(this.zoomLevel, this.zoomLevel)
    if (this.isShaking) {
      const shakeX = (Math.random() * 2 - 1) * this.shakeMagnitude
      const shakeY = (Math.random() * 2 - 1) * this.shakeMagnitude
      ctx.translate(shakeX, shakeY)
    }
  }

  /**
   * Updates the camera's position and shaking state.
   */
  public update(deltaTime: number): void {
    const smoothingFactor = 0.1
    this._x += (this.targetX - this._x) * smoothingFactor
    this._y += (this.targetY - this._y) * smoothingFactor

    if (this.isShaking) {
      this.shakeElapsed += deltaTime
      if (this.shakeElapsed >= this.shakeDuration) {
        this.isShaking = false
        this.shakeElapsed = 0
      }
    }
  }

  /**
   * Initiates a screen shake effect.
   * @param duration - Duration of the shake in milliseconds.
   * @param magnitude - Magnitude of the shake.
   */
  public shake(duration: number, magnitude: number): void {
    this.isShaking = true
    this.shakeDuration = duration
    this.shakeMagnitude = magnitude
    this.shakeElapsed = 0
  }

  /**
   * Removes the camera transformations from the rendering context.
   * @param ctx - The canvas rendering context.
   */
  public reset(ctx: CanvasRenderingContext2D): void {
    ctx.restore()
  }
}

export { Camera }
