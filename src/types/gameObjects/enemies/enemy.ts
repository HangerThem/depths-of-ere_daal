import { BaseGameObject } from "../../base"
import { IPathFinder, Point } from "../../pathfinder"

export interface IEnemyState {
  health: number
  dead: boolean
  isAggressive: boolean
  lastPathUpdate: number
  target?: Point
}

export interface IEnemyConfig {
  id: string
  startPosition: Point
  pathFinder: IPathFinder
  maxHealth: number
  speed: number
  knockbackResistance: number
  aggroRange: number
  pathUpdateDelay: number
  waypointThreshold: number
  path: Point[] | null
}

export interface EnemyConstructorParams {
  x: number
  y: number
  width: number
  height: number
  color: string
  hp: number
}

export interface IEnemy extends BaseGameObject {
  enemyState: IEnemyState
  enemyConfig: IEnemyConfig
}
