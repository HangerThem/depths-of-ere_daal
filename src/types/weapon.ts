import { EnemyObject } from "./enemy"
import { ObstacleObject } from "./obstacle"
import { BaseGameObject } from "./base"

export interface IProjectile extends BaseGameObject {
  distanceToLive: number
  update(enemies: EnemyObject[], obstacles: ObstacleObject[]): void
}

export interface IWeapon {
  attack(x: number, y: number, rotation: number): void
  update(enemies: EnemyObject[], obstacles: ObstacleObject[]): void
}
