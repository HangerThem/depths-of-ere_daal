import { GameState } from "./types/core/gameState"
import { NPCObject, NPCConstructorParams } from "./types/npc"
import { PlayerObject } from "./types/player"

export class NPC implements NPCObject {
  x: number
  y: number
  width: number
  height: number
  color: string
  name: string
  dialog: any[]
  gameState: GameState
  interactionRange: number
  isInteracting: boolean
  currentDialogIndex: number
  playerInRange: boolean

  constructor({
    x,
    y,
    width,
    height,
    color,
    name,
    dialog,
    gameState,
  }: NPCConstructorParams) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.color = color
    this.name = name
    this.dialog = dialog
    this.gameState = gameState
    this.interactionRange = 100
    this.isInteracting = false
    this.currentDialogIndex = 0
    this.playerInRange = false
  }

  draw() {
    this.gameState.ctx.fillStyle = this.color
    this.gameState.ctx.fillRect(this.x, this.y, this.width, this.height)

    this.gameState.ctx.textAlign = "center"
    this.gameState.ctx.textBaseline = "bottom"
    this.gameState.ctx.font = "16px Arial"

    this.gameState.ctx.fillStyle = "white"
    this.gameState.ctx.fillText(this.name, this.x + this.width / 2, this.y - 10)

    if (this.playerInRange && !this.isInteracting) {
      this.gameState.ctx.fillStyle = "yellow"
      this.gameState.ctx.fillText(
        "[E] Talk",
        this.x + this.width / 2,
        this.y - 30
      )
    }
  }

  checkPlayerInRange(player: PlayerObject) {
    const dx = player.x + player.width / 2 - (this.x + this.width / 2)
    const dy = player.y + player.height / 2 - (this.y + this.height / 2)
    const distance = Math.sqrt(dx * dx + dy * dy)
    this.playerInRange = distance <= this.interactionRange
    return this.playerInRange
  }

  interact() {
    if (!this.isInteracting) {
      this.isInteracting = true
      this.currentDialogIndex = 0
      return this.getCurrentDialog()
    }
    return null
  }

  getCurrentDialog() {
    return this.dialog[this.currentDialogIndex]
  }

  processChoice(choiceIndex: number) {
    const currentDialog = this.getCurrentDialog()
    if (currentDialog.choices && currentDialog.choices[choiceIndex]) {
      const choice = currentDialog.choices[choiceIndex]

      if (choice.action) {
        choice.action()
      }

      if (choice.next !== undefined) {
        this.currentDialogIndex = choice.next
        return this.getCurrentDialog()
      }
    }

    this.currentDialogIndex++

    if (this.currentDialogIndex >= this.dialog.length) {
      this.endDialog()
      return null
    }

    return this.getCurrentDialog()
  }

  endDialog() {
    this.isInteracting = false
    this.currentDialogIndex = 0
  }

  update(player: PlayerObject) {
    this.checkPlayerInRange(player)
    this.draw()
  }
}
