import {
  BackgroundLayer,
  PlayerLayer,
  NPCLayer,
  UILayer,
  ObstacleLayer,
  EnemyLayer,
} from "./layer.js"
import { Player } from "./gameObjects/player.js"
import { Target } from "./types/camera.js"
import { IScene, SceneBounds } from "./types/scene"
import { GameState } from "./types/game.js"

export class Scene implements IScene {
  protected gameState: GameState
  protected canvas: HTMLCanvasElement
  protected backgroundLayer: BackgroundLayer
  protected playerLayer: PlayerLayer
  protected EnemyLayer: EnemyLayer
  public NPCLayer: NPCLayer
  public uiLayer: UILayer
  protected obstacleLayer: ObstacleLayer
  protected cleanupFunctions: Function[]
  protected data: any

  constructor(gameState: GameState) {
    this.gameState = gameState
    this.canvas = gameState.ctx.canvas
    this.backgroundLayer = new BackgroundLayer(gameState.ctx)
    this.playerLayer = new PlayerLayer(gameState)
    this.EnemyLayer = new EnemyLayer(gameState.ctx)
    this.NPCLayer = new NPCLayer(gameState.ctx)
    this.obstacleLayer = new ObstacleLayer(gameState.ctx)
    this.uiLayer = new UILayer(gameState.ctx)
    this.cleanupFunctions = []
    this.setBounds({
      x: 0,
      y: 0,
      width: this.canvas.width,
      height: this.canvas.height,
    })
  }

  setBounds(bounds: SceneBounds) {
    this.gameState.currentScene.sceneBounds = bounds
    this.gameState.camera.setBounds(bounds)
  }

  drawWithCamera(target: Target | null, drawFunc: () => void) {
    this.gameState.camera.update(this.gameState.time)
    this.gameState.ctx.save()
    this.gameState.camera.follow(target)
    this.gameState.camera.apply(this.gameState.ctx)
    drawFunc()
    this.gameState.ctx.restore()
  }

  enter(data: any) {
    this.data = data
  }

  exit() {
    if (this.cleanupFunctions) {
      this.cleanupFunctions.forEach((cleanup) => {
        if (typeof cleanup === "function") cleanup()
      })
      this.cleanupFunctions = []
    }
    // Example: Reset zoom when exiting the scene
    this.gameState.camera.setZoom(1.0)
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

    // Update camera state
    this.draw()
  }

  draw() {
    this.gameState.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.drawWithCamera(null, () => {
      this.backgroundLayer.draw()
      this.obstacleLayer.draw()
    })

    this.drawWithCamera(this.playerLayer.getTarget(), () => {
      this.playerLayer.draw()
    })

    this.gameState.ctx.save()
    this.uiLayer.draw()
    this.gameState.ctx.restore()
  }
}
