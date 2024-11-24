import { IComponent } from "../ecs/Component"

export class HealthComponent implements IComponent {
  public health: number
  public maxHealth: number

  constructor({ health = 100, maxHealth = 100 } = {}) {
    this.health = health
    this.maxHealth = maxHealth
  }

  public takeDamage(damage: number) {
    this.health -= damage
    if (this.health < 0) {
      this.health = 0
    }
  }
}
