import { Scene } from "../scene.js"
import { Controls } from "../controls.js"
import { GameState } from "../types/game.js"
import { gameObjectFactory } from "../factories/GameObjectFactory.js"

export class StartScreen extends Scene {
  constructor(gameState: GameState) {
    super(gameState)
    this.setBounds({
      x: -1000,
      y: -1000,
      width: 1000,
      height: 1000,
    })
    this.generateLevel()
    this.addControls()
    this.addNPCs()
    this.generateEnemies()
  }

  addNPCs() {
    const npc = gameObjectFactory.createNPC({
      x: 100,
      y: 100,
      width: 32,
      height: 32,
      color: "#0ff",
      name: "NPC",
      dialog: [
        {
          text: "Hello, I am an NPC!",
          choices: [{ text: "Goodbye", next: -1 }],
        },
      ],
      gameState: this.gameState,
    })
    this.NPCLayer.addObject(npc)
  }

  generateEnemies() {
    const enemy = gameObjectFactory.createEnemy({
      x: 200,
      y: 200,
      width: 32,
      height: 32,
      color: "#f00",
      hp: 100,
      gameState: this.gameState,
    })
    this.EnemyLayer.addObject(enemy)
  }

  generateLevel() {
    const tileSize = 50
    const bgColors = ["#313131", "#333333", "#353535", "#373737"]
    const {
      x: px,
      y: py,
      width,
      height,
    } = this.gameState.currentScene.sceneBounds

    for (let x = px; x < width; x += tileSize) {
      for (let y = py; y < height; y += tileSize) {
        const bgColor = bgColors[Math.floor(Math.random() * bgColors.length)]
        this.backgroundLayer.addObject(
          gameObjectFactory.createTile({
            x,
            y,
            width: tileSize,
            height: tileSize,
            color: bgColor,
            ctx: this.gameState.ctx,
          })
        )
      }
    }

    const obstacleColors = ["#fff"]
    for (let x = px; x < width; x += tileSize) {
      for (let y = py; y < height; y += tileSize) {
        const bgColor =
          obstacleColors[Math.floor(Math.random() * obstacleColors.length)]
        if (Math.random() > 0.9) {
          this.obstacleLayer.addObject(
            gameObjectFactory.createObstacle({
              x,
              y,
              width: tileSize,
              height: tileSize,
              color: bgColor,
              ctx: this.gameState.ctx,
            })
          )
        }
      }
    }
  }

  addControls(): void {
    const { player } = this.gameState
    this.cleanupFunctions = [
      Controls.addMovementControls(player!!),
      Controls.addDialogControls(this.gameState.dialog),
      Controls.addInteractionControls(this),
    ]
  }

  update() {
    this.draw()
  }

  draw() {
    this.gameState.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    const player = this.gameState.player!!

    this.drawWithCamera({ x: player.x, y: player.y }, () => {
      this.backgroundLayer.draw()
      this.obstacleLayer.draw()
      this.EnemyLayer.draw()
      this.NPCLayer.draw()
      this.playerLayer.draw()

      if (!this.uiLayer.isDialogActive()) {
        this.backgroundLayer.update()
        this.obstacleLayer.update()
        this.EnemyLayer.update(player, this.obstacleLayer.objects)
        this.NPCLayer.update(this.gameState.player!!)
        this.playerLayer.update(this.obstacleLayer.objects)
      }
    })

    this.uiLayer.update()
  }
}
