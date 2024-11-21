import { Component } from "../ecs/Component.js"

export class VelocityComponent extends Component {
  public vx: number
  public vy: number

  constructor(vx = 0, vy = 0) {
    super()
    this.vx = vx
    this.vy = vy
  }
}
