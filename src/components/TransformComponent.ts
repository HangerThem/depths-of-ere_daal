import { IComponent } from "../ecs/Component.js"

type Position = {
  x: number
  y: number
}

export class TransformComponent implements IComponent {
  public position: Position
  private _rotation: number
  public scale = { x: 1, y: 1 }

  constructor({
    position = { x: 0, y: 0 },
    rotation = 0,
    scale = { x: 1, y: 1 },
  } = {}) {
    this.position = position
    this._rotation = rotation
    this.scale = scale
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
