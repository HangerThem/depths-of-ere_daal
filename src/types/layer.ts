import { BaseGameObject } from "./base"
import { IEnemy } from "./gameObjects/enemies/enemy"
import { IPlayer } from "./gameObjects/player"
import { INPC } from "./npc"
import { IObstacle } from "./obstacle"
import { ITile } from "./tile"
import { IProjectile } from "./weapon"

interface ILayer<T extends BaseGameObject> {
  objects: Set<T>
  addObject: (object: T) => void
  removeObject: (object: T) => void
  update: (...args: any[]) => void
  draw: () => void
}

export interface IBackgroundLayer extends ILayer<ITile> {}

export interface IObstacleLayer extends ILayer<IObstacle> {}

export interface INPCLayer extends ILayer<INPC> {}

export interface IProjectileLayer extends ILayer<IProjectile> {
  update: (enemies: Set<IEnemy>, obstacles: Set<IObstacle>) => void
}

export interface IEnemyLayer extends ILayer<IEnemy> {
  update: (obstacles: Set<IObstacle>) => void
}

export interface IPlayerLayer extends ILayer<IPlayer> {
  update: (obstacles: Set<IObstacle>) => void
}

export interface IUILayer extends ILayer<BaseGameObject> {
  isDialogActive: () => boolean
}
