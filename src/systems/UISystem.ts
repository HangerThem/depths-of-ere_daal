import { System } from "../ecs/System.js"
import { ButtonComponent } from "../components/ButtonComponent.js"
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

    this.canvas.addEventListener("mousemove", this.onMouseMove)
    this.canvas.addEventListener("mousedown", this.onMouseDown)
    this.canvas.addEventListener("mouseup", this.onMouseUp)
    this.canvas.addEventListener("touchmove", this.onTouchMove)
    this.canvas.addEventListener("touchstart", this.onTouchStart)
    this.canvas.addEventListener("touchend", this.onTouchEnd)
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
    this.handleMouseUp(this.components as IComponentManager)
  }

  private onTouchMove = (e: TouchEvent) => {
    const touch = e.touches[0]
    const rect = this.canvas.getBoundingClientRect()
    this.mousePos.x = touch.clientX - rect.left
    this.mousePos.y = touch.clientY - rect.top
  }

  private onTouchStart = () => {
    this.isMousePressed = true
  }

  private onTouchEnd = () => {
    this.isMousePressed = false
    if (this.components) {
      this.handleMouseUp(this.components)
    }
  }

  private handleMouseUp(components: IComponentManager): void {
    const buttons = components.getComponents(ButtonComponent)
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

    let anyButtonHovered = false

    for (const [, button] of buttons) {
      const { x, y, width, height } = button.bounds

      button.isHovered =
        this.mousePos.x >= x &&
        this.mousePos.x <= x + width &&
        this.mousePos.y >= y &&
        this.mousePos.y <= y + height

      if (button.isHovered) {
        anyButtonHovered = true
        if (justPressed) {
          button.isPressed = true
        }
      }
    }

    document.body.style.cursor = anyButtonHovered ? "pointer" : "default"
    this.wasMousePressed = this.isMousePressed
  }

  clear(): void {
    this.components = undefined
    document.body.style.cursor = "default"
    this.canvas.removeEventListener("mousemove", this.onMouseMove)
    this.canvas.removeEventListener("mousedown", this.onMouseDown)
    this.canvas.removeEventListener("mouseup", this.onMouseUp)
    this.canvas.removeEventListener("touchmove", this.onTouchMove)
    this.canvas.removeEventListener("touchstart", this.onTouchStart)
    this.canvas.removeEventListener("touchend", this.onTouchEnd)
  }
}
