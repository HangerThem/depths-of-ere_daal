import { IComponent } from "../ecs/Component"

/**
 * Represents the different types of weapons that can be used in the game.
 */
export enum WeaponType {
  SWORD,
  BOW,
  STAFF,
}

/**
 * Represents a component that deals with the weapon of an entity.
 * @implements {IComponent}
 */
export class WeaponComponent implements IComponent {
  public type: WeaponType
  public damage: number
  public attackSpeed: number
  public range: number
  public cooldown: number

  constructor({
    type = WeaponType.SWORD,
    damage = 10,
    attackSpeed = 1,
    range = 1,
    cooldown = 0,
  } = {}) {
    this.type = type
    this.damage = damage
    this.attackSpeed = attackSpeed
    this.range = range
    this.cooldown = cooldown
  }

  public attack() {
    this.cooldown = this.attackSpeed
  }

  public canAttack() {
    return this.cooldown <= 0
  }

  public update(deltaTime: number) {
    if (this.cooldown > 0) {
      this.cooldown -= Math.min(this.cooldown, deltaTime)
    }
  }

  public resetCooldown() {
    this.cooldown = this.attackSpeed
  }

  public isMelee() {
    return this.type === WeaponType.SWORD
  }

  public isRanged() {
    return this.type === WeaponType.BOW
  }

  public isMagic() {
    return this.type === WeaponType.STAFF
  }
}
