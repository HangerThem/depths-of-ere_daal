import { IComponent } from "../ecs/Component.js"

/**
 * Represents a component that deals with rendering in the game.
 * @implements {IComponent}
 */
export class RenderableComponent implements IComponent {
  public width: number
  public height: number
  public color: string
  public sprite: string
  public layer: number
  public isAnimated: boolean
  public frameCount: number
  public animationSpeed: number
  public animationFrame: number
  public elapsedTime: number = 0

  /**
   * Creates an instance of RenderableComponent.
   *
   * @param shape - The shape of the entity (default is Shape.SQUARE).
   * @param width - The width of the entity (default is 0).
   * @param height - The height of the entity (default is 0).
   * @param color - The fallback color of the entity (default is "#ffffff").
   * @param sprite - The sprite of the entity (default is an empty string).
   */
  constructor({
    width = 0,
    height = 0,
    color = "#ffffff",
    sprite = "",
    layer = 0,
    isAnimated = false,
    frameCount = 0,
    animationSpeed = 0,
    animationFrame = 0,
  } = {}) {
    this.width = width
    this.height = height
    this.color = color
    this.sprite = sprite
    this.layer = layer
    this.isAnimated = isAnimated
    this.frameCount = frameCount
    this.animationSpeed = animationSpeed
    this.animationFrame = animationFrame
  }

  public update(deltaTime: number) {
    this.elapsedTime += deltaTime

    const timePerFrame = 1 / this.animationSpeed

    while (this.elapsedTime >= timePerFrame) {
      this.animationFrame = (this.animationFrame + 1) % this.frameCount
      this.elapsedTime -= timePerFrame
    }
  }
}
