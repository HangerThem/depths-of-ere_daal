import { System } from "../ecs/System.js"
import { ButtonComponent } from "../components/ButtonComponent.js"
import { IEntityManager } from "../types/ecs/IEntityManager.js"
import { IComponentManager } from "../types/ecs/IComponentManager.js"
import { IUpdateContext } from "../types/ecs/IUpdateContext.js"

export class UISystem extends System {
  private mousePos: { x: number; y: number }
  private isMousePressed: boolean
  private wasMousePressed: boolean
  private components: IComponentManager | undefined
  private canvas: HTMLCanvasElement

  constructor(canvas: HTMLCanvasElement) {
    super()
    this.mousePos = { x: 0, y: 0 }
    this.isMousePressed = false
    this.wasMousePressed = false
    this.canvas = canvas

    canvas.addEventListener("mousemove", this.onMouseMove)
    canvas.addEventListener("mousedown", this.onMouseDown)
    canvas.addEventListener("mouseup", this.onMouseUp)
  }

  private onMouseMove = (e: MouseEvent) => {
    this.mousePos.x = e.offsetX
    this.mousePos.y = e.offsetY
  }

  private onMouseDown = () => {
    this.isMousePressed = true
  }

  private onMouseUp = () => {
    this.isMousePressed = false
    this.handleMouseUp()
  }

  private handleMouseUp(): void {
    const buttons = this.components?.getComponents(ButtonComponent)
    if (!buttons) return

    for (const [, button] of buttons) {
      if (button.isHovered) {
        button.action()
        button.isPressed = false
      }
    }
  }

  update(updateContext: IUpdateContext): void {
    const { components } = updateContext

    this.components = updateContext.components

    const justPressed = this.isMousePressed && !this.wasMousePressed
    const buttons = components.getComponents(ButtonComponent)

    if (!buttons) return

    for (const [, button] of buttons) {
      const { x, y, width, height } = button.bounds

      button.isHovered =
        this.mousePos.x >= x &&
        this.mousePos.x <= x + width &&
        this.mousePos.y >= y &&
        this.mousePos.y <= y + height

      let cursor = "default"
      for (const [, button] of buttons) {
        if (button.isHovered) {
          cursor = "pointer"
        }
      }
      document.body.style.cursor = cursor

      if (button.isHovered && justPressed) {
        button.isPressed = true
      }
    }

    this.wasMousePressed = this.isMousePressed
  }

  clear(): void {
    this.components = undefined
    document.body.style.cursor = "default"
    this.canvas.removeEventListener("mousemove", this.onMouseMove)
    this.canvas.removeEventListener("mousedown", this.onMouseDown)
    this.canvas.removeEventListener("mouseup", this.onMouseUp)
  }
}
