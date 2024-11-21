import { BaseGameObject } from "./base"

export interface TileConstructorParams {
  x: number
  y: number
  width: number
  height: number
  color: string
}

export interface ITile extends BaseGameObject {}
