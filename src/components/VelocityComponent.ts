import { IComponent } from "../ecs/Component.js"

export class VelocityComponent implements IComponent {
  public vx: number
  public vy: number

  constructor(vx = 0, vy = 0) {
    this.vx = vx
    this.vy = vy
  }
}
