import { BaseGameObject } from "./base"
import { IObstacle } from "./obstacle"
import { IEnemy } from "./gameObjects/enemies/enemy"

export interface IProjectile extends BaseGameObject {
  active: boolean

  update(enemies: Set<IEnemy>, obstacles: Set<IObstacle>): void
}

export interface IWeapon {
  attack(x: number, y: number, rotation: number): void
  update(enemies: Set<IEnemy>, obstacles: Set<IObstacle>): void
}
