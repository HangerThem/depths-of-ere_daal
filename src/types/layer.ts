import { BaseGameObject } from "./base"
import { EnemyObject } from "./enemy"
import { Target } from "./camera"
import { ObstacleObject } from "./obstacle"
import { PlayerObject } from "./player"

interface ILayer {
  objects: BaseGameObject[]
  draw: () => void
}

export interface IBackgroundLayer extends ILayer {
  update: () => void
}

export interface IObstacleLayer extends ILayer {
  update: () => void
}

export interface INPCLayer extends ILayer {
  update: (player: PlayerObject) => void
}

export interface IProjectileLayer extends ILayer {
  update: (enemies: EnemyObject[], obstacles: ObstacleObject[]) => void
}

export interface IEnemyLayer extends ILayer {
  update: (player: PlayerObject, obstacles: ObstacleObject[]) => void
}

export interface IPlayerLayer extends ILayer {
  update: (obstacles: ObstacleObject[]) => void
  getTarget(): Target | null
}

export interface IUILayer extends ILayer {}
