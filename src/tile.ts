import { TileConstructorParams, Tile as ITile } from "./types/tile"

export class Tile implements ITile {
  x: number
  y: number
  width: number
  height: number
  color: string
  ctx: CanvasRenderingContext2D

  constructor({ x, y, width, height, color, ctx }: TileConstructorParams) {
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
