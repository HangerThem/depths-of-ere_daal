import { BaseGameObject } from "./base"
import { GameState } from "./game"

export interface PlayerConstructorParams {
  x: number
  y: number
  width: number
  height: number
  color: string
  gameState: GameState
}

export interface PlayerObject extends BaseGameObject {
  speed: number
  gameState: GameState

  moveLeft: () => void
  moveRight: () => void
  moveUp: () => void
  moveDown: () => void
  stopVertical: () => void
  stopHorizontal: () => void
  rotateToCursor: (x: number, y: number) => void
}
