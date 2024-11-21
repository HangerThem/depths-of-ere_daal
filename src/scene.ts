import {
  BackgroundLayer,
  PlayerLayer,
  NPCLayer,
  UILayer,
  ObstacleLayer,
  EnemyLayer,
  ProjectileLayer,
} from "./layer.js"
import { Target } from "./types/core/camera.js"
import { IScene, LayerMap, SceneBounds } from "./types/scene"
import { IGameState } from "./types/core/gameState.js"
import { GameState } from "./core/gameState.js"

export abstract class Scene implements IScene {
  protected _layers: LayerMap
  protected _bounds: SceneBounds
  protected _gameState: IGameState
  protected _cleanupFunctions: (() => void)[]

  protected constructor({ bounds }: { bounds: SceneBounds }) {
    this._layers = {
      background: new BackgroundLayer(),
      obstacles: new ObstacleLayer(),
      projectiles: new ProjectileLayer(),
      enemies: new EnemyLayer(),
      npcs: new NPCLayer(),
      player: new PlayerLayer(),
      ui: new UILayer(),
    }
    this._bounds = bounds
    this._cleanupFunctions = []
    this._gameState = GameState.getInstance()
  }

  get layers(): LayerMap {
    return this._layers
  }

  get bounds(): SceneBounds {
    return this._bounds
  }

  setBounds(bounds: SceneBounds) {
    this._bounds = bounds
    this._gameState.camera.setBounds(bounds)
  }

  drawWithCamera(target: Target | null, drawFunc: () => void) {
    this._gameState.camera.update(this._gameState.deltaTime)
    this._gameState.draw((ctx) => {
      ctx.save()
      this._gameState.camera.follow(target!!)
      drawFunc()
      ctx.restore()
    })
  }

  enter() {}

  exit() {
    if (this._cleanupFunctions) {
      this._cleanupFunctions.forEach((cleanup) => {
        if (typeof cleanup === "function") cleanup()
      })
      this._cleanupFunctions = []
    }
  }

  addControls() {
    // Add game event listeners and trigger camera effects
    // Example: On collision event, shake the camera
    // this.gameState.on('collision', () => {
    //   this.gameState.camera.shake(500, 10)
    // })
  }

  update() {
    // Example: Trigger camera shake based on a game condition
    // if (this.gameState.player.isHit) {
    //   this.gameState.camera.shake(500, 10)
    // }

    this.draw()
  }

  draw() {
    this._gameState.draw((ctx) => {
      const { width, height } = this._gameState.getCanvasDimensions()
      ctx.clearRect(0, 0, width, height)
      this._gameState.withPlayer((player) => {
        this.drawWithCamera({ x: player.x, y: player.y }, () => {
          this._layers.background.draw()
          this._layers.obstacles.draw()
          this._layers.projectiles.draw()
          this._layers.enemies.draw()
          this._layers.npcs.draw()
          this._layers.player.draw()

          if (!this._layers.ui.isDialogActive()) {
            const obstacles = this._layers.obstacles.objects
            const enemies = this._layers.enemies.objects

            this._layers.background.update()
            this._layers.obstacles.update()
            this._layers.projectiles.update(enemies, obstacles)
            this._layers.enemies.update(obstacles)
            this._layers.npcs.update()
            this._layers.player.update(obstacles)
          }
        })

        this._layers.ui.update()
      })
    })
  }
}
