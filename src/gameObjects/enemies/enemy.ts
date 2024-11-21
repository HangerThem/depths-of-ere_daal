import {
  IEnemy,
  IEnemyState,
  IEnemyConfig,
  EnemyConstructorParams,
} from "../../types/gameObjects/enemies/enemy"
import { IGameState } from "../../types/core/gameState.js"
import { IObstacle } from "../../types/obstacle"
import { PathFinder } from "../../pathfinder.js"
import { Point } from "../../types/pathfinder"
import { GameState } from "../../core/gameState.js"
import { IPlayer } from "../../types/gameObjects/player"

export class Enemy implements IEnemy {
  private _x: number
  private _y: number
  private _width: number
  private _height: number
  private _color: string
  private _gameState: IGameState
  private _enemyState: IEnemyState
  private _enemyConfig: IEnemyConfig

  constructor({ x, y, width, height, color, hp }: EnemyConstructorParams) {
    this._x = x
    this._y = y
    this._width = width
    this._height = height
    this._color = color
    this._gameState = GameState.getInstance()

    const pathFinder = new PathFinder(32)

    this._enemyConfig = {
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

    this._enemyState = {
      health: hp,
      dead: false,
      isAggressive: false,
      lastPathUpdate: 0,
    }
  }

  private updatePathToPlayer(obstacles: Set<IObstacle>): void {
    this._gameState.withPlayer((player) => {
      if (
        this._enemyConfig.pathFinder.needsPathUpdate(
          this._enemyConfig.id,
          this._enemyConfig.pathUpdateDelay
        )
      ) {
        const start: Point = { x: this._x, y: this._y }
        const end: Point = { x: player.x, y: player.y }
        this._enemyConfig.pathFinder.updatePath(
          this._enemyConfig.id,
          start,
          end,
          obstacles
        )
        this._enemyState.lastPathUpdate = Date.now()
      }
    })
  }

  private moveAlongPath(): void {
    const nextWaypoint = this._enemyConfig.pathFinder.getNextWaypoint(
      this._enemyConfig.id
    )
    if (!nextWaypoint) return

    const dx = nextWaypoint.x - this._x
    const dy = nextWaypoint.y - this._y
    const distance = Math.hypot(dx, dy)

    if (distance < this._enemyConfig.waypointThreshold) {
      this._enemyConfig.pathFinder.advanceWaypoint(this._enemyConfig.id)
    } else {
      const speed = this._enemyConfig.speed
      this._x += (dx / distance) * speed
      this._y += (dy / distance) * speed
    }
  }

  update(player: IPlayer, obstacles: Set<IObstacle>): void {
    if (this._enemyState.dead) return

    const distanceToPlayer = Math.hypot(player.x - this._x, player.y - this._y)

    this._enemyState.isAggressive =
      distanceToPlayer < this._enemyConfig.aggroRange

    if (this._enemyState.isAggressive) {
      this.updatePathToPlayer(obstacles)
      this.moveAlongPath()
    }

    this.draw()
  }

  draw(): void {
    this._gameState.draw((ctx) => {
      ctx.fillStyle = this._color
      ctx.fillRect(
        this._x - this._width / 2,
        this._y - this._height / 2,
        this._width,
        this._height
      )
    })
  }
}
