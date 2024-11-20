import { ObstacleObject, ObstacleConstructorParams } from "./types/obstacle"

export class Obstacle implements ObstacleObject {
  public x: number
  public y: number
  public width: number
  public height: number
  public color: string
  public ctx: CanvasRenderingContext2D

  constructor({ x, y, width, height, color, ctx }: ObstacleConstructorParams) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.color = color
    this.ctx = ctx
  }

  draw(): void {
    this.ctx.fillStyle = this.color
    this.ctx.fillRect(this.x, this.y, this.width, this.height)
  }

  update(): void {
    this.draw()
  }
}
