import { GameState } from "./core/gameState.js"
import { IGameState } from "./types/core/gameState.js"
import { ObstacleConstructorParams, IObstacle } from "./types/obstacle"

export class Obstacle implements IObstacle {
  private _x: number
  private _y: number
  private _width: number
  private _height: number
  private _color: string
  private _gameState: IGameState

  constructor({ x, y, width, height, color }: ObstacleConstructorParams) {
    this._x = x
    this._y = y
    this._width = width
    this._height = height
    this._color = color
    this._gameState = GameState.getInstance()
  }

  get x() {
    return this._x
  }

  get y() {
    return this._y
  }

  get width() {
    return this._width
  }

  get height() {
    return this._height
  }

  get color() {
    return this._color
  }

  draw(): void {
    this._gameState.draw((ctx) => {
      ctx.fillStyle = this._color
      ctx.fillRect(this._x, this._y, this._width, this._height)
    })
  }

  update(): void {
    this.draw()
  }
}
