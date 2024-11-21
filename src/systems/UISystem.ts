import { System } from "../ecs/System.js"
import { ButtonComponent } from "../components/ButtonComponent.js"
import { IEntityManager } from "../types/ecs/IEntityManager.js"
import { IComponentManager } from "../types/ecs/IComponentManager.js"

export class UISystem extends System {
  private mousePos: { x: number; y: number }
  private isMousePressed: boolean
  private wasMousePressed: boolean
  private components: IComponentManager | undefined

  constructor(canvas: HTMLCanvasElement) {
    super()
    this.mousePos = { x: 0, y: 0 }
    this.isMousePressed = false
    this.wasMousePressed = false

    canvas.addEventListener("mousemove", (e) => {
      this.mousePos.x = e.offsetX
      this.mousePos.y = e.offsetY
    })

    canvas.addEventListener("mousedown", () => {
      this.isMousePressed = true
    })

    canvas.addEventListener("mouseup", () => {
      this.isMousePressed = false
      this.handleMouseUp()
    })
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

  update(
    deltaTime: number,
    entities: IEntityManager,
    components: IComponentManager
  ): void {
    if (!this.components) {
      this.components = components
    }

    const justPressed = this.isMousePressed && !this.wasMousePressed
    const buttons = components.getComponents(ButtonComponent)

    if (!buttons) return

    for (const [entityId, button] of buttons) {
      const { x, y, width, height } = button.bounds

      button.isHovered =
        this.mousePos.x >= x &&
        this.mousePos.x <= x + width &&
        this.mousePos.y >= y &&
        this.mousePos.y <= y + height

      if (button.isHovered) {
        document.body.style.cursor = "pointer"
      } else {
        button.isPressed = false
        document.body.style.cursor = "default"
      }

      if (button.isHovered && justPressed) {
        button.isPressed = true
      }
    }

    this.wasMousePressed = this.isMousePressed
  }
}
