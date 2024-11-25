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

  /**
   * Creates an instance of RenderableComponent.
   *
   * @param shape - The shape of the entity (default is Shape.SQUARE).
   * @param width - The width of the entity (default is 0).
   * @param height - The height of the entity (default is 0).
   * @param color - The fallback color of the entity (default is "#ffffff").
   * @param sprite - The sprite of the entity (default is an empty string).
   */
  constructor({ width = 0, height = 0, color = "#ffffff", sprite = "" } = {}) {
    this.width = width
    this.height = height
    this.color = color
    this.sprite = sprite
  }
}
