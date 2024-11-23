import { IComponent } from "../ecs/Component.js"

export enum Shape {
  SQUARE,
  CIRCLE,
}

export class RenderableComponent implements IComponent {
  public shape: Shape
  public width: number
  public height: number
  private _color: string

  constructor(
    shape: Shape = Shape.SQUARE,
    width = 0,
    height = 0,
    color = "#ffffff"
  ) {
    this.shape = shape
    this.width = width
    this.height = height
    this._color = color
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
