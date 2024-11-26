import { HealthComponent } from "./HealthComponent.js"

export class DestructibleComponent extends HealthComponent {
  public particlesOnDestroy: boolean = true

  constructor({ health = 100, maxHealth = 100 } = {}) {
    super({ health, maxHealth })
  }
}
