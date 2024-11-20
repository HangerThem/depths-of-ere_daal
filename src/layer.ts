import { DialogSystem } from "./dialog.js"
import {
  IEnemyLayer,
  IProjectileLayer,
  IObstacleLayer,
  IPlayerLayer,
  INPCLayer,
} from "./types/layer"
import { BaseGameObject } from "./types/base"
import { EnemyObject } from "./types/enemy"
import { ObstacleObject } from "./types/obstacle"
import { PlayerObject } from "./types/player"
import { Tile } from "./types/tile"
import { GameState } from "./types/game.js"
import { IProjectile } from "./types/weapon"
import { NPCObject } from "./types/npc.js"

export class Layer<T extends BaseGameObject> {
  protected ctx: CanvasRenderingContext2D
  public objects: T[]

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx
    this.objects = []
  }

  addObject(object: T): void {
    this.objects.push(object)
  }

  removeObject(object: T): void {
    const index = this.objects.indexOf(object)
    if (index > -1) {
      this.objects.splice(index, 1)
    }
  }

  update(...args: any[]): void {
    this.objects.forEach((object) => {
      if (object.update) {
        object.update({ ...args })
      }
    })
  }

  draw(): void {
    this.objects.forEach((object) => object.draw())
  }
}

export class ProjectileLayer extends Layer<IProjectile> implements IProjectileLayer {
  public objects: IProjectile[]

  constructor(ctx: CanvasRenderingContext2D) {
    super(ctx)
    this.objects = []
  }

  update(enemies: EnemyObject[], obstacles: ObstacleObject[]): void {
    this.objects = this.objects.filter(
      (projectile) => projectile.distanceToLive > 0
    )
    this.objects.forEach((projectile) => {
      if (projectile.update) {
        projectile.update(enemies, obstacles)
      }
    })
  }
}

export class EnemyLayer extends Layer<EnemyObject> implements IEnemyLayer {
  public objects: EnemyObject[]

  constructor(ctx: CanvasRenderingContext2D) {
    super(ctx)
    this.objects = []
  }

  update(player: PlayerObject, obstacles: ObstacleObject[]): void {
    this.objects = this.objects.filter((obj) => obj.enemyState.health > 0)
    this.objects.forEach((object) => {
      if (object.update) {
        object.update(player, obstacles)
      }
    })
  }
}

export class PlayerLayer extends Layer<PlayerObject> implements IPlayerLayer {
  private gameState: GameState

  constructor(gameState: GameState) {
    super(gameState.ctx)
    this.gameState = gameState
  }

  getTarget(): PlayerObject | null {
    return this.gameState.player
  }

  update(obstacles: ObstacleObject[]): void {
    if (this.gameState.player?.update) {
      this.gameState.player.update(obstacles)
    }
  }

  draw(): void {
    if (this.gameState.player) {
      this.gameState.player.draw()
    }
  }
}

export class NPCLayer extends Layer<NPCObject> implements INPCLayer {
  public objects: NPCObject[]

  constructor(ctx: CanvasRenderingContext2D) {
    super(ctx)
    this.objects = []
  }

  update(player: PlayerObject): void {
    this.objects.forEach((npc) => {
      if (npc.update) {
        npc.update(player)
      }
    })
  }
}

export class BackgroundLayer extends Layer<Tile> implements BackgroundLayer {
  public objects: Tile[]

  constructor(ctx: CanvasRenderingContext2D) {
    super(ctx)
    this.objects = []
  }

  update(): void {
    this.objects.forEach((background) => {
      if (background.update) {
        background.update()
      }
    })
  }
}

export class ObstacleLayer extends Layer<ObstacleObject> implements IObstacleLayer {
  public objects: ObstacleObject[]

  constructor(ctx: CanvasRenderingContext2D) {
    super(ctx)
    this.objects = []
  }

  checkCollision(entity: BaseGameObject): BaseGameObject | null {
    for (const obstacle of this.objects) {
      if (this.isColliding(entity, obstacle)) {
        return obstacle
      }
    }
    return null
  }

  isColliding(a: BaseGameObject, b: ObstacleObject): boolean {
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

export class UILayer  {
  public dialogSystem: DialogSystem

  constructor(ctx: CanvasRenderingContext2D) {
    this.dialogSystem = new DialogSystem({ ctx, canvas: ctx.canvas })
  }

  update(): void {
    this.dialogSystem.draw()
  }

  isDialogActive(): boolean {
    return this.dialogSystem.state.active
  }
}
