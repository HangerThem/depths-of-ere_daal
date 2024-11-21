import { Scene } from "../scene.js"
import { Controls } from "../controls/controls.js"
import { gameObjectFactory } from "../factories/GameObjectFactory.js"
import { SceneBounds } from "../types/scene.js"

export class StartScreen extends Scene {
  constructor() {
    super({
      bounds: {
        x: 0,
        y: 0,
        width: 800,
        height: 600,
      },
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
    })
    this._layers.npcs.addObject(npc)
  }

  generateEnemies() {
    const enemy = gameObjectFactory.createEnemy({
      x: 200,
      y: 200,
      width: 32,
      height: 32,
      color: "#f00",
      hp: 100,
    })
    this._layers.ui.addObject(enemy)
  }

  generateLevel() {
    const tileSize = 50
    const bgColors = ["#313131", "#333333", "#353535", "#373737"]
    const { x: px, y: py, width, height } = this._bounds

    for (let x = px; x < width; x += tileSize) {
      for (let y = py; y < height; y += tileSize) {
        const bgColor = bgColors[Math.floor(Math.random() * bgColors.length)]
        this._layers.background.addObject(
          gameObjectFactory.createTile({
            x,
            y,
            width: tileSize,
            height: tileSize,
            color: bgColor,
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
          this._layers.obstacles.addObject(
            gameObjectFactory.createObstacle({
              x,
              y,
              width: tileSize,
              height: tileSize,
              color: bgColor,
            })
          )
        }
      }
    }
  }

  addControls(): void {
    const { player } = this._gameState
    this._cleanupFunctions = [
      Controls.addMovementControls(player!!),
      Controls.addDialogControls(this._gameState.dialogSystem),
      Controls.addInteractionControls(this),
    ]
  }

  update() {
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
