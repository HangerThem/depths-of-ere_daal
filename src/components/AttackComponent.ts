import { IComponent } from "../ecs/Component"

export class AttackComponent implements IComponent {
  public damage: number
  public attackSpeed: number
  public range: number
  public attackTimer: number

  constructor({
    damage = 10,
    attackSpeed = 1,
    range = 1,
    attackTimer = 0,
  } = {}) {
    this.damage = damage
    this.attackSpeed = attackSpeed
    this.range = range
    this.attackTimer = attackTimer
  }

  public canAttack() {
    return this.attackTimer <= 0
  }

  public resetAttackTimer() {
    this.attackTimer = this.attackSpeed
  }

  public update(deltaTime: number) {
    if (this.attackTimer > 0) {
      this.attackTimer -= deltaTime
    }
  }

  public attack() {
    this.resetAttackTimer()
  }
}
