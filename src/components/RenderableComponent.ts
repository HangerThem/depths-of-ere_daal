import { IComponent } from "../ecs/Component.js"

/**
 * Represents the different shapes that can be rendered in the game.
 */
export enum Shape {
  SQUARE,
  CIRCLE,
  SPRITE,
}

/**
 * Represents a component that deals with rendering in the game.
 * @implements {IComponent}
 */
export class RenderableComponent implements IComponent {
  public shape: Shape
  public width: number
  public height: number
  private _color: string
  public sprite?: HTMLImageElement | undefined

  /**
   * Creates an instance of RenderableComponent.
   *
   * @param shape - The shape of the entity (default is Shape.SQUARE).
   * @param width - The width of the entity (default is 0).
   * @param height - The height of the entity (default is 0).
   * @param color - The color of the entity (default is "#ffffff").
   * @param sprite - The sprite of the entity (default is an empty Image).
   */
  constructor({
    shape = Shape.SQUARE,
    width = 0,
    height = 0,
    color = "#ffffff",
    sprite = new Image(),
  } = {}) {
    this.shape = shape
    this.width = width
    this.height = height
    this._color = color
    this.sprite = sprite
  }

  public get color() {
    return this._color
  }

  public set color(value: string) {
    if (!/^#[0-9A-F]{6}$/i.test(value)) {
      throw new Error("Invalid color")
    }
    this._color = value
  }
}
