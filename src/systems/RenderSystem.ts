import { System } from "../ecs/System.js"
import { TransformComponent } from "../components/TransformComponent.js"
import { RenderableComponent } from "../components/RenderableComponent.js"
import { IEntityManager } from "../types/ecs/IEntityManager.js"
import { IComponentManager } from "../types/ecs/IComponentManager.js"
import { ButtonComponent } from "../components/ButtonComponent.js"

export class RenderSystem extends System {
  private ctx: CanvasRenderingContext2D

  constructor(ctx: CanvasRenderingContext2D) {
    super()
    this.ctx = ctx
  }

  update(
    deltaTime: number,
    entities: IEntityManager,
    components: IComponentManager
  ): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)

    const renderables = components.getComponents(RenderableComponent)
    const buttons = components.getComponents(ButtonComponent)

    if (renderables) {
      for (const [entityId, renderable] of renderables) {
        const entity = [...entities.getEntities()].find(
          (e) => e.id === entityId
        )
        if (!entity) continue

        const transform = components.getComponent(entity, TransformComponent)
        if (!transform) continue

        this.ctx.save()
        this.ctx.translate(transform.x, transform.y)
        this.ctx.rotate(transform.rotation)
        this.ctx.scale(transform.scaleX, transform.scaleY)
        this.ctx.fillStyle = renderable.color

        switch (renderable.shape) {
          case "rectangle":
            this.ctx.fillRect(-25, -25, 50, 50)
            break
          case "circle":
            this.ctx.beginPath()
            this.ctx.arc(0, 0, 25, 0, Math.PI * 2)
            this.ctx.fill()
            break
          default:
            break
        }

        this.ctx.restore()
      }
    }

    if (buttons) {
      for (const [entityId, button] of buttons) {
        const entity = [...entities.getEntities()].find(
          (e) => e.id === entityId
        )
        if (!entity) continue

        let bgColor = "rgba(255, 255, 255, 0.25)"
        let textColor = "white"

        if (button.isPressed) {
          bgColor = "rgba(255, 255, 255, 0.75)"
          textColor = "black"
        } else if (button.isHovered) {
          bgColor = "rgba(255, 255, 255, 0.5)"
          textColor = "black"
        }

        this.ctx.fillStyle = bgColor

        this.ctx.fillRect(
          button.bounds.x,
          button.bounds.y,
          button.bounds.width,
          button.bounds.height
        )

        this.ctx.fillStyle = textColor
        this.ctx.textAlign = "center"
        this.ctx.textBaseline = "middle"
        this.ctx.font = "16px Arial"
        this.ctx.fillText(
          button.text,
          button.bounds.x + button.bounds.width / 2,
          button.bounds.y + button.bounds.height / 2
        )
      }
    }
  }
}
