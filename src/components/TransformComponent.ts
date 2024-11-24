import { IComponent } from "../ecs/Component.js"

type Position = {
  x: number
  y: number
}

export class TransformComponent implements IComponent {
  public position: Position
  private _rotation: number

  constructor({ position = { x: 0, y: 0 }, rotation = 0 } = {}) {
    this.position = position
    this._rotation = rotation
  }

  get rotation() {
    return this._rotation
  }

  set rotation(value) {
    if (value < 0) {
      this._rotation = 360 + value
    } else if (value >= 360) {
      this._rotation = value % 360
    } else {
      this._rotation = value
    }
  }
}
