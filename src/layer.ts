import { DialogSystem } from "./dialog.js"
import {
  IEnemyLayer,
  IProjectileLayer,
  IObstacleLayer,
  IPlayerLayer,
  INPCLayer,
} from "./types/layer"
import { BaseGameObject } from "./types/base"
import { IObstacle } from "./types/obstacle"
import { ITile } from "./types/tile"
import { IProjectile } from "./types/weapon"
import { INPC } from "./types/npc"
import { GameState } from "./core/gameState.js"
import { IEnemy } from "./types/gameObjects/enemies/enemy.js"
import { IPlayer } from "./types/gameObjects/player.js"
import { IGameState } from "./types/core/gameState.js"

/**
 * Abstract class for a layer of objects in the game.
 * @template T - The type of object in the layer
 * @property objects - The objects in the layer
 */
export abstract class Layer<T extends BaseGameObject> {
  public objects: Set<T>
  protected _gameState: IGameState

  /**
   * Constructs a new Layer object
   */
  protected constructor() {
    this.objects = new Set()
    this._gameState = GameState.getInstance()
  }

  /**
   * Adds an object to the layer
   * @param object - The object to add
   */
  public addObject(object: T): void {
    this.objects.add(object)
  }

  /**
   * Removes an object from the layer
   * @param object
   */
  public removeObject(object: T): void {
    this.objects.delete(object)
  }

  /**
   * Updates all objects in the layer
   * @param args - Arguments to pass to the update functions
   */
  public update(...args: any[]): void {
    this.objects.forEach((object) => {
      if (object.update) {
        object.update(...args)
      }
    })
  }

  /**
   * Draws all objects in the layer
   */
  public draw(): void {
    this.objects.forEach((object) => object.draw())
  }
}

export class BackgroundLayer extends Layer<ITile> implements BackgroundLayer {
  public objects: Set<ITile>

  constructor() {
    super()
    this.objects = new Set()
  }

  update(): void {
    this.objects.forEach((background) => {
      if (background.update) {
        background.update()
      }
    })
  }
}

export class ObstacleLayer extends Layer<IObstacle> implements IObstacleLayer {
  public objects: Set<IObstacle>

  constructor() {
    super()
    this.objects = new Set()
  }

  checkCollision(entity: BaseGameObject): BaseGameObject | null {
    for (const obstacle of this.objects) {
      if (this.isColliding(entity, obstacle)) {
        return obstacle
      }
    }
    return null
  }

  isColliding(a: BaseGameObject, b: IObstacle): boolean {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    )
  }

  update(): void {
    this.objects.forEach((obstacle) => {
      if (obstacle.update) {
        obstacle.update()
      }
    })
  }
}

export class ProjectileLayer
  extends Layer<IProjectile>
  implements IProjectileLayer
{
  public objects: Set<IProjectile>

  constructor() {
    super()
    this.objects = new Set()
  }

  update(enemies: Set<IEnemy>, obstacles: Set<IObstacle>): void {
    this.objects = new Set(
      [...this.objects].filter((projectile) => projectile.active)
    )
    this.objects.forEach((projectile) => {
      if (projectile.update) {
        projectile.update(enemies, obstacles)
      }
    })
  }
}

export class EnemyLayer extends Layer<IEnemy> implements IEnemyLayer {
  public objects: Set<IEnemy>

  constructor() {
    super()
    this.objects = new Set()
  }

  update(obstacles: Set<IObstacle>): void {
    this.objects = new Set(
      [...this.objects].filter((enemy) => !enemy.enemyState.dead)
    )
    this._gameState.withPlayer((player) => {
      this.objects.forEach((object) => {
        if (object.update) {
          object.update(player, obstacles)
        }
      })
    })
  }
}

export class NPCLayer extends Layer<INPC> implements INPCLayer {
  public objects: Set<INPC>

  constructor() {
    super()
    this.objects = new Set()
  }

  update(): void {
    this._gameState.withPlayer((player) => {
      this.objects.forEach((npc) => {
        if (npc.update) {
          npc.update(player)
        }
      })
    })
  }
}

export class PlayerLayer extends Layer<IPlayer> implements IPlayerLayer {
  constructor() {
    super()
  }

  update(obstacles: Set<IObstacle>): void {
    this._gameState.withPlayer((player) => {
      player.update(obstacles)
    })
  }

  draw(): void {
    this._gameState.withPlayer((player) => {
      player.draw()
    })
  }
}

export class UILayer extends Layer<BaseGameObject> {
  constructor() {
    super()
  }

  draw(): void {
    this._gameState.dialogSystem.draw()
  }

  isDialogActive(): boolean {
    return this._gameState.dialogSystem.state.active
  }
}
