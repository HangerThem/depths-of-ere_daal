import { IComponent } from "../ecs/Component"

export enum DamageType {
  PHYSICAL,
  FIRE,
  ICE,
  POISON,
  MAGIC,
}

export class DamageComponent implements IComponent {
  public damage: number
  public type: DamageType

  constructor({ damage = 0, type = DamageType.PHYSICAL } = {}) {
    this.damage = damage
    this.type = type
  }
}
