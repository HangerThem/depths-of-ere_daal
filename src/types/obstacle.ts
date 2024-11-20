import { BaseGameObject } from "./base"

export interface ObstacleConstructorParams {
  x: number
  y: number
  width: number
  height: number
  color: string
  ctx: CanvasRenderingContext2D
}

export interface ObstacleObject extends BaseGameObject {}
