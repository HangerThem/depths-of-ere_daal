import { IComponent } from "../ecs/Component"
import type { Velocity } from "./PhysicsComponent"
import type { Position } from "./TransformComponent"

export class ParticleComponent implements IComponent {
  public position: Position
  public velocity: Velocity
  public lifetime: number
  public size: number
  public color: string

  constructor({
    position = { x: 0, y: 0 },
    velocity = { vx: 0, vy: 0 },
    lifetime = 0,
    size = 0,
    color = "#000000",
  } = {}) {
    this.position = position
    this.velocity = velocity
    this.lifetime = lifetime
    this.size = size
    this.color = color
  }

  update(deltaTime: number): boolean {
    this.position.x += this.velocity.vx * deltaTime
    this.position.y += this.velocity.vy * deltaTime
    this.lifetime -= deltaTime
    return this.lifetime <= 0
  }
}
