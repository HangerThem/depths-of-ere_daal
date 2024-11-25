import { IComponent } from "../ecs/Component"

/**
 * Represents the different types of damage that can be dealt in the game.
 */
export enum DamageType {
  PHYSICAL,
  FIRE,
  ICE,
  POISON,
  MAGIC,
}

/**
 * Represents a component that deals with damage in the game.
 * @implements {IComponent}
 */
export class DamageComponent implements IComponent {
  public damage: number
  public type: DamageType

  /**
   * Creates an instance of DamageComponent.
   *
   * @param damage - The amount of damage (default is 0).
   * @param type - The type of damage (default is DamageType.PHYSICAL).
   */
  constructor({ damage = 0, type = DamageType.PHYSICAL } = {}) {
    this.damage = damage
    this.type = type
  }
}
