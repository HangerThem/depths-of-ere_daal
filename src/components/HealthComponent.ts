import { IComponent } from "../ecs/Component"

export class HealthComponent implements IComponent {
  public health: number
  public maxHealth: number
  public lowHealthThreshold: number

  constructor({ health = 100, maxHealth = 100, lowHealthThreshold = 0 } = {}) {
    this.health = health
    this.maxHealth = maxHealth
    this.lowHealthThreshold = lowHealthThreshold!
      ? lowHealthThreshold
      : maxHealth / 4
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
