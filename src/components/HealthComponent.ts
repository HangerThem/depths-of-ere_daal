import { IComponent } from "../ecs/Component"

/**
 * Represents the health of an entity.
 * @implements {IComponent}
 */
export class HealthComponent implements IComponent {
  public health: number
  public maxHealth: number
  public lowHealthThreshold: number

  /**
   * Creates an instance of HealthComponent.
   *
   * @param health - The current health (default is 100).
   * @param maxHealth - The maximum health (default is 100).
   * @param lowHealthThreshold - The threshold for low health (quater of the maximum health by default).
   */
  constructor({
    health = 100,
    maxHealth = 100,
    lowHealthThreshold = maxHealth / 4,
  }: {
    health?: number
    maxHealth?: number
    lowHealthThreshold?: number
  } = {}) {
    this.health = health
    this.maxHealth = maxHealth
    this.lowHealthThreshold = lowHealthThreshold
  }

  public takeDamage(damage: number) {
    this.health -= damage
    if (this.health < 0) {
      this.health = 0
    }
  }

  public heal(healAmount: number) {
    this.health += healAmount
    if (this.health > this.maxHealth) {
      this.health = this.maxHealth
    }
  }

  public isDead() {
    return this.health <= 0
  }

  public isFullHealth() {
    return this.health === this.maxHealth
  }

  public isDamaged() {
    return this.health < this.maxHealth
  }

  public isHealthLow() {
    return this.health <= this.lowHealthThreshold
  }
}
