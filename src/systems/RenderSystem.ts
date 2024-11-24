import { System } from "../ecs/System.js"
import { TransformComponent } from "../components/TransformComponent.js"
import { RenderableComponent } from "../components/RenderableComponent.js"
import { ButtonComponent } from "../components/ButtonComponent.js"
import { IUpdateContext } from "../types/ecs/IUpdateContext.js"
import { Shape } from "../components/RenderableComponent.js"
import { PropComponent } from "../components/PropComponent.js"
import { IEntity } from "../types/ecs/IEntity.js"
import { HealthComponent } from "../components/HealthComponent.js"

export class RenderSystem extends System {
  private ctx: CanvasRenderingContext2D
  private entityMap: Map<number, IEntity>

  constructor(ctx: CanvasRenderingContext2D) {
    super()
    this.ctx = ctx
    this.entityMap = new Map()
    this.initListeners()
  }

  private initListeners() {
    window.addEventListener("resize", () => {
      this.ctx.canvas.width = window.innerWidth
      this.ctx.canvas.height = window.innerHeight
    })
  }

  update(updateContext: IUpdateContext): void {
    const { entities, components } = updateContext

    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)

    const renderables = components.getComponents(RenderableComponent)
    const buttons = components.getComponents(ButtonComponent)

    this.entityMap = new Map([...entities.getEntities()].map((e) => [e.id, e]))

    if (renderables) {
      for (const [entityId, renderable] of renderables) {
        const entity = this.entityMap.get(entityId)
        if (!entity) continue

        const transform = components.getComponent(entity, TransformComponent)
        const prop = components.getComponent(entity, PropComponent)
        const health = components.getComponent(entity, HealthComponent)
        if (!transform) continue

        this.ctx.save()
        this.ctx.translate(transform.position.x, transform.position.y)
        this.ctx.rotate(transform.rotation)

        this.ctx.fillStyle = renderable.color

        let strokeColor = renderable.color

        if (prop?.isInReach) {
          strokeColor = "#ff0"
        }

        this.ctx.strokeStyle = strokeColor

        switch (renderable.shape) {
          case Shape.SQUARE:
            this.ctx.fillRect(0, 0, renderable.width, renderable.height)
            this.ctx.strokeRect(0, 0, renderable.width, renderable.height)
            break
          case Shape.CIRCLE:
            this.ctx.beginPath()
            this.ctx.arc(
              renderable.width / 2,
              renderable.height / 2,
              renderable.width / 2,
              0,
              Math.PI * 2
            )
            this.ctx.fill()
            break
          default:
            break
        }

        if (health) {
          this.ctx.fillStyle = "red"
          this.ctx.fillRect(0, renderable.height + 5, renderable.width, 5)

          this.ctx.fillStyle = "green"
          this.ctx.fillRect(
            0,
            renderable.height + 5,
            (renderable.width * health.health) / health.maxHealth,
            5
          )
        }

        this.ctx.restore()
      }
    }

    buttons && this.renderUI(buttons)
  }

  private renderUI(buttons: Map<number, ButtonComponent>) {
    for (const [entityId, button] of buttons) {
      const entity = this.entityMap.get(entityId)
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

  clear(): void {}
}
