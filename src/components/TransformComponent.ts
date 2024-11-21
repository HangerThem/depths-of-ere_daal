import { Component } from "../ecs/Component.js"

export class TransformComponent extends Component {
  x: number
  y: number
  rotation: number
  scaleX: number
  scaleY: number

  constructor(x = 0, y = 0, rotation = 0, scaleX = 1, scaleY = 1) {
    super()
    this.x = x
    this.y = y
    this.rotation = rotation
    this.scaleX = scaleX
    this.scaleY = scaleY
  }
}
