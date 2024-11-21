import { BaseGameObject } from "../base"
import { IGameState } from "../core/gameState"
import { IObstacle } from "../obstacle"

export interface PlayerConstructorParams {
  x: number
  y: number
  width: number
  height: number
  color: string
  gameState: IGameState
}

export interface IPlayer extends BaseGameObject {
  moveLeft: () => void
  moveRight: () => void
  moveUp: () => void
  moveDown: () => void
  stopVertical: () => void
  stopHorizontal: () => void
  rotateToCursor: (x: number, y: number) => void
  update: (obstacles: Set<IObstacle>) => void
}
