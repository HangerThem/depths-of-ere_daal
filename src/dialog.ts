import {
  DialogSystemConstructorParams,
  DialogState,
} from "./types/dialogSystem"
import { DialogOptions, IDialogSystem } from "./types/dialog.js"

export class DialogSystem {
  private ctx: CanvasRenderingContext2D
  private canvas: HTMLCanvasElement
  public state: DialogState

  constructor({ ctx, canvas }: DialogSystemConstructorParams) {
    this.ctx = ctx
    this.canvas = canvas
    this.state = {
      active: false,
      currentDialog: null,
      callback: null,
      choices: null,
      selectedChoice: 0,
      onClose: null,
    }
  }

  show({
    text,
    choices = null,
    callback = null,
    onClose = null,
  }: DialogOptions): void {
    this.state = {
      active: true,
      currentDialog: text,
      choices,
      selectedChoice: 0,
      callback,
      onClose,
    }
  }

  hide(): void {
    if (this.state.onClose) {
      this.state.onClose()
    }

    if (this.state.active) {
      const padding = 20
      const boxHeight = this.state.choices ? 200 : 100
      const boxWidth = this.canvas.width * 0.8
      const x = (this.canvas.width - boxWidth) / 2
      const y = this.canvas.height - boxHeight - padding

      this.ctx.clearRect(x - 2, y - 2, boxWidth + 4, boxHeight + 4)
    }

    this.state = {
      active: false,
      currentDialog: null,
      choices: null,
      callback: null,
      onClose: null,
      selectedChoice: 0,
    }
  }

  selectNextChoice(): void {
    if (this.state.choices) {
      this.state.selectedChoice =
        (this.state.selectedChoice + 1) % this.state.choices.length
    }
  }

  selectPreviousChoice(): void {
    if (this.state.choices) {
      this.state.selectedChoice =
        (this.state.selectedChoice - 1 + this.state.choices.length) %
        this.state.choices.length
    }
  }

  confirmChoice(): void {
    if (!this.state.active) return

    if (this.state.choices && this.state.choices.length > 0) {
      if (this.state.callback) {
        this.state.callback(this.state.selectedChoice)
      }
    } else {
      this.hide()
    }
  }

  draw(): void {
    if (!this.state.active || !this.state.currentDialog) return

    const padding = 20
    const boxHeight = this.state.choices ? 200 : 100
    const boxWidth = this.canvas.width * 0.8
    const x = (this.canvas.width - boxWidth) / 2
    const y = this.canvas.height - boxHeight - padding

    this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
    this.ctx.fillRect(x, y, boxWidth, boxHeight)
    this.ctx.strokeStyle = "white"
    this.ctx.strokeRect(x, y, boxWidth, boxHeight)

    this.ctx.fillStyle = "white"
    this.ctx.font = "18px Arial"
    this.wrapText(
      this.state.currentDialog,
      x + padding,
      y + padding * 1.5,
      boxWidth - padding * 2
    )

    if (this.state.choices) {
      const choiceY = y + boxHeight - padding - this.state.choices.length * 25
      this.state.choices.forEach((choice, index) => {
        this.ctx.fillStyle =
          index === this.state.selectedChoice ? "#ffff00" : "white"
        this.ctx.fillText(
          `${index === this.state.selectedChoice ? "> " : "  "}${choice}`,
          x + padding,
          choiceY + index * 25
        )
      })
    }
  }

  private wrapText(text: string, x: number, y: number, maxWidth: number): void {
    const words = text.split(" ")
    let line = ""
    let lineHeight = 25
    let currentY = y
    let lines = []

    for (let word of words) {
      const testLine = line + word + " "
      const metrics = this.ctx.measureText(testLine)
      const testWidth = metrics.width

      if (testWidth > maxWidth && line.length > 0) {
        lines.push(line)
        line = word + " "
      } else {
        line = testLine
      }
    }
    if (line.length > 0) {
      lines.push(line)
    }

    lines.forEach((line) => {
      this.ctx.fillText(line, x, currentY)
      currentY += lineHeight
    })
  }
}
