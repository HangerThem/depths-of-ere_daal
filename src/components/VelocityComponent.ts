import { Component } from "../ecs/Component.js"

export class VelocityComponent extends Component {
  vx: number
  vy: number

  constructor(vx = 0, vy = 0) {
    super()
    this.vx = vx
    this.vy = vy
  }
}
