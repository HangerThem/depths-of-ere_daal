import { GameState } from "./core/gameState.js"
import { IGameState } from "./types/core/gameState.js"
import { IPlayer } from "./types/gameObjects/player"
import { NPCConstructorParams, INPC } from "./types/npc"

export class NPC implements INPC {
  private _x: number
  private _y: number
  private _width: number
  private _height: number
  private _color: string
  private _name: string
  private _dialog: any[]
  private _gameState: IGameState
  private _interactionRange: number
  private _isInteracting: boolean
  private _currentDialogIndex: number
  private _playerInRange: boolean

  constructor({
    x,
    y,
    width,
    height,
    color,
    name,
    dialog,
  }: NPCConstructorParams) {
    this._x = x
    this._y = y
    this._width = width
    this._height = height
    this._color = color
    this._name = name
    this._dialog = dialog
    this._gameState = GameState.getInstance()
    this._interactionRange = 100
    this._isInteracting = false
    this._currentDialogIndex = 0
    this._playerInRange = false
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

  get name() {
    return this._name
  }

  get playerInRange() {
    return this._playerInRange
  }

  get dialog() {
    return this._dialog
  }

  draw() {
    this._gameState.draw((ctx) => {
      ctx.fillStyle = this._color
      ctx.fillRect(this._x, this._y, this._width, this._height)

      ctx.textAlign = "center"
      ctx.textBaseline = "bottom"
      ctx.font = "16px Arial"

      ctx.fillStyle = "white"
      ctx.fillText(this._name, this._x + this._width / 2, this._y - 10)

      if (this._playerInRange && !this._isInteracting) {
        ctx.fillStyle = "yellow"
        ctx.fillText("[E] Talk", this._x + this._width / 2, this._y - 30)
      }
    })
  }

  checkPlayerInRange(player: IPlayer) {
    const dx = player.x + player.width / 2 - (this._x + this._width / 2)
    const dy = player.y + player.height / 2 - (this._y + this._height / 2)
    const distance = Math.sqrt(dx * dx + dy * dy)
    this._playerInRange = distance <= this._interactionRange
    return this._playerInRange
  }

  interact() {
    if (!this._isInteracting) {
      this._isInteracting = true
      this._currentDialogIndex = 0
      return this.getCurrentDialog()
    }
    return null
  }

  getCurrentDialog() {
    return this._dialog[this._currentDialogIndex]
  }

  processChoice(choiceIndex: number) {
    const currentDialog = this.getCurrentDialog()
    if (currentDialog.choices && currentDialog.choices[choiceIndex]) {
      const choice = currentDialog.choices[choiceIndex]

      if (choice.action) {
        choice.action()
      }

      if (choice.next !== undefined) {
        this._currentDialogIndex = choice.next
        return this.getCurrentDialog()
      }
    }

    this._currentDialogIndex++

    if (this._currentDialogIndex >= this._dialog.length) {
      this.endDialog()
      return null
    }

    return this.getCurrentDialog()
  }

  endDialog() {
    this._isInteracting = false
    this._currentDialogIndex = 0
  }

  update(player: IPlayer) {
    this.checkPlayerInRange(player)
    this.draw()
  }
}
