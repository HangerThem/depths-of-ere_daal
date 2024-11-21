import { GameState } from "../core/gameState.js"
import { BaseGameObject, Bounds } from "../types/base"
import { IGameState } from "../types/core/gameState.js"
import { IPlayer, PlayerConstructorParams } from "../types/gameObjects/player"
import { IObstacle } from "../types/obstacle"

export class Player implements IPlayer {
  private _x: number
  private _y: number
  private _vx: number
  private _vy: number
  private _rotation: number
  private _width: number
  private _height: number
  private _color: string
  private _speed: number
  private _gameState: IGameState

  constructor({
    x,
    y,
    width,
    height,
    color,
    gameState,
  }: PlayerConstructorParams) {
    this._x = x
    this._y = y
    this._vx = 0
    this._vy = 0
    this._rotation = 0
    this._width = width
    this._height = height
    this._color = color
    this._gameState = gameState
    this._speed = 2
  }

  get x(): number {
    return this._x
  }

  get y(): number {
    return this._y
  }

  get width(): number {
    return this._width
  }

  get height(): number {
    return this._height
  }

  get color(): string {
    return this._color
  }

  private isColliding(a: Bounds, b: Bounds): boolean {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    )
  }

  public draw(): void {
    this._gameState.draw((ctx) => {
      ctx.fillStyle = this._color
      ctx.save()

      ctx.translate(this._x + this._width / 2, this._y + this._height / 2)
      ctx.rotate((this._rotation * Math.PI) / 180)
      ctx.translate(-(this._x + this._width / 2), -(this._y + this._height / 2))

      ctx.fillRect(this._x, this._y, this._width, this._height)

      ctx.restore()
    })
  }

  public moveUp(): void {
    this._vy = -this._speed
  }

  public moveDown(): void {
    this._vy = this._speed
  }

  public moveLeft(): void {
    this._vx = -this._speed
  }

  public moveRight(): void {
    this._vx = this._speed
  }

  public stopVertical(): void {
    this._vy = 0
  }

  public stopHorizontal(): void {
    this._vx = 0
  }

  public updatePosition(obstacles: Set<IObstacle>): void {
    const nextX = this._x + this._vx
    const nextY = this._y + this._vy

    let canMoveX = true
    let canMoveY = true

    if (
      nextX < this._gameState.sceneManager.currentScene?.bounds.x!! ||
      nextX + this._width >
        this._gameState.sceneManager.currentScene?.bounds.width!!
    ) {
      canMoveX = false
    }
    if (
      nextY < this._gameState.sceneManager.currentScene?.bounds.y!! ||
      nextY + this._height >
        this._gameState.sceneManager.currentScene?.bounds.height!!
    ) {
      canMoveY = false
    }

    for (const obstacle of obstacles) {
      const checkX = {
        x: nextX,
        y: this._y,
        width: this._width,
        height: this._height,
      }

      const checkY = {
        x: this._x,
        y: nextY,
        width: this._width,
        height: this._height,
      }

      if (this.isColliding(checkX, obstacle)) canMoveX = false
      if (this.isColliding(checkY, obstacle)) canMoveY = false
    }

    if (canMoveX) {
      this._x = nextX
    }
    if (canMoveY) {
      this._y = nextY
    }
  }

  public rotateToCursor(mouseX: number, mouseY: number): void {
    const camera = this._gameState.camera
    if (!camera) return

    const centerX = this._x + this._width / 2
    const centerY = this._y + this._height / 2
    const screenPos = camera.getScreenPosition(centerX, centerY)

    const dx = mouseX - screenPos.x
    const dy = mouseY - screenPos.y
    this._rotation = (Math.atan2(dy, dx) * 180) / Math.PI
  }

  public update(obstacles: Set<IObstacle>): void {
    this.updatePosition(obstacles)
    this.draw()
  }
}
