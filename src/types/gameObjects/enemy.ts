import { Point } from "./pathfinder"
import { BaseGameObject } from "./base"
import { GameState } from "./game"
import { PathFinder } from "../pathfinder"

export interface EnemyState {
  position: Point
  health: number
  dead: boolean
  isAggressive: boolean
  lastPathUpdate: number
  target?: Point
}

export interface EnemyConfig {
  id: string
  startPosition: Point
  pathFinder: PathFinder
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
  gameState: GameState
}

export interface EnemyObject extends BaseGameObject {
  enemyState: EnemyState
  enemyConfig: EnemyConfig
  gameState: GameState
}
