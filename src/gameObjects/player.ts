import { BaseGameObject } from "../types/base"
import { ObstacleObject } from "../types/obstacle"
import { GameState } from "../types/game"
import { IPlayer, PlayerConstructorParams } from "../types/gameObjects/player"

export class Player implements IPlayer {
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  width: number
  height: number
  color: string
  speed: number
  gameState: GameState

  constructor({
    x,
    y,
    width,
    height,
    color,
    gameState,
  }: PlayerConstructorParams) {
    this.x = x
    this.y = y
    this.vx = 0
    this.vy = 0
    this.rotation = 0
    this.width = width
    this.height = height
    this.color = color
    this.gameState = gameState
    this.speed = 2
  }

  private isColliding(a: BaseGameObject, b: BaseGameObject): boolean {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    )
  }

  public draw(): void {
    this.gameState.ctx.fillStyle = this.color
    this.gameState.ctx.save()

    this.gameState.ctx.translate(
      this.x + this.width / 2,
      this.y + this.height / 2
    )
    this.gameState.ctx.rotate((this.rotation * Math.PI) / 180)
    this.gameState.ctx.translate(
      -(this.x + this.width / 2),
      -(this.y + this.height / 2)
    )

    this.gameState.ctx.fillRect(this.x, this.y, this.width, this.height)

    this.gameState.ctx.restore()
  }

  public moveUp(): void {
    this.vy = -this.speed
  }

  public moveDown(): void {
    this.vy = this.speed
  }

  public moveLeft(): void {
    this.vx = -this.speed
  }

  public moveRight(): void {
    this.vx = this.speed
  }

  public stopVertical(): void {
    this.vy = 0
  }

  public stopHorizontal(): void {
    this.vx = 0
  }

  public updatePosition(obstacles: ObstacleObject[] = []): void {
    const nextX = this.x + this.vx
    const nextY = this.y + this.vy

    const nextPos = {
      x: nextX,
      y: nextY,
      width: this.width,
      height: this.height,
    }

    let canMoveX = true
    let canMoveY = true

    if (
      nextX < this.gameState.currentScene.sceneBounds.x ||
      nextX + this.width > this.gameState.currentScene.sceneBounds.width
    ) {
      canMoveX = false
    }
    if (
      nextY < this.gameState.currentScene.sceneBounds.y ||
      nextY + this.height > this.gameState.currentScene.sceneBounds.height
    ) {
      canMoveY = false
    }

    for (const obstacle of obstacles) {
      const checkX: BaseGameObject = {
        ...nextPos,
        y: this.y,
        color: this.color,
        draw: () => {},
      }
      const checkY: BaseGameObject = {
        ...nextPos,
        x: this.x,
        color: this.color,
        draw: () => {},
      }

      if (this.isColliding(checkX, obstacle)) canMoveX = false
      if (this.isColliding(checkY, obstacle)) canMoveY = false
    }

    if (canMoveX) {
      this.x = nextX
    }
    if (canMoveY) {
      this.y = nextY
    }
  }

  public rotateToCursor(mouseX: number, mouseY: number): void {
    const camera = this.gameState.camera
    if (!camera) return

    const centerX = this.x + this.width / 2
    const centerY = this.y + this.height / 2
    const screenPos = camera.getScreenPosition(centerX, centerY)

    const dx = mouseX - screenPos.x
    const dy = mouseY - screenPos.y
    this.rotation = (Math.atan2(dy, dx) * 180) / Math.PI
  }

  public update(obstacles: ObstacleObject[]): void {
    this.updatePosition(obstacles)
    this.draw()
  }
}
