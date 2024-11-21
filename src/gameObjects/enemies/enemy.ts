import {
  EnemyObject,
  EnemyState,
  EnemyConfig,
  EnemyConstructorParams,
} from "../../types/gameObjects/enemies/enemy"
import { GameState } from "../../types/core/gameState.js"
import { ObstacleObject } from "../../types/obstacle"
import { PathFinder } from "../../pathfinder.js"
import { Point } from "../../types/pathfinder"

export class Enemy implements EnemyObject {
  x: number
  y: number
  width: number
  height: number
  color: string
  gameState: GameState
  enemyState: EnemyState
  enemyConfig: EnemyConfig

  constructor({
    x,
    y,
    width,
    height,
    color,
    hp,
    gameState,
  }: EnemyConstructorParams) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.color = color
    this.gameState = gameState

    const pathFinder = new PathFinder(32)

    this.enemyConfig = {
      id: Math.random().toString(36).substring(7),
      startPosition: { x, y },
      pathFinder,
      maxHealth: hp,
      speed: 2,
      knockbackResistance: 0.5,
      aggroRange: 500,
      pathUpdateDelay: 1000,
      waypointThreshold: 5,
      path: null,
    }

    this.enemyState = {
      position: { x, y },
      health: hp,
      dead: false,
      isAggressive: false,
      lastPathUpdate: 0,
    }
  }

  private updatePathToPlayer(obstacles: ObstacleObject[]): void {
    const player = this.gameState.player
    if (!player) return

    if (
      this.enemyConfig.pathFinder.needsPathUpdate(
        this.enemyConfig.id,
        this.enemyConfig.pathUpdateDelay
      )
    ) {
      const start: Point = { x: this.x, y: this.y }
      const end: Point = { x: player.x, y: player.y }
      this.enemyConfig.pathFinder.updatePath(
        this.enemyConfig.id,
        start,
        end,
        obstacles
      )
      this.enemyState.lastPathUpdate = Date.now()
    }
  }

  private moveAlongPath(): void {
    const nextWaypoint = this.enemyConfig.pathFinder.getNextWaypoint(
      this.enemyConfig.id
    )
    if (!nextWaypoint) return

    const dx = nextWaypoint.x - this.x
    const dy = nextWaypoint.y - this.y
    const distance = Math.hypot(dx, dy)

    if (distance < this.enemyConfig.waypointThreshold) {
      this.enemyConfig.pathFinder.advanceWaypoint(this.enemyConfig.id)
    } else {
      const speed = this.enemyConfig.speed
      this.x += (dx / distance) * speed
      this.y += (dy / distance) * speed
    }
  }

  update(player: any, obstacles: ObstacleObject[]): void {
    if (this.enemyState.dead) return

    const distanceToPlayer = Math.hypot(player.x - this.x, player.y - this.y)

    this.enemyState.isAggressive =
      distanceToPlayer < this.enemyConfig.aggroRange

    if (this.enemyState.isAggressive) {
      this.updatePathToPlayer(obstacles)
      this.moveAlongPath()
    }

    this.draw()
  }

  draw(): void {
    const ctx = this.gameState.ctx
    ctx.fillStyle = this.color
    ctx.fillRect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    )
  }
}
