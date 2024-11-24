import { IComponent } from "../ecs/Component"

export class ProjectileComponent implements IComponent {
  public damage: number
  public speed: number
  public range: number
  public distanceTraveled: number
  public target: number
  public hasHit: boolean

  constructor({
    damage = 10,
    speed = 1,
    range = 1,
    distanceTraveled = 0,
    target = 0,
    hasHit = false,
  } = {}) {
    this.damage = damage
    this.speed = speed
    this.range = range
    this.distanceTraveled = distanceTraveled
    this.target = target
    this.hasHit = hasHit
  }

  public update(deltaTime: number) {
    this.distanceTraveled += this.speed * deltaTime
    if (this.distanceTraveled >= this.range) {
      this.hasHit = true
    }
  }

  public hit() {
    this.hasHit = true
  }

  public isHit() {
    return this.hasHit
  }

  public setTarget(target: number) {
    this.target = target
  }
}
