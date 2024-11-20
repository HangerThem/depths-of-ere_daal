import { Camera } from "./core/camera.js"
import { DialogSystem } from "./dialog.js"
import { gameObjectFactory } from "./factories/GameObjectFactory.js"
import { SceneManager } from "./sceneManager.js"
import { StartScreen } from "./scenes/startScreen.js"
import { IGameState } from "./types/core/gameState.js"

class Game {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private gameState: IGameState
  public sceneManager: SceneManager

  private animationFrameId: number | null = null

  constructor() {
    const canvasElement = document.getElementById("gameCanvas")
    if (!(canvasElement instanceof HTMLCanvasElement)) {
      throw new Error("Canvas element with ID 'gameCanvas' not found.")
    }
    this.canvas = canvasElement
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D

    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight

    this.sceneManager = SceneManager.getInstance(this.ctx, this.canvas)

    this.gameState = {
      camera: Camera.getInstance(this.canvas),
      dialog: new DialogSystem({ ctx: this.ctx, canvas: this.canvas }),
      ctx: this.ctx,
      time: 0,
      deltaTime: 0,
      player: null,
      currentScene: {
        sceneBounds: {
          x: 0,
          y: 0,
          width: this.canvas.width,
          height: this.canvas.height,
        },
      },
    }
    this.gameState.player = gameObjectFactory.createPlayer({
      x: 100,
      y: 100,
      width: 32,
      height: 32,
      color: "#ff0",
      gameState: this.gameState,
    })
  }

  loadScenes() {
    this.sceneManager.addScene("start", new StartScreen(this.gameState))
  }

  update() {
    const now = performance.now()
    this.gameState.deltaTime = now - this.gameState.time
    this.gameState.time = now
    this.sceneManager.update()
    this.animationFrameId = window.requestAnimationFrame(() => this.update())
  }

  stop() {
    if (this.animationFrameId !== null) {
      window.cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
  }

  start() {
    this.loadScenes()
    this.sceneManager.switchToScene("start")
    this.update()
  }
}

const game = new Game()
game.start()
