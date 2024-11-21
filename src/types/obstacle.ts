import { BaseGameObject } from "./base"

export interface ObstacleConstructorParams {
  x: number
  y: number
  width: number
  height: number
  color: string
}

export interface IObstacle extends BaseGameObject {}
