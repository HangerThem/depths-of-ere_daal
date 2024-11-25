import { IComponent } from "../ecs/Component"

/**
 * Represents a component that deals with projectiles in the game.
 * @implements {IComponent}
 */
export class ProjectileComponent implements IComponent {
  public damage: number
  public speed: number
  public range: number
  public distanceTraveled: number
  public target: number
  public hasHit: boolean

  /**
   * Creates an instance of ProjectileComponent.
   *
   * @param damage - The amount of damage (default is 10).
   * @param speed - The speed of the projectile (default is 1).
   * @param range - The range of the projectile (default is 1).
   * @param distanceTraveled - The distance the projectile has traveled (default is 0).
   * @param target - The target of the projectile (default is 0).
   * @param hasHit - Whether the projectile has hit its target (default is false).
   */
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
