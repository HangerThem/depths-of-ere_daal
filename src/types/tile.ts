import { BaseGameObject } from "./base"

export interface TileConstructorParams {
  x: number
  y: number
  width: number
  height: number
  color: string
  ctx: CanvasRenderingContext2D
}

export interface Tile extends BaseGameObject {}
