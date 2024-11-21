import { Component } from "../ecs/Component.js"

export class TransformComponent extends Component {
  public x: number
  public y: number
  private _rotation: number
  private _scaleX: number
  private _scaleY: number

  constructor(x = 0, y = 0, rotation = 0, scaleX = 1, scaleY = 1) {
    super()
    this.x = x
    this.y = y
    this._rotation = rotation
    this._scaleX = scaleX
    this._scaleY = scaleY
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

  get scaleX() {
    return this._scaleX
  }

  set scaleX(value) {
    if (value === 0) {
      throw new Error("Scale cannot be 0")
    }
    this._scaleX = value
  }

  get scaleY() {
    return this._scaleY
  }

  set scaleY(value) {
    if (value === 0) {
      throw new Error("Scale cannot be 0")
    }
    this._scaleY = value
  }
}
